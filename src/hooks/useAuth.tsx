import { useEffect, useState } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isPending: boolean;
  error: string | null;
}

export function useAuth() {
  const [user, setUser]         = useState<User | null>(null);
  const [session, setSession]   = useState<Session | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsPending(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsPending(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      setUser(data.user);
      setSession(data.session);
      return data.user;
    } catch (err) {
      const msg = (err as AuthError).message ?? 'Error al iniciar sesión';
      setError(msg);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsPending(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      setUser(data.user);
      setSession(data.session);
      return data.user;
    } catch (err) {
      const msg = (err as AuthError).message ?? 'Error al registrarse';
      setError(msg);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return { user, session, isPending, error, login, register, logout };
}
