"use client";

import * as Label from "@radix-ui/react-label";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PortalApiError, signIn } from "@/lib/portal-api";

export default function PortalSignInPage() {
  const router = useRouter();
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    try {
      const result = (await signIn({ email, password })) as { role?: string };
      const fallback = result.role === "admin" ? "/admin" : "/portal";
      const next = new URLSearchParams(window.location.search).get("next") || fallback;
      router.push(next);
      router.refresh();
    } catch (err) {
      setErrorMsg(
        err instanceof PortalApiError ? err.message : "Incorrect email or password."
      );
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight">Sign in to your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick up where you left off with your service requests and consultations.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="flex flex-col gap-1.5">
          <Label.Root htmlFor="email" className="text-sm font-medium">
            Email
          </Label.Root>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="priya@example.com"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label.Root htmlFor="password" className="text-sm font-medium">
            Password
          </Label.Root>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>

        {status === "error" && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {errorMsg}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader2 className="animate-spin" aria-hidden />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight aria-hidden />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/portal/sign-up" className="font-medium text-accent-strong hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
