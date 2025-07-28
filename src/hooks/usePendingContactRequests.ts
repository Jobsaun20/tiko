// src/hooks/usePendingContactRequests.ts
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";

export function usePendingContactRequests() {
  const { user } = useAuthContext();
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    if (!user) {
      setPendingRequests([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("contact_requests")
      .select("id, sender_id, status, sender:sender_id(id, name, username, avatar_url, email)")
      .eq("recipient_id", user.id)
      .eq("status", "pending");

    setPendingRequests(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
    // Puedes suscribirte a realtime si quieres auto-actualización
  }, [user]);

  return { pendingRequests, loading, fetchRequests };
}
