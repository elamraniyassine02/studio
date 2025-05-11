"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-accent" />
          <h1 className="text-2xl font-bold">CredentialSafe</h1>
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:inline">Welcome, {user.username}</span>
            <Button variant="ghost" size="icon" onClick={logout} className="hover:bg-primary-foreground/10">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
