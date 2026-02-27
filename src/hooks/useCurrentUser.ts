import { useState, useEffect } from "react";

export interface CurrentUser {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  location?: string;
  avatar?: string;
}

const defaultUser: CurrentUser = {
  name: "User",
  role: "farmer",
  email: "",
};

export const useCurrentUser = (): {
  user: CurrentUser;
  updateUser: (updates: Partial<CurrentUser>) => void;
  logout: () => void;
} => {
  const [user, setUser] = useState<CurrentUser>(() => {
    try {
      const saved = localStorage.getItem("currentUser");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || parsed.email?.split("@")[0] || "User",
          role: parsed.role || "farmer",
          email: parsed.email || "",
          phone: parsed.phone || "",
          location: parsed.location || "",
        };
      }
    } catch {}
    return defaultUser;
  });

  const updateUser = (updates: Partial<CurrentUser>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("currentUser", JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  return { user, updateUser, logout };
};
