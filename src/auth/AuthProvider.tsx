import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { getMe, setAccessTokenProvider } from '../services/api';
import { AuthContext } from './authContext';
import type { AuthContextValue } from './authContext';
import type { UserProfile } from '../types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setProfile(null);
      return null;
    }
    const nextProfile = await getMe();
    setProfile(nextProfile);
    return nextProfile;
  }, []);

  useEffect(() => {
    setAccessTokenProvider(async () => {
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? null;
    });

    let mounted = true;

    async function loadSession() {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      if (data.session) {
        try {
          await refreshProfile();
        } catch {
          setAuthError('Não foi possível carregar seu perfil de acesso.');
        }
      }
      setIsLoading(false);
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setProfile(null);
        return;
      }
      refreshProfile().catch(() => {
        setAuthError('Não foi possível carregar seu perfil de acesso.');
      });
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
      setAccessTokenProvider(null);
    };
  }, [refreshProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthError('Email ou senha inválidos.');
      throw error;
    }
    await refreshProfile();
  }, [refreshProfile]);

  const signOut = useCallback(async () => {
    setAuthError(null);
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    profile,
    isOwner: profile?.role === 'owner' && profile.status === 'active',
    isLoading,
    authError,
    signIn,
    signOut,
    refreshProfile,
  }), [authError, isLoading, profile, refreshProfile, session, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
