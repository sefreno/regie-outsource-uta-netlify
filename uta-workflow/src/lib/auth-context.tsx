"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import type { User } from "./types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Qualification Agent",
    email: "qualification@uta.fr",
    role: "qualification",
  },
  {
    id: "2",
    name: "Confirmation Agent",
    email: "confirmation@uta.fr",
    role: "confirmation",
  },
  {
    id: "3",
    name: "Admin",
    email: "admin@uta.fr",
    role: "admin",
  },
  {
    id: "4",
    name: "Installation Agent",
    email: "installation@uta.fr",
    role: "installation",
  },
  {
    id: "5",
    name: "Administrative Agent",
    email: "administrative@uta.fr",
    role: "administrative",
  },
  {
    id: "6",
    name: "Technical Visit Agent",
    email: "visit@uta.fr",
    role: "technical_visit",
  },
  {
    id: "7",
    name: "Billing Agent",
    email: "billing@uta.fr",
    role: "billing",
  },
];

// In-memory storage for user session (for demo purposes)
let inMemoryUser: User | null = null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(inMemoryUser);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simplified login for demo - just find the user by email
      const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (foundUser) {
        // Set the user in state and in memory
        setUser(foundUser);
        inMemoryUser = foundUser;

        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    inMemoryUser = null;
  };

  // No need for useEffect to check localStorage since we're using in-memory storage
  // for the demo. This makes it work more reliably in static deployments.

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
