import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PASSKEY_USERS_KEY } from "@/lib/passkeyStorage";
import type { PasskeyUserRecord } from "@/types/passkey";

export type CurrentUserRole = "farmer" | "merchant" | "expert" | "admin";

export interface CurrentUser {
  name: string;
  role: CurrentUserRole;
  email?: string;
  phone?: string;
  location?: string;
  avatar?: string;
}

export const useCurrentUser = (): {
  user: CurrentUser;
  updateUser: (updates: Partial<CurrentUser>) => Promise<void>;
  logout: () => Promise<void>;
} => {
  const { profile, user: authUser, signOut, refreshProfile, authMode, setPasskeySession } = useAuth();

  const user: CurrentUser = {
    name: profile?.display_name || "User",
    role: (profile?.role as CurrentUserRole) || "farmer",
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    avatar: profile?.avatar_url || "",
  };

  const updateUser = async (updates: Partial<CurrentUser>) => {
    if (!authUser || !profile) {
      return;
    }

    if (authMode === "passkey") {
      const updatedProfile = {
        id: profile.id,
        role: profile.role,
        display_name: updates.name ?? profile.display_name ?? "User",
        phone: updates.phone ?? profile.phone ?? "",
        location: updates.location ?? profile.location ?? "",
        avatar_url: profile.avatar_url ?? "",
      };

      try {
        const rawUsers = localStorage.getItem(PASSKEY_USERS_KEY);
        const users = (rawUsers ? JSON.parse(rawUsers) : {}) as Record<string, PasskeyUserRecord>;
        const record = users[profile.role];
        if (record?.userId === profile.id) {
          users[profile.role] = {
            ...record,
            profile: {
              ...record.profile,
              display_name: updatedProfile.display_name,
              phone: updatedProfile.phone,
              location: updatedProfile.location,
              avatar_url: updatedProfile.avatar_url,
            },
          };
          localStorage.setItem(PASSKEY_USERS_KEY, JSON.stringify(users));
        }
      } catch (error) {
        console.error("Failed to persist passkey profile updates:", error);
      }

      setPasskeySession(updatedProfile);
      return;
    }

    const profileUpdates = {
      display_name: updates.name ?? profile?.display_name ?? authUser.email?.split("@")[0] ?? "User",
      email: updates.email ?? profile?.email ?? authUser.email ?? "",
      phone: updates.phone ?? profile?.phone ?? "",
      location: updates.location ?? profile?.location ?? "",
    };

    const { error } = await supabase
      .from("profiles")
      .update(profileUpdates)
      .eq("user_id", authUser.id);

    if (error) {
      throw error;
    }

    await refreshProfile();
  };

  const logout = () => {
    return signOut();
  };

  return { user, updateUser, logout };
};
