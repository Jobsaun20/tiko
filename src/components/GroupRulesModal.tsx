import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGroupRules } from "@/hooks/useGroupRules";
import { Group } from "@/hooks/useGroups";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Hourglass,
  Users,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface GroupRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
}

export function GroupRulesModal({
  isOpen,
  onClose,
  group,
}: GroupRulesModalProps) {
  const { profile: user } = useUserProfile();
  const [newRule, setNewRule] = useState("");
  const [newAmount, setNewAmount] = useState<number | "">(""); // NUEVO estado para la cantidad
  const [submitting, setSubmitting] = useState(false);

  const {
    rules,
    loading,
    proposeRule,
    proposeDeleteRule,
    acceptRule,
    rejectRule,
    hasUserAccepted,
    hasUserRejected,
    deleteRule,
  } = useGroupRules(group.id, group.members, group.name);

  const { toast } = useToast();
  const { t } = useLanguage();
  const m = t.groupRulesModal;

  async function handlePropose() {
    if (!newRule.trim() || newAmount === "" || Number(newAmount) <= 0) return;
    setSubmitting(true);
    try {
      await proposeRule(newRule.trim(), Number(newAmount)); // PASA también la cantidad
      toast({
        title: m.toastProposedTitle,
        description: `${newRule.trim()} – ${m.amountLabel}: ${newAmount} CHF`,
      });
      setNewRule("");
      setNewAmount("");
    } catch (e: any) {
      alert(e.message);
    }
    setSubmitting(false);
  }

  async function handleAccept(ruleId: string) {
    setSubmitting(true);
    try {
      await acceptRule(ruleId);
    } catch (e: any) {
      alert(e.message);
    }
    setSubmitting(false);
  }

  async function handleReject(ruleId: string) {
    setSubmitting(true);
    try {
      await rejectRule(ruleId);
    } catch (e: any) {
      alert(e.message);
    }
    setSubmitting(false);
  }

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

  async function handleProposeDelete(ruleId: string) {
    setSubmitting(true);
    try {
      await proposeDeleteRule(ruleId);
      toast({
        title: m.toastDeleteProposedTitle,
        description: m.toastDeleteProposedDesc,
      });
    } catch (e: any) {
      alert(e.message);
    }
    setSubmitting(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-full max-w-[98vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl !p-0 rounded-2xl shadow-2xl"
        style={{ maxHeight: "95vh" }}
      >
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Users className="h-6 w-6" /> {m.title}
          </DialogTitle>
        </DialogHeader>

        <div
          className="flex flex-col space-y-4 mt-2 px-4 pb-4 pt-2"
          style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <Input
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder={m.newRulePlaceholder}
              disabled={submitting}
              onKeyDown={(e) => {
                if (e.key === "Enter") handlePropose();
              }}
              className="flex-1 min-w-0"
            />
            <Input
              type="number"
              min={0.01}
              step={0.01}
              value={newAmount}
              onChange={(e) =>
                setNewAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder={m.amountPlaceholder ?? "Cantidad (CHF)"}
              disabled={submitting}
              className="w-32"
            />
            <Button
              onClick={handlePropose}
              disabled={
                !newRule.trim() ||
                newAmount === "" ||
                Number(newAmount) <= 0 ||
                submitting
              }
              className="flex items-center gap-1 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" /> {m.propose}
            </Button>
          </div>

          <div>
            {loading ? (
              <div className="text-center text-gray-400 py-4">{m.loading}</div>
            ) : (
              <ul className="space-y-2">
                {rules.length === 0 && (
                  <li className="text-gray-500 text-center">{m.noRules}</li>
                )}
                {rules.map((rule) => {
                  const alreadyActed =
                    hasUserAccepted(rule) || hasUserRejected(rule);
                  const isCreator = rule.created_by === user?.id;
                  return (
                    <li
                      key={rule.id}
                      className={`flex flex-col gap-2 p-3 rounded-lg border w-full
                        ${
                          rule.pending_deletion
                            ? "bg-yellow-100 border-yellow-300"
                            : rule.validated
                            ? "bg-green-50 border-green-200"
                            : rule.rejected
                            ? "bg-red-50 border-red-200"
                            : "bg-yellow-50 border-yellow-200"
                        }`}
                    >
                      {/* DESCRIPCIÓN + CANTIDAD */}
                      <span className="break-words text-base font-medium">
                        {rule.description}
                        {" "}
                        <span className="text-sm text-blue-800 font-semibold">
                          {rule.amount != null
                            ? `– ${m.amountLabel}: ${rule.amount} CHF`
                            : ""}
                        </span>
                      </span>

                      {rule.pending_deletion ? (
                        <>
                          <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-600 text-white w-fit ml-auto">
                            <Hourglass className="h-4 w-4" /> {m.pendingDeletion}
                          </Badge>
                          {alreadyActed ? (
                            <Badge variant="secondary" className="flex items-center gap-1 w-fit ml-auto">
                              <Hourglass className="h-4 w-4" /> {m.pendingOthers}
                            </Badge>
                          ) : (
                            <div className="flex flex-row gap-2 justify-end">
                              <Button size="sm" variant="destructive" onClick={() => handleAccept(rule.id)} disabled={submitting} className="flex items-center gap-1">
                                <Trash2 className="h-4 w-4" /> {m.confirmDelete}
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleReject(rule.id)} disabled={submitting} className="flex items-center gap-1">
                                <X className="h-4 w-4" /> {m.keepRule}
                              </Button>
                            </div>
                          )}
                        </>
                      ) : rule.validated ? (
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="default" className="bg-green-500 text-white flex items-center gap-1 w-fit">
                            <CheckCircle2 className="h-4 w-4" /> {m.validated}
                          </Badge>
                          <Button size="sm" variant="destructive" onClick={() => handleProposeDelete(rule.id)} disabled={submitting} className="flex items-center gap-1">
                            <Trash2 className="h-4 w-4" /> {m.proposeDelete}
                          </Button>
                        </div>
                      ) : rule.rejected ? (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit ml-auto">
                          <X className="h-4 w-4" /> {m.rejected}
                        </Badge>
                      ) : alreadyActed ? (
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit ml-auto">
                          <Hourglass className="h-4 w-4" /> {m.pendingOthers}
                        </Badge>
                      ) : (
                        <div className="flex flex-row gap-2 justify-end">
                          <Button size="sm" variant="outline" onClick={() => handleAccept(rule.id)} disabled={submitting} className="flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> {m.accept}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReject(rule.id)} disabled={submitting} className="flex items-center gap-1">
                            <X className="h-4 w-4" /> {m.reject}
                          </Button>
                        </div>
                      )}
                    </li>
                  );
                })}
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
