"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: any | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithOtp: (email: string) => Promise<{ error: any }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  setLocalUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check locally saved Google OAuth user first
    const googleUser = localStorage.getItem("google_user");
    if (googleUser) {
      try {
        setUser(JSON.parse(googleUser));
        setIsLoading(false);
        // We do not return here, we still want to initialize supabase auth below 
        // in case they had a parallel OTP session, but google user takes visual priority.
      } catch (e) {}
    }

    if (!supabase) {
      console.warn("Supabase keys are missing. Auth will be disabled.");
      setIsLoading(false);
      return;
    }

    // Check active sessions and set the user
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session);
      if (session?.user && !googleUser) setUser(session.user);
      setIsLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
      if (session?.user && !localStorage.getItem("google_user")) setUser(session.user);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signInWithOtp = async (email: string) => {
    if (!supabase) return { error: { message: "Auth is not configured." } };
    return await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const verifyOtp = async (email: string, token: string) => {
    if (!supabase) return { error: { message: "Auth is not configured." } };
    return await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
  };

  const setLocalUser = (usr: any) => {
    localStorage.setItem("google_user", JSON.stringify(usr));
    setUser(usr);
  };

  const signOut = async () => {
    localStorage.removeItem("google_user");
    setUser(null);
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signInWithGoogle, signInWithOtp, verifyOtp, signOut, setLocalUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
