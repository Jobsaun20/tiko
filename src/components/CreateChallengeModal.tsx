import { useState, useMemo, useEffect, useRef } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChallenges } from "@/hooks/useChallenges";
import { useContacts } from "@/hooks/useContacts";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/supabaseClient";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  refetchChallenges?: () => void;
  preselectedParticipant?: { user_supabase_id: string; [key: string]: any };
}

export function CreateChallengeModal({
  isOpen,
  onClose,
  currentUserId,
  refetchChallenges,
  preselectedParticipant,
}: Props) {
  const { createChallenge } = useChallenges();
  const { contacts, loading: loadingContacts } = useContacts();
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(1);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [avatarsMap, setAvatarsMap] = useState<{ [userId: string]: { avatar_url: string; name: string } }>({});

  const filteredContacts = useMemo(
    () =>
      contacts.filter(
        (c) =>
          !!c.user_supabase_id &&
          c.user_supabase_id !== currentUserId &&
          (c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.email?.toLowerCase().includes(search.toLowerCase()))
      ),
    [contacts, currentUserId, search]
  );

  // Deduplicar por user_supabase_id
  const uniqueFilteredContacts = filteredContacts.filter(
    (contact, index, self) =>
      contact.user_supabase_id &&
      self.findIndex(c => c.user_supabase_id === contact.user_supabase_id) === index
  );

  const userIdsToFetch = useMemo(() => {
    const set = new Set<string>();
    uniqueFilteredContacts.forEach(c => set.add(c.user_supabase_id!));
    selectedContacts.forEach(id => set.add(id));
    return Array.from(set);
  }, [uniqueFilteredContacts, selectedContacts]);

  useEffect(() => {
    if (!userIdsToFetch.length) return;
    (async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, avatar_url")
        .in("id", userIdsToFetch);
      if (!error && data) {
        const newMap: { [userId: string]: { avatar_url: string; name: string } } = {};
        data.forEach(u => {
          newMap[u.id] = { avatar_url: u.avatar_url || "", name: u.name || "" };
        });
        setAvatarsMap(newMap);
      }
    })();
  }, [userIdsToFetch.join(",")]);

  useEffect(() => {
    if (isOpen && preselectedParticipant?.user_supabase_id) {
      setSelectedContacts([preselectedParticipant.user_supabase_id]);
    } else if (isOpen) {
      setSelectedContacts([]);
    }
  }, [isOpen, preselectedParticipant]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setDropdownOpen(e.target.value.trim().length > 0);
  };

  const handleContactToggle = (userSupabaseId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(userSupabaseId)
        ? prev.filter((id) => id !== userSupabaseId)
        : [...prev, userSupabaseId]
    );
    setDropdownOpen(false);
    setSearch("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      creator_id: currentUserId,
      title,
      description,
      amount,
      participants: [...selectedContacts, currentUserId],
    };
    try {
      await createChallenge(data);
      refetchChallenges?.();
      setTitle("");
      setDescription("");
      setAmount(1);
      setSelectedContacts([]);
      setSearch("");
      setDropdownOpen(false);
      onClose();
    } catch (err) {
      alert("Error al crear challenge");
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[430px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <span className="text-pink-500 text-xl">⚡</span>
            {t.challenges.createChallenge}
          </DialogTitle>
          <span className="text-gray-500 text-sm">{t.challenges.inviteContacts}</span>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t.challenges.title}</label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t.challenges.titlePlaceholder}
              required
              className="border border-gray-300 focus:border-pink-400 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.challenges.description}</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={t.challenges.descriptionPlaceholder}
              rows={3}
              required
              className="w-full border border-gray-300 focus:border-pink-400 rounded-lg px-3 py-2 resize-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.challenges.amount}</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={amount}
                min={1}
                onChange={e => setAmount(Number(e.target.value))}
                placeholder={t.challenges.amountPlaceholder}
                required
                className="w-28 border border-gray-300 focus:border-pink-400 rounded-lg"
              />
              <span className="ml-2 text-gray-500">CHF</span>
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-1">{t.challenges.addParticipants}</label>
            <Input
              placeholder={t.challenges.searchPlaceholder}
              value={search}
              onChange={handleSearchChange}
              className="mb-2 border border-gray-300 focus:border-pink-400 rounded-lg"
              autoComplete="off"
              onFocus={() => setDropdownOpen(search.trim().length > 0)}
            />
            {isDropdownOpen && (
              <div
                className="bg-white border border-gray-200 rounded-md shadow p-1 max-h-48 overflow-y-auto z-50 absolute w-full"
                ref={dropdownRef}
              >
                {loadingContacts && (
                  <div className="p-2 text-sm text-gray-400">{t.challenges.loadingContacts}</div>
                )}
                {!loadingContacts && uniqueFilteredContacts.length === 0 && (
                  <div className="p-2 text-sm text-gray-400">{t.challenges.noContactsFound}</div>
                )}
                {!loadingContacts &&
                  uniqueFilteredContacts.map(contact => {
                    const avatar_url = avatarsMap[contact.user_supabase_id!]?.avatar_url || undefined;
                    const name = avatarsMap[contact.user_supabase_id!]?.name?.trim() || contact.name?.trim() || "Anon";
                    return (
                      <div
                        key={contact.id}
                        className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-pink-50 ${
                          selectedContacts.includes(contact.user_supabase_id!) ? "bg-pink-50" : ""
                        }`}
                        onClick={() => handleContactToggle(contact.user_supabase_id!)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedContacts.includes(contact.user_supabase_id!)}
                          readOnly
                          className="accent-pink-500"
                          disabled={
                            preselectedParticipant?.user_supabase_id === contact.user_supabase_id
                          }
                        />
                        <Avatar className="w-7 h-7">
                          <AvatarImage src={avatar_url} alt={name} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-xs flex items-center justify-center">
                            {name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-700">{name}</span>
                      </div>
                    );
                  })}
              </div>
            )}
            {selectedContacts.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedContacts
                  .filter(id => id !== currentUserId)
                  .map(userId => {
                    const contact = contacts.find(c => c.user_supabase_id === userId);
                    const avatar_url = avatarsMap[userId]?.avatar_url || undefined;
                    const name = avatarsMap[userId]?.name?.trim() || contact?.name?.trim() || "Anon";
                    return (
                      <div
                        key={userId}
                        className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg text-xs"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={avatar_url} alt={name} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-xs flex items-center justify-center">
                            {name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-gray-700">{name}</span>
                        <button
                          type="button"
                          className="ml-1 text-gray-400 hover:text-pink-500"
                          onClick={() => handleContactToggle(userId)}
                          aria-label={t.challenges.remove}
                          disabled={preselectedParticipant?.user_supabase_id === userId}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="w-full py-2 rounded-lg border border-gray-300"
            >
              {t.challenges.cancel}
            </Button>
            <Button
              type="submit"
              disabled={loading || !title || !amount || selectedContacts.length === 0}
              className="w-full py-2 font-bold rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow hover:from-pink-600 hover:to-purple-600 transition"
            >
              {loading ? t.challenges.creating : t.challenges.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
