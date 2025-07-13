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
    let notificationIds: string[] = [];
    if (data && data.id && memberIds.length > 0) {
      const notifications = memberIds.map(memberId => ({
        user_id: memberId,
        type: "group_rule_proposed",
        title: "Nueva regla propuesta",
        message: `${user.user_metadata?.username || "Un miembro"} ha propuesto una nueva regla: "${description}"`,
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

      const { data: notifData, error: notifError } = await supabase.from("notifications").insert(notifications).select();
      if (notifError) {
        // Info de debugging
        console.error("Error creando notificaciones:", notifError, notifications);
      } else if (notifData && notifData.length > 0) {
        // Guarda los IDs de las notificaciones recién creadas
        notificationIds = notifData.map((n: any) => n.id);
      }
    }

    // 3. (NUEVO) Envía la push a cada notificación creada
    if (notificationIds.length > 0) {
      await Promise.all(
        notificationIds.map(async (notificationId) => {
          try {
            await fetch("https://pic-push-server.vercel.app/api/send-push", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ notification_id: notificationId })
            });
          } catch (err) {
            console.error("Error enviando push notification:", err);
          }
        })
      );
    }

    await fetchRules();
    // Retorna el primer notificationId solo si lo necesitas para el modal (opcional)
    return notificationIds[0];
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
    // Primero, comprobar si la regla está rechazada (opcional)
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
    // 1. Traer todas las aceptaciones/rechazos de los miembros del grupo
    const { data, error } = await supabase
      .from("group_rule_acceptances")
      .select("user_id, accepted")
      .eq("rule_id", ruleId);

    if (error) return;

    const memberIds = members.map(m => m.id);
    const acceptances = data?.filter((a: any) => memberIds.includes(a.user_id)) || [];

    // Si alguno ha rechazado:
    if (acceptances.some((a: any) => a.accepted === false)) {
      await supabase
        .from("group_rules")
        .update({ validated: false, rejected: true })
        .eq("id", ruleId);
      return;
    }
    // Si todos han aceptado y ninguno ha rechazado:
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
    // Si ni aceptada ni rechazada:
    await supabase
      .from("group_rules")
      .update({ validated: false, rejected: false })
      .eq("id", ruleId);
  }

  // Saber si el usuario ha aceptado la regla
  function hasUserAccepted(rule: GroupRule): boolean {
    if (!user) return false;
    return rule.acceptances.some(a => a.user_id === user.id && a.accepted === true);
  }

  // Saber si el usuario ha rechazado la regla
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
    deleteRule, // <- Para usar en tu modal si quieres botón de borrar
    hasUserAccepted,
    hasUserRejected,
    fetchRules,
  };
}
