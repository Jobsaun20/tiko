import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import { GroupMember } from "./useGroups";

// ---- Tipos ----
export interface GroupRule {
  id: string;
  group_id: string;
  description: string;
  created_by: string | null;
  created_at: string;
  validated: boolean;
  rejected: boolean;
  acceptances: { user_id: string; accepted: boolean }[];
}

export function useGroupRules(groupId: string, members: GroupMember[]) {
  const { user } = useAuthContext();
  const [rules, setRules] = useState<GroupRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const PUSH_ENDPOINT = import.meta.env.VITE_PUSH_SERVER_URL;

  // Obtener reglas y sus aceptaciones
  async function fetchRules() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("group_rules")
      .select("*, acceptances:group_rule_acceptances(user_id, accepted)")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (error) {
      setError(error.message);
      setRules([]);
    } else {
      setRules(data as GroupRule[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (groupId) fetchRules();
    // eslint-disable-next-line
  }, [groupId]);

  // Proponer nueva regla y crear notificaciones persistentes + push
  async function proposeRule(description: string) {
    if (!user) throw new Error("No autenticado");

    // 1. Crear la regla
    const { data, error } = await supabase
      .from("group_rules")
      .insert({
        group_id: groupId,
        description,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // 2. Notificar a todos los miembros excepto quien la propone
    const memberIds = members.map(m => m.id).filter(id => id !== user.id);
    let notifObjects: any[] = [];
    if (data && data.id && memberIds.length > 0) {
      const notifications = memberIds.map(memberId => ({
        user_id: memberId,
        type: "group_rule_proposed",
        title: "New rule proposed",
        message: `${user.user_metadata?.username || "A member"} proposed a new rule: "${description}"`,
        link: `/groups/${groupId}#rules`,
        data: {
          group_id: groupId,
          rule_id: data.id,
          rule_description: description,
          created_by: user.id,
        },
        read: false,
        created_at: new Date().toISOString(),
      }));

      // Inserta notificaciones y recoge los objetos creados
      const { data: notifData, error: notifError } = await supabase.from("notifications").insert(notifications).select();
      if (notifError) {
        console.error("Error creando notificaciones:", notifError, notifications);
      } else if (notifData && notifData.length > 0) {
        notifObjects = notifData;
      }
    }

    // 3. Envía la push a cada notificación creada (solo a miembros que tengan subs)
    if (notifObjects.length > 0) {
      await Promise.all(
        notifObjects.map(async (notif) => {
          try {
            // Busca las subscripciones de este usuario
            const { data: subsData } = await supabase
              .from("push_subscriptions")
              .select("subscription")
              .eq("user_id", notif.user_id);

            const subs = (subsData || []).map((s: any) => s.subscription);

            // Si tiene subs, manda la push
            if (subs.length > 0) {
              await fetch(PUSH_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  subs,
                  notif: {
                    title: notif.title,
                    body: notif.message,
                    url: notif.link
                  }
                })
              });
            }
          } catch (err) {
            console.error("Error enviando push notification:", err);
          }
        })
      );
    }

    await fetchRules();
    // Retorna el primer objeto notif solo si lo necesitas (opcional)
    return notifObjects[0]?.id;
  }

  // Aceptar regla
  async function acceptRule(ruleId: string) {
    if (!user) throw new Error("No autenticado");
    const { error } = await supabase
      .from("group_rule_acceptances")
      .upsert(
        [{ rule_id: ruleId, user_id: user.id, accepted: true }],
        { onConflict: "rule_id,user_id" }
      );
    if (error) throw new Error(error.message);

    await checkAndValidateOrRejectRule(ruleId);
    await fetchRules();
  }

  // Rechazar regla
  async function rejectRule(ruleId: string) {
    if (!user) throw new Error("No autenticado");
    const { error } = await supabase
      .from("group_rule_acceptances")
      .upsert(
        [{ rule_id: ruleId, user_id: user.id, accepted: false }],
        { onConflict: "rule_id,user_id" }
      );
    if (error) throw new Error(error.message);

    await checkAndValidateOrRejectRule(ruleId);
    await fetchRules();
  }

  // Eliminar una regla (por admin o autor) solo si está rechazada
  async function deleteRule(ruleId: string) {
    if (!user) throw new Error("No autenticado");
    const { data: ruleData, error: fetchError } = await supabase
      .from("group_rules")
      .select("*")
      .eq("id", ruleId)
      .maybeSingle();
    if (fetchError) throw new Error(fetchError.message);
    if (!ruleData?.rejected) throw new Error("Solo puedes borrar reglas rechazadas");

    const { error } = await supabase
      .from("group_rules")
      .delete()
      .eq("id", ruleId);

    if (error) throw new Error(error.message);
    await fetchRules();
  }

  // Chequear validación o rechazo global
  async function checkAndValidateOrRejectRule(ruleId: string) {
    const { data, error } = await supabase
      .from("group_rule_acceptances")
      .select("user_id, accepted")
      .eq("rule_id", ruleId);

    if (error) return;

    const memberIds = members.map(m => m.id);
    const acceptances = data?.filter((a: any) => memberIds.includes(a.user_id)) || [];

    if (acceptances.some((a: any) => a.accepted === false)) {
      await supabase
        .from("group_rules")
        .update({ validated: false, rejected: true })
        .eq("id", ruleId);
      return;
    }
    if (
      acceptances.length === memberIds.length &&
      acceptances.every((a: any) => a.accepted)
    ) {
      await supabase
        .from("group_rules")
        .update({ validated: true, rejected: false })
        .eq("id", ruleId);
      return;
    }
    await supabase
      .from("group_rules")
      .update({ validated: false, rejected: false })
      .eq("id", ruleId);
  }

  function hasUserAccepted(rule: GroupRule): boolean {
    if (!user) return false;
    return rule.acceptances.some(a => a.user_id === user.id && a.accepted === true);
  }

  function hasUserRejected(rule: GroupRule): boolean {
    if (!user) return false;
    return rule.acceptances.some(a => a.user_id === user.id && a.accepted === false);
  }

  return {
    rules,
    loading,
    error,
    proposeRule,
    acceptRule,
    rejectRule,
    deleteRule,
    hasUserAccepted,
    hasUserRejected,
    fetchRules,
  };
}
