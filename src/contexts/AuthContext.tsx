"use client";

import type { User } from "@/types";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { hashPassword, verifyPassword } from "@/lib/authUtils";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (usernameInput: string, passwordInput: string) => Promise<boolean>;
  register: (usernameInput: string, passwordInput: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database (in a real app, this would be a backend API)
const MOCK_USERS_DB_KEY = "credentialSafeUsers";

const getMockUsers = (): User[] => {
  if (typeof window === "undefined") return [];
  const users = localStorage.getItem(MOCK_USERS_DB_KEY);
  return users ? JSON.parse(users) : [];
};

const saveMockUsers = (users: User[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usersDb, setUsersDb] = useState<User[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setUsersDb(getMockUsers());
    const storedUser = sessionStorage.getItem("credentialSafeCurrentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    setIsLoading(true);
    const existingUser = usersDb.find(u => u.username === usernameInput);
    if (existingUser && await verifyPassword(passwordInput, existingUser.hashedPassword)) {
      const { hashedPassword, ...userToStore } = existingUser; // Don't store hash in session user object
      setUser(userToStore);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("credentialSafeCurrentUser", JSON.stringify(userToStore));
      }
      toast({ title: "Login Successful", description: `Welcome back, ${usernameInput}!` });
      setIsLoading(false);
      return true;
    }
    toast({ title: "Login Failed", description: "Invalid username or password.", variant: "destructive" });
    setIsLoading(false);
    return false;
  };

  const register = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    setIsLoading(true);
    if (usersDb.some(u => u.username === usernameInput)) {
      toast({ title: "Registration Failed", description: "Username already exists.", variant: "destructive" });
      setIsLoading(false);
      return false;
    }
    const hashedPassword = await hashPassword(passwordInput);
    const newUser: User = { id: Date.now().toString(), username: usernameInput, hashedPassword };
    const updatedUsersDb = [...usersDb, newUser];
    setUsersDb(updatedUsersDb);
    saveMockUsers(updatedUsersDb);
    toast({ title: "Registration Successful", description: "Please log in with your new account." });
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("credentialSafeCurrentUser");
    }
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
