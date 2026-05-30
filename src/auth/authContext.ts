import { createContext, useContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { UserProfile } from '../types';

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isOwner: boolean;
  isLoading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return value;
}
