import { useEffect, useState } from "react";
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
}

export function useContacts() {
  const { user } = useAuthContext();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch contactos al iniciar o cuando cambia el usuario
  useEffect(() => {
    if (!user) {
      setContacts([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);

    supabase
      .from("contacts")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setContacts([]);
        } else {
          setContacts(data || []);
        }
        setLoading(false);
      });
  }, [user]);

  // Añadir contacto
  async function addContact(contact: Omit<Contact, "id" | "user_id">) {
    if (!user) return;
    const { data, error } = await supabase
      .from("contacts")
      .insert([{ ...contact, user_id: user.id }])
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    setContacts(prev => [...prev, data]);
    return data;
  }

  // Editar contacto
  async function updateContact(contact: Contact) {
    const { data, error } = await supabase
      .from("contacts")
      .update(contact)
      .eq("id", contact.id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    setContacts(prev => prev.map(c => (c.id === contact.id ? data : c)));
    return data;
  }

  // Borrar contacto
  async function deleteContact(id: string) {
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) throw new Error(error.message);
    setContacts(prev => prev.filter(c => c.id !== id));
  }

  return { contacts, loading, error, addContact, updateContact, deleteContact };
}
