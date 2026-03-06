import { useAuth } from "@/contexts/AuthContext";

export interface CurrentUser {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  location?: string;
  avatar?: string;
}

export const useCurrentUser = (): {
  user: CurrentUser;
  updateUser: (updates: Partial<CurrentUser>) => void;
  logout: () => void;
} => {
  const { profile, signOut } = useAuth();

  const user: CurrentUser = {
    name: profile?.display_name || "User",
    role: profile?.role || "farmer",
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    avatar: profile?.avatar_url || "",
  };

  const updateUser = (updates: Partial<CurrentUser>) => {
    // Profile updates should go through Supabase - handled by profile page
    console.log("Profile update requested:", updates);
  };

  const logout = () => {
    signOut();
  };

  return { user, updateUser, logout };
};
