import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import { GroupMember } from "./useGroups";
import { useLanguage } from "@/contexts/LanguageContext";
import locales from "@/locales"; // <-- Importa tu index de idiomas

// ---- Tipos ----
export interface GroupRule {
  id: string;
  group_id: string;
  description: string;
  created_by: string | null;
  created_at: string;
  validated: boolean;
  rejected: boolean;
  pending_deletion?: boolean;
  acceptances: { user_id: string; accepted: boolean }[];
}

export function useGroupRules(groupId: string, members: GroupMember[], groupName: string) {
  const { user } = useAuthContext();
  const { t } = useLanguage();
  const [rules, setRules] = useState<GroupRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const PUSH_ENDPOINT = import.meta.env.VITE_PUSH_SERVER_URL;

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
  }, [groupId]);

  async function proposeRule(description: string) {
  if (!user) throw new Error("No autenticado");

  const { data, error } = await supabase
    .from("group_rules")
    .insert({ group_id: groupId, description, created_by: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);

  const memberIds = members.map(m => m.id).filter(id => id !== user.id);
  let notifObjects: any[] = [];

  if (data?.id && memberIds.length > 0) {
    const notifications = memberIds.map(memberId => ({
      user_id: memberId,
      type: "group_rule_proposed",
      data: {
        rule: description,
        group: groupName,
      },
      link: `/groups/${groupId}#rules`,
      read: false,
      created_at: new Date().toISOString(),
    }));

    const { data: notifData } = await supabase.from("notifications").insert(notifications).select();
    notifObjects = notifData || [];
  }

  // 🚀 PUSH EN IDIOMA DEL RECEPTOR
  if (notifObjects.length > 0) {
    await Promise.all(
      notifObjects.map(async notif => {
        // 1. Consulta idioma del usuario receptor
        const { data: userData } = await supabase
          .from("users")
          .select("language")
          .eq("id", notif.user_id)
          .maybeSingle();
        const lang = userData?.language || "es";
        const locale = locales[lang] || locales["es"];

        // 2. Traduce el texto en el idioma receptor
        const title = locale.groupRulesModal.toastProposedTitle;
        // Puedes personalizar el body según tu archivo de idioma (aquí ejemplo con placeholders)
        const body = locale.groupRulesModal.toastProposedBody
          ? locale.groupRulesModal.toastProposedBody
              .replace("{rule}", description)
              .replace("{group}", groupName)
          : `${title}: "${description}"`;

        // 3. Envía la push
        const { data: subsData } = await supabase
          .from("push_subscriptions")
          .select("subscription")
          .eq("user_id", notif.user_id);

        const subs = (subsData || []).map((s: any) => s.subscription);
        if (subs.length > 0) {
          await fetch(PUSH_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subscriptions: subs,
              notification: {
                title,
                body,
                url: notif.link,
                },
              }),
            });
          }
        })
      );
    }
    await fetchRules();
    return notifObjects[0]?.id;
  }

  async function proposeDeleteRule(ruleId: string) {
    if (!user) throw new Error("No autenticado");

    const { data: ruleData, error: fetchError } = await supabase
      .from("group_rules")
      .select("description")
      .eq("id", ruleId)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    const ruleDescription = ruleData.description;

    const { error: updateError } = await supabase
      .from("group_rules")
      .update({ pending_deletion: true, validated: false, rejected: false })
      .eq("id", ruleId);
    if (updateError) throw new Error(updateError.message);

    await supabase.from("group_rule_acceptances").delete().eq("rule_id", ruleId);

    const memberIds = members.map(m => m.id).filter(id => id !== user.id);

    // 🔥 Obtener nombre del usuario desde la tabla "users"
    const { data: userData } = await supabase
      .from("users")
      .select("username")
      .eq("id", user.id)
      .single();

    const username = userData?.username || "Un miembro";

    const { data: notifData } = await supabase
      .from("notifications")
      .insert(
        memberIds.map(id => ({
          user_id: id,
          type: "group_rule_deletion_proposed",
          data: {
            rule: ruleDescription,
            group: groupName,
          },
          link: `/groups/${groupId}#rules`,
          read: false,
          created_at: new Date().toISOString(),
        }))
      )
      .select();

    if (notifData && notifData.length > 0) {
      await Promise.all(
        notifData.map(async notif => {
          // --- MODIFICACIÓN CLAVE: Push en idioma de cada usuario ---
          // 1. Consulta idioma del receptor
          const { data: userData } = await supabase
            .from("users")
            .select("language")
            .eq("id", notif.user_id)
            .maybeSingle();
          const lang = userData?.language || "es";
          const locale = locales[lang] || locales["es"];

          // 2. Traduce el texto en el idioma receptor
          const title = locale.groupRulesModal.deleteRuleNotificationTitle;
          const body = locale.groupRulesModal.deleteRuleNotificationBody
            .replace("{username}", username)
            .replace("{rule}", ruleDescription);

          const { data: subsData } = await supabase
            .from("push_subscriptions")
            .select("subscription")
            .eq("user_id", notif.user_id);

          const subs = (subsData || []).map((s: any) => s.subscription);
          if (subs.length > 0) {
            await fetch(PUSH_ENDPOINT, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                subscriptions: subs,
                notification: {
                  title,
                  body,
                  url: `/groups/${groupId}#rules`,
                },
              }),
            });
          }
        })
      );
    }

    await fetchRules();
  }

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

  async function checkAndValidateOrRejectRule(ruleId: string) {
    const { data, error } = await supabase
      .from("group_rule_acceptances")
      .select("user_id, accepted")
      .eq("rule_id", ruleId);

    if (error) return;

    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;

    const memberIds = members.map(m => m.id);
    const acceptances = data?.filter((a: any) => memberIds.includes(a.user_id)) || [];

    if (rule.pending_deletion) {
      if (acceptances.some(a => a.accepted === false)) {
        await supabase
          .from("group_rules")
          .update({ pending_deletion: false, validated: true, rejected: false })
          .eq("id", ruleId);
        return;
      }

      if (acceptances.length === memberIds.length && acceptances.every(a => a.accepted)) {
        await supabase.from("group_rules").delete().eq("id", ruleId);

        // Notificación + PUSH para regla eliminada a TODOS (incluido el que la propuso)
        const allMemberIds = members.map(m => m.id); // ⚡ Incluir todos
        const { data: notifData } = await supabase.from("notifications").insert(
          allMemberIds.map(id => ({
            user_id: id,
            type: "group_rule_deleted",
            data: {
              rule: rule.description,
              group: groupName,
            },
            link: `/groups/${groupId}#rules`,
            read: false,
            created_at: new Date().toISOString(),
          }))
        ).select();

        // Push notification a todos en su idioma
        if (notifData && notifData.length > 0) {
          await Promise.all(
            notifData.map(async notif => {
              // --- Consulta idioma receptor ---
              const { data: userData } = await supabase
                .from("users")
                .select("language")
                .eq("id", notif.user_id)
                .maybeSingle();
              const lang = userData?.language || "es";
              const locale = locales[lang] || locales["es"];

              // --- Traduce texto ---
              const title = locale.groupRulesModal.deletedRulePushTitle;
              const body = locale.groupRulesModal.deletedRulePushBody
                .replace("{rule}", rule.description)
                .replace("{group}", groupName);

              const { data: subsData } = await supabase
                .from("push_subscriptions")
                .select("subscription")
                .eq("user_id", notif.user_id);

              const subs = (subsData || []).map((s: any) => s.subscription);
              if (subs.length > 0) {
                await fetch(PUSH_ENDPOINT, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    subscriptions: subs,
                    notification: {
                      title,
                      body,
                      url: `/groups/${groupId}#rules`,
                    },
                  }),
                });
              }
            })
          );
        }
        return;
      }
      return;
    }

    if (acceptances.some(a => a.accepted === false)) {
      await supabase
        .from("group_rules")
        .update({ validated: false, rejected: true })
        .eq("id", ruleId);
      return;
    }

    if (acceptances.length === memberIds.length && acceptances.every(a => a.accepted)) {
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

  async function deleteRule(ruleId: string) {
    if (!user) throw new Error("No autenticado");
    const { data: ruleData, error: fetchError } = await supabase
      .from("group_rules")
      .select("*")
      .eq("id", ruleId)
      .maybeSingle();
    if (fetchError) throw new Error(fetchError.message);
    if (!ruleData?.rejected) throw new Error("Solo puedes borrar reglas rechazadas");

    const { error } = await supabase.from("group_rules").delete().eq("id", ruleId);
    if (error) throw new Error(error.message);
    await fetchRules();
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
    proposeDeleteRule,
    acceptRule,
    rejectRule,
    deleteRule,
    hasUserAccepted,
    hasUserRejected,
    fetchRules,
  };
}
