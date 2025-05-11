"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateCredentialSecurityHint, CredentialSecurityHintInput } from "@/ai/flows/credential-security-hints";
import React, { useState, useEffect, useCallback } from "react";
import { Lightbulb, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { CredentialSecurityHint } from "@/types";

// Sample user activities - in a real app, this would be dynamic
const userActivities = [
  "Logged in from a new device.",
  "Changed password recently.",
  "Attempted login with incorrect password multiple times.",
  "No security changes in the last 90 days.",
  "Enabled two-factor authentication.",
];

export default function SecurityHintCard() {
  const [hint, setHint] = useState<CredentialSecurityHint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHint = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Pick a random activity for variety in demo
      const randomActivity = userActivities[Math.floor(Math.random() * userActivities.length)];
      const input: CredentialSecurityHintInput = { userActivity: randomActivity };
      const result = await generateCredentialSecurityHint(input);
      setHint(result);
    } catch (e) {
      console.error("Failed to generate security hint:", e);
      setError("Could not load a security tip at this time.");
      setHint(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHint();
  }, [fetchHint]);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Security Tip</CardTitle>
        <Lightbulb className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : hint ? (
          <p className="text-sm text-muted-foreground">{hint.hint}</p>
        ) : (
          <p className="text-sm text-muted-foreground">No security tip available.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" onClick={fetchHint} disabled={isLoading} className="ml-auto">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          New Tip
        </Button>
      </CardFooter>
    </Card>
  );
}
