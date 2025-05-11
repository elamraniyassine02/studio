"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuthGuard(redirectTo = "/login") {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  return { user, isLoading };
}
