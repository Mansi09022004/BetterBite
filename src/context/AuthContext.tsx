import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getProfile, upsertProfile, type Profile } from '../services/profile';

interface AuthResult {
  error: string | null;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  configured: boolean;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<AuthResult & { needsEmailConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  refreshProfile: () => Promise<void>;
}

const NOT_CONFIGURED_MESSAGE =
  "Authentication isn't connected yet — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadProfile = async (userId: string) => {
    setProfileLoading(true);
    const p = await getProfile(userId);
    setProfile(p);
    setProfileLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) await loadProfile(data.session.user.id);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const value: AuthContextValue = {
    user,
    profile,
    loading,
    profileLoading,
    configured: isSupabaseConfigured,
    signUp: async (email, password, fullName, phone) => {
      if (!isSupabaseConfigured) return { error: NOT_CONFIGURED_MESSAGE };
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, phone } },
      });
      if (error) return { error: error.message };
      if (data.user) {
        await upsertProfile(data.user.id, { full_name: fullName, phone });
      }
      return { error: null, needsEmailConfirmation: !data.session };
    },
    signIn: async (email, password) => {
      if (!isSupabaseConfigured) return { error: NOT_CONFIGURED_MESSAGE };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    signInWithGoogle: async () => {
      if (!isSupabaseConfigured) return { error: NOT_CONFIGURED_MESSAGE };
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      return { error: error?.message ?? null };
    },
    signOut: async () => {
      if (!isSupabaseConfigured) return;
      await supabase.auth.signOut();
    },
    resetPassword: async (email) => {
      if (!isSupabaseConfigured) return { error: NOT_CONFIGURED_MESSAGE };
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      return { error: error?.message ?? null };
    },
    refreshProfile: async () => {
      if (user) await loadProfile(user.id);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
