"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { StudentProvider } from "@/contexts/StudentContext";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StudentProvider>
        {children}
        <Toaster />
      </StudentProvider>
    </AuthProvider>
  );
}
