import { useState, useEffect } from 'react';

interface UserData {
  id?: string;
  email?: string;
  phone?: string;
  username?: string;
  role?: string;
  isFirstLogin?: boolean;
}

interface User {
  name: string;
  role: string;
  avatar?: string;
}

export const useCurrentUser = (): User => {
  const [user, setUser] = useState<User>({
    name: "Guest User",
    role: "farmer"
  });

  useEffect(() => {
    const getUserData = () => {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        try {
          const userData: UserData = JSON.parse(stored);
          return {
            name: userData.username || "User",
            role: userData.role || "farmer",
            avatar: "/placeholder.svg"
          };
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      return {
        name: "Guest User",
        role: "farmer",
        avatar: "/placeholder.svg"
      };
    };

    setUser(getUserData());
  }, []);

  return user;
};