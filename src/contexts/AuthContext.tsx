import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { hasSupabaseEnv, supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session as SupabaseSession } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar_url?: string;
  role: string;
}

type AuthMode = "passkey" | "supabase" | "none";

interface PasskeyUser {
  id: string;
  role: string;
  email?: string;
}

interface PasskeySession {
  id: string;
  role: string;
  display_name: string;
  phone?: string;
  location?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: SupabaseUser | PasskeyUser | null;
  session: SupabaseSession | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  authMode: AuthMode;
  setPasskeySession: (session: PasskeySession) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const PASSKEY_SESSION_KEY = "passkey_session";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | PasskeyUser | null>(null);
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>("none");

  const applyPasskeySession = (passkeySession: PasskeySession) => {
    const nextProfile: UserProfile = {
      id: passkeySession.id,
      display_name: passkeySession.display_name,
      email: "",
      phone: passkeySession.phone || "",
      location: passkeySession.location || "",
      avatar_url: passkeySession.avatar_url || "",
      role: passkeySession.role,
    };

    setUser({ id: passkeySession.id, role: passkeySession.role, email: "" });
    setProfile(nextProfile);
    setSession(null);
    setAuthMode("passkey");
  };

  const setPasskeySession = (passkeySession: PasskeySession) => {
    sessionStorage.setItem(PASSKEY_SESSION_KEY, JSON.stringify(passkeySession));
    applyPasskeySession(passkeySession);
    setLoading(false);
  };

  const loadPasskeySession = () => {
    try {
      const rawSession = sessionStorage.getItem(PASSKEY_SESSION_KEY);
      if (!rawSession) return null;
      return JSON.parse(rawSession) as PasskeySession;
    } catch (error) {
      console.error("Failed to parse passkey session:", error);
      return null;
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (profileData) {
        const nextProfile = {
          id: profileData.id,
          display_name: profileData.display_name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          location: profileData.location || "",
          avatar_url: profileData.avatar_url || "",
          role: roleData?.role || "farmer",
        };

        setProfile(nextProfile);
        return nextProfile;
      }

      setProfile(null);
      return null;
    } catch (err) {
      console.error("Error fetching profile:", err);
      setProfile(null);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      if (authMode === "passkey") {
        const passkeySession = loadPasskeySession();
        if (passkeySession) {
          applyPasskeySession(passkeySession);
        }
        return;
      }
      await fetchProfile((user as SupabaseUser).id);
    }
  };

  useEffect(() => {
    const passkeySession = loadPasskeySession();
    if (passkeySession) {
      applyPasskeySession(passkeySession);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authMode === "passkey") return;
    if (!hasSupabaseEnv) {
      setLoading(false);
      setSession(null);
      setUser(null);
      setProfile(null);
      setAuthMode("none");
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setAuthMode(session?.user ? "supabase" : "none");
        if (session?.user) {
          setLoading(true);
          setTimeout(async () => {
            await fetchProfile(session.user.id);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthMode(session?.user ? "supabase" : "none");
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [authMode]);

  const signOut = async () => {
    if (authMode === "passkey") {
      sessionStorage.removeItem(PASSKEY_SESSION_KEY);
      setUser(null);
      setProfile(null);
      setAuthMode("none");
      return;
    }
    if (hasSupabaseEnv) {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      loading, 
      signOut, 
      refreshProfile,
      authMode,
      setPasskeySession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
