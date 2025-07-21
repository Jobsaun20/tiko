import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGroupRules } from "@/hooks/useGroupRules";
import { Group } from "@/hooks/useGroups";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Hourglass, Users, Plus, X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface GroupRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
}

export function GroupRulesModal({ isOpen, onClose, group }: GroupRulesModalProps) {
  const { profile: user } = useUserProfile();
  const [newRule, setNewRule] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    rules,
    loading,
    proposeRule,
    acceptRule,
    rejectRule,
    hasUserAccepted,
    hasUserRejected,
    deleteRule
  } = useGroupRules(group.id, group.members);

  const { toast } = useToast();
  const { t } = useLanguage();
  const m = t.groupRulesModal;

  // Proponer nueva regla
  async function handlePropose() {
    if (!newRule.trim()) return;
    setSubmitting(true);
    try {
      await proposeRule(newRule.trim());
      toast({
        title: m.toastProposedTitle,
        description: newRule.trim(),
      });
      setNewRule("");
    } catch (e: any) {
      alert(e.message);
    }
    setSubmitting(false);
  }

  // Aceptar una regla
  async function handleAccept(ruleId: string) {
    setSubmitting(true);
    try {
      await acceptRule(ruleId);
    } catch (e: any) {
      alert(e.message);
    }
    setSubmitting(false);
  }

  // Rechazar una regla
  async function handleReject(ruleId: string) {
    setSubmitting(true);
    try {
      await rejectRule(ruleId);
    } catch (e: any) {
      alert(e.message);
    }
    setSubmitting(false);
  }

  // Borrar una regla (solo admin, solo si rechazada)
  async function handleDelete(ruleId: string) {
    setSubmitting(true);
    try {
      await deleteRule(ruleId);
      toast({ title: m.toastDeletedTitle, description: m.toastDeletedDesc });
    } catch (e: any) {
      alert(e.message);
    }
    setSubmitting(false);
  }

  // Saber si soy admin
  const isAdmin = group.admin_id === user?.id;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          w-full max-w-[98vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl
          !p-0 rounded-2xl shadow-2xl
        "
        style={{ maxHeight: "95vh" }}
      >
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Users className="h-6 w-6" /> {m.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 mt-2 px-4 pb-4 pt-2" style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {/* Formulario para proponer nueva regla */}
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <Input
              value={newRule}
              onChange={e => setNewRule(e.target.value)}
              placeholder={m.newRulePlaceholder}
              disabled={submitting}
              onKeyDown={e => {
                if (e.key === "Enter") handlePropose();
              }}
              className="flex-1 min-w-0"
            />
            <Button
              onClick={handlePropose}
              disabled={!newRule.trim() || submitting}
              className="flex items-center gap-1 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              {m.propose}
            </Button>
          </div>

          {/* Listado de reglas */}
          <div>
            {loading ? (
              <div className="text-center text-gray-400 py-4">{m.loading}</div>
            ) : (
              <ul className="space-y-2">
                {rules.length === 0 && (
                  <li className="text-gray-500 text-center">{m.noRules}</li>
                )}
                {rules.map(rule => (
                  <li
                    key={rule.id}
                    className={`
                      flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-lg border
                      w-full
                      ${rule.validated
                        ? "bg-green-50 border-green-200"
                        : rule.rejected
                          ? "bg-red-50 border-red-200"
                          : "bg-yellow-50 border-yellow-200"}
                    `}
                  >
                    <span className="flex-1 break-words text-base">{rule.description}</span>
                    <div className="flex flex-row flex-wrap gap-2 items-center justify-end sm:justify-end ml-auto">
                      {rule.validated ? (
                        <Badge variant="default" className="bg-green-500 text-white flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> {m.validated}
                        </Badge>
                      ) : rule.rejected ? (
                        <>
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <X className="h-4 w-4" /> {m.rejected}
                          </Badge>
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(rule.id)}
                              disabled={submitting}
                              className="flex items-center gap-1"
                              title={m.deleteTitle}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      ) : hasUserAccepted(rule) ? (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Hourglass className="h-4 w-4" /> {m.pendingOthers}
                        </Badge>
                      ) : hasUserRejected(rule) ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <X className="h-4 w-4" /> {m.youRejected}
                        </Badge>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAccept(rule.id)}
                            disabled={submitting}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle2 className="h-4 w-4" /> {m.accept}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(rule.id)}
                            disabled={submitting}
                            className="flex items-center gap-1"
                          >
                            <X className="h-4 w-4" /> {m.reject}
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <DialogFooter className="p-4 pt-2 border-t flex justify-end">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-1">
            <X className="h-4 w-4" /> {m.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default GroupRulesModal;
