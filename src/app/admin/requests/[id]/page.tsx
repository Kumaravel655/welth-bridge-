"use client";

import { ArrowLeft, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { StatusBadge } from "@/components/portal/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { adminApi, type AdminRequest } from "@/lib/admin-api";
import { PortalApiError, type PortalMessage } from "@/lib/portal-api";
import { cn } from "@/lib/utils";

export default function AdminRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [request, setRequest] = React.useState<AdminRequest | null>(null);
  const [messages, setMessages] = React.useState<PortalMessage[] | null>(null);
  const [error, setError] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const load = React.useCallback(() => {
    adminApi.getRequest(id).then(setRequest).catch((err) => {
      setError(err instanceof PortalApiError ? err.message : "Could not load this request.");
    });
    adminApi.listRequestMessages(id).then(setMessages).catch(() => setMessages([]));
  }, [id]);

  React.useEffect(() => {
    if (Number.isFinite(id)) load();
  }, [id, load]);

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = String(new FormData(form).get("body") ?? "").trim();
    if (!body) return;
    setSending(true);
    setError("");
    try {
      await adminApi.sendRequestMessage(id, body);
      form.reset();
      load();
    } catch (err) {
      setError(err instanceof PortalApiError ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href="/admin/requests"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All requests
        </Link>

        {error && (
          <p role="alert" className="mt-6 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {!request && !error && (
          <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading…
          </div>
        )}

        {request && (
          <>
            <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl tracking-tight">{request.title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {request.client_name} · {request.client_email} · {request.client_phone}
                </p>
                <p className="text-sm text-muted-foreground">Service: {request.service_slug}</p>
              </div>
              <StatusBadge status={request.status} />
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">Details</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm">{request.details}</p>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-xl tracking-tight">Messages</h2>
              {messages === null && (
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Loading…
                </div>
              )}
              {messages?.length === 0 && (
                <p className="mt-4 text-sm text-muted-foreground">No messages yet — start the thread below.</p>
              )}
              {messages && messages.length > 0 && (
                <ul className="mt-4 space-y-3">
                  {messages.map((m) => (
                    <li
                      key={m.id}
                      className={cn(
                        "max-w-[85%] rounded-2xl border p-4 text-sm",
                        m.sender_role === "admin"
                          ? "ml-auto border-accent/30 bg-accent/10"
                          : "border-border bg-card"
                      )}
                    >
                      <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                        {m.sender_role === "admin" ? "You (team)" : request.client_name}
                      </p>
                      <p className="whitespace-pre-wrap">{m.body}</p>
                    </li>
                  ))}
                </ul>
              )}

              <form onSubmit={handleSend} className="mt-5 space-y-3">
                <Textarea
                  name="body"
                  required
                  aria-label="Reply to client"
                  placeholder="Write a reply to the client…"
                />
                <Button type="submit" disabled={sending}>
                  {sending ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />}
                  Send reply
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}
