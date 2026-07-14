"use client";

import { ArrowLeft, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { PortalNav } from "@/components/portal/portal-nav";
import { StatusBadge } from "@/components/portal/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getService } from "@/lib/services";
import {
  portalApi,
  type PortalMessage,
  type ServiceRequestRecord,
} from "@/lib/portal-api";

export default function PortalRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const requestId = Number(params.id);

  const [request, setRequest] = React.useState<ServiceRequestRecord | null>(null);
  const [messages, setMessages] = React.useState<PortalMessage[] | null>(null);
  const [error, setError] = React.useState("");
  const [draft, setDraft] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const loadMessages = React.useCallback(() => {
    portalApi.listMessages(requestId).then(setMessages).catch(() => {});
  }, [requestId]);

  React.useEffect(() => {
    portalApi
      .getRequest(requestId)
      .then(setRequest)
      .catch(() => setError("Couldn't load this request."));
    loadMessages();
  }, [requestId, loadMessages]);

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft.trim()) return;
    setSending(true);
    try {
      await portalApi.sendMessage(requestId, draft.trim());
      setDraft("");
      loadMessages();
    } finally {
      setSending(false);
    }
  }

  const service = request ? getService(request.service_slug) : undefined;

  return (
    <>
      <PortalNav />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href="/portal/requests"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to requests
        </Link>

        {error && (
          <p role="alert" className="mt-6 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {!request && !error && (
          <div className="flex items-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading…
          </div>
        )}

        {request && (
          <>
            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="font-display text-2xl tracking-tight">{request.title}</h1>
                <StatusBadge status={request.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {service?.name ?? request.service_slug}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">{request.details}</p>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-xl tracking-tight">Messages</h2>

              <div className="mt-4 space-y-3">
                {messages === null && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Loading messages…
                  </div>
                )}
                {messages?.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No messages yet — say hello to get things started.
                  </p>
                )}
                {messages?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[85%] rounded-2xl border border-border p-4 text-sm leading-relaxed ${
                      msg.sender_role === "admin" ? "bg-accent/5" : "ml-auto bg-card"
                    }`}
                  >
                    <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground">
                      {msg.sender_role === "admin" ? "Wealth Bridge team" : "You"}
                    </p>
                    {msg.body}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="mt-5 flex items-end gap-3">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a message…"
                  className="min-h-[3rem]"
                  aria-label="Message"
                />
                <Button type="submit" size="icon" disabled={sending || !draft.trim()}>
                  {sending ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />}
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}
