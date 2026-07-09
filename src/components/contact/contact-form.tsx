"use client";

import * as Label from "@radix-ui/react-label";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/lib/site";

type Status = "idle" | "sent";

export function ContactForm() {
  const [status, setStatus] = React.useState<Status>("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const phone = String(data.get("phone") ?? "");
    const message = String(data.get("message") ?? "");

    const subject = encodeURIComponent(`Enquiry from ${name} — website`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="flex h-full min-h-72 flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center"
      >
        <CheckCircle2 className="size-10 text-accent-strong" aria-hidden />
        <h3 className="mt-4 font-display text-xl tracking-tight">
          Almost there
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Your email app has opened with the enquiry drafted — press send and
          we&apos;ll reply within one working day. If it didn&apos;t open,
          write to us directly at{" "}
          <a
            href={`mailto:${site.email}`}
            className="font-medium text-accent-strong underline-offset-4 hover:underline"
          >
            {site.email}
          </a>
          .
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
      <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto">
        Send enquiry
        <ArrowRight aria-hidden />
      </Button>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        We reply within one working day. Your details are used only to answer
        this enquiry.
      </p>
    </form>
  );
}
