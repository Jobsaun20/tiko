import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Debug log for session changes
  const logSession = (tag: string, session: Session | null) => {
    if (import.meta.env.DEV) {
      // Uncomment if you want to log sessions for debugging:
      // console.log(`[AuthContext][${tag}]`, session);
    }
  };

  useEffect(() => {
    // Load initial session
    const setData = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        logSession('init', data.session);
      } catch (err) {
        if (import.meta.env.DEV) console.error('[AuthContext] Error cargando la sesión:', err);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    setData();

    // Listen to session changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      logSession('onAuthStateChange', session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login: AuthContextType['login'] = async (email, password) => {
    setLoading(true);
    let error = null;
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      error = signInError;
    } catch (err) {
      error = err;
      if (import.meta.env.DEV) console.error('[AuthContext] Error en login:', err);
    } finally {
      setLoading(false);
    }
    return { error };
  };

  const register: AuthContextType['register'] = async (email, password) => {
    setLoading(true);
    let error = null;
    try {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      error = signUpError;
    } catch (err) {
      error = err;
      if (import.meta.env.DEV) console.error('[AuthContext] Error en registro:', err);
    } finally {
      setLoading(false);
    }
    return { error };
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      if (import.meta.env.DEV) console.error('[AuthContext] Error en logout:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext debe usarse dentro de <AuthProvider>');
  return ctx;
}
