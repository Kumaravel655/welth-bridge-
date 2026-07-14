"use client";

import * as Label from "@radix-ui/react-label";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PortalApiError, signIn, signUp } from "@/lib/portal-api";

export default function PortalSignUpPage() {
  const router = useRouter();
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const phone = String(data.get("phone") ?? "");
    const password = String(data.get("password") ?? "");

    try {
      await signUp({ name, email, phone, password });
      await signIn({ email, password });
      router.push("/portal");
      router.refresh();
    } catch (err) {
      setErrorMsg(err instanceof PortalApiError ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight">Create your client account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Track service requests, book consultations and message our team in one place.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="flex flex-col gap-1.5">
          <Label.Root htmlFor="name" className="text-sm font-medium">
            Full name
          </Label.Root>
          <Input id="name" name="name" autoComplete="name" required placeholder="Priya Raman" />
        </div>
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
          <Label.Root htmlFor="phone" className="text-sm font-medium">
            Phone number
          </Label.Root>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            placeholder="+91 98765 43210"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label.Root htmlFor="password" className="text-sm font-medium">
            Password
          </Label.Root>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
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
              Creating account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight aria-hidden />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/portal/sign-in" className="font-medium text-accent-strong hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
