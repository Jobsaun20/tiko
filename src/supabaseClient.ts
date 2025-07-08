import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[supabaseClient.ts] Faltan variables de entorno: VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Revísalo en tu .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
