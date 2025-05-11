"use client";

import Header from "@/components/shared/Header";
import StudentTable from "@/components/dashboard/StudentTable";
import SecurityHintCard from "@/components/dashboard/SecurityHintCard";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user, isLoading } = useAuthGuard();

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          <Skeleton className="h-8 w-1/4 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-40 w-full" />
            </div>
            <div className="lg:col-span-1 space-y-4">
               <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-bold tracking-tight text-primary mb-8">
          Welcome, {user.username}!
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-primary">Student Management</h3>
            <StudentTable />
          </div>
          <div className="lg:col-span-1">
            <SecurityHintCard />
          </div>
        </div>
      </main>
       <footer className="py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CredentialSafe. All rights reserved.
      </footer>
    </div>
  );
}
