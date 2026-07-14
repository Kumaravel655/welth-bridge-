"use client";

import * as Label from "@radix-ui/react-label";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { PortalNav } from "@/components/portal/portal-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PortalApiError, portalApi } from "@/lib/portal-api";
import { categories, groupsInCategory } from "@/lib/services";

export default function NewPortalRequestPage() {
  const router = useRouter();
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const data = new FormData(e.currentTarget);
    const service_slug = String(data.get("service_slug") ?? "");
    const title = String(data.get("title") ?? "");
    const details = String(data.get("details") ?? "");

    try {
      const created = await portalApi.createRequest({ service_slug, title, details });
      router.push(`/portal/requests/${created.id}`);
    } catch (err) {
      setErrorMsg(err instanceof PortalApiError ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <>
      <PortalNav />
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl tracking-tight">Submit a new request</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us what you need — an expert will review it and get back to you.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="flex flex-col gap-1.5">
            <Label.Root htmlFor="service_slug" className="text-sm font-medium">
              Service
            </Label.Root>
            <select
              id="service_slug"
              name="service_slug"
              required
              defaultValue=""
              className="flex h-11 w-full rounded-xl border border-border bg-card px-4 text-sm shadow-xs transition-colors focus-visible:border-ring"
            >
              <option value="" disabled>
                Select a service
              </option>
              {categories.map((category) => (
                <optgroup key={category.slug} label={category.title}>
                  {groupsInCategory(category.slug).flatMap(({ items }) =>
                    items.map((service) => (
                      <option key={service.slug} value={service.slug}>
                        {service.name}
                      </option>
                    ))
                  )}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label.Root htmlFor="title" className="text-sm font-medium">
              Title
            </Label.Root>
            <Input id="title" name="title" required placeholder="e.g. Register my private limited company" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label.Root htmlFor="details" className="text-sm font-medium">
              Details
            </Label.Root>
            <Textarea
              id="details"
              name="details"
              required
              placeholder="Tell us more about what you need and any deadlines you're working with…"
            />
          </div>

          {status === "error" && (
            <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {errorMsg}
            </p>
          )}

          <Button type="submit" size="lg" disabled={status === "submitting"}>
            {status === "submitting" ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Submitting…
              </>
            ) : (
              <>
                Submit request
                <ArrowRight aria-hidden />
              </>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
