import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status?: string;
  user_supabase_id?: string | null; // id del usuario registrado, si existe
}

export function useContacts() {
  const { user } = useAuthContext();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch contactos (reusable)
  const fetchContacts = useCallback(async () => {
    if (!user) {
      setContacts([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("user_id", user.id);
    if (error) {
      setError(error.message);
      setContacts([]);
    } else {
      setContacts(data || []);
    }
    setLoading(false);
  }, [user]);

  // Carga contactos al iniciar o cuando cambia el usuario
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Añadir contacto (busca si es usuario registrado)
  async function addContact(contact: Omit<Contact, "id" | "user_id" | "user_supabase_id">) {
    if (!user) return null;

    // Busca el usuario registrado por email (en tabla users de supabase)
    let userSupabaseId: string | null = null;
    if (contact.email) {
      const { data: foundUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", contact.email)
        .maybeSingle();
      userSupabaseId = foundUser?.id || null;
    }

    const { data, error } = await supabase
      .from("contacts")
      .insert([{ ...contact, user_id: user.id, user_supabase_id: userSupabaseId }])
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);

    // Refresca la lista (más seguro que solo push en arrays)
    await fetchContacts();

    return data;
  }

  // Editar contacto (si cambia el email, actualiza user_supabase_id)
  async function updateContact(contact: Contact) {
    let userSupabaseId: string | null = contact.user_supabase_id || null;
    // Busca usuario registrado si el email ha cambiado o es nuevo
    if (contact.email) {
      const { data: foundUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", contact.email)
        .maybeSingle();
      userSupabaseId = foundUser?.id || null;
    }
    const { data, error } = await supabase
      .from("contacts")
      .update({ ...contact, user_supabase_id: userSupabaseId })
      .eq("id", contact.id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);

    await fetchContacts();
    return data;
  }

  // Borrar contacto
  async function deleteContact(id: string) {
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await fetchContacts();
  }

  // Refetch manual (útil si haces insert desde un layout global)
  const refetch = fetchContacts;

  return { contacts, loading, error, addContact, updateContact, deleteContact, refetch };
}
