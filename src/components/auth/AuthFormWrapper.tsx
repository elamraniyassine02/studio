import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import React from "react";

interface AuthFormWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

export default function AuthFormWrapper({ title, description, children, footerContent }: AuthFormWrapperProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="mb-8 flex flex-col items-center text-center">
        <ShieldCheck className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-primary">CredentialSafe</h1>
        <p className="text-muted-foreground">Your secure credential management solution.</p>
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
          {footerContent && (
            <div className="mt-6 text-center text-sm">
              {footerContent}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
