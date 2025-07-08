import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email?: string, password?: string, provider?: 'google') => Promise<{ error: any }>;
  register: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Depuración: log en cada cambio
  const logSession = (tag: string, session: Session | null) => {
    // eslint-disable-next-line no-console
    console.log(`[AuthContext][${tag}] session:`, session);
    // eslint-disable-next-line no-console
    console.log(`[AuthContext][${tag}] user:`, session?.user ?? null);
    if (session?.access_token) {
      // eslint-disable-next-line no-console
      console.log(`[AuthContext][${tag}] access_token:`, session.access_token);
    }
  };

  useEffect(() => {
    // 1. Cargar sesión inicial
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

    // 2. Escuchar cambios de sesión (login/logout)
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

  const login: AuthContextType['login'] = async (email, password, provider) => {
    setLoading(true);
    let error = null;
    try {
      if (provider === 'google') {
        const { error: providerError } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        error = providerError;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        error = signInError;
      }
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
