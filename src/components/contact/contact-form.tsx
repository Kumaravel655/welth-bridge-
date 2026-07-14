"use client";

import * as Label from "@radix-ui/react-label";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }

      setStatus("sent");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to send. Please try again."
      );
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="flex h-full min-h-72 flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center"
      >
        <CheckCircle2 className="size-10 text-accent-strong" aria-hidden />
        <h3 className="mt-4 font-display text-xl tracking-tight">
          Enquiry sent!
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thanks for reaching out. We&apos;ve received your message and will
          reply within one working day.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label.Root htmlFor="name" className="text-sm font-medium">
            Your name
          </Label.Root>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            placeholder="Priya Raman"
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
      </div>
      <div className="mt-5 flex flex-col gap-1.5">
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
      <div className="mt-5 flex flex-col gap-1.5">
        <Label.Root htmlFor="message" className="text-sm font-medium">
          What do you need help with?
        </Label.Root>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="e.g. I want to register a private limited company for my software business…"
        />
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive"
        >
          {errorMsg}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full sm:w-auto"
        disabled={status === "sending"}
      >
        {status === "sending" ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          <>
            Send enquiry
            <ArrowRight aria-hidden />
          </>
        )}
      </Button>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        We reply within one working day. Your details are used only to answer
        this enquiry.
      </p>
    </form>
  );
}

