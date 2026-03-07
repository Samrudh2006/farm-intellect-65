import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const { profile, user: authUser, signOut, refreshProfile } = useAuth();

  const user: CurrentUser = {
    name: profile?.display_name || "User",
    role: (profile?.role as CurrentUserRole) || "farmer",
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    avatar: profile?.avatar_url || "",
  };

  const updateUser = async (updates: Partial<CurrentUser>) => {
    if (!authUser) {
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

    await supabase.from("notifications").insert({
      user_id: authUser.id,
      title: "Profile updated",
      message: "Your account details were updated successfully.",
      type: "success",
    });

    await refreshProfile();
  };

  const logout = () => {
    return signOut();
  };

  return { user, updateUser, logout };
};
