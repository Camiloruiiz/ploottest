"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AuthScreen({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [demoSessionValue, setDemoSessionValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setPreviewUrl(null);

    const response = await fetch("/api/v1/auth/magic-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, next }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.error?.message ?? "Unable to send magic link.");
      setLoading(false);
      return;
    }

    setMessage(payload.data.message);
    setPreviewUrl(payload.data.previewUrl ?? null);
    setDemoSessionValue(payload.data.demoSessionValue ?? null);
    if (payload.data.mode === "demo") {
      window.localStorage.setItem("ploottest_demo_user", email);
    }
    if (payload.data.demoSessionValue) {
      document.cookie = `ploottest_session=${payload.data.demoSessionValue}; path=/; SameSite=Lax`;
    }
    setLoading(false);
  }

  return (
    <main className="shell auth-shell">
      <Card className="auth-card">
        <CardHeader>
          <p className="eyebrow">Auth Feature</p>
          <CardTitle>Sign in with a magic link</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="auth-form" onSubmit={onSubmit}>
            <label className="control-field">
              <span>Email</span>
              <Input
                aria-label="Email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send magic link"}
            </Button>
          </form>
          {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}
          {previewUrl ? (
            <Button asChild style={{ marginTop: 12 }}>
              <a href={previewUrl}>Open demo magic link</a>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
