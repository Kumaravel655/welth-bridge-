"use client";

import { FolderOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { StatusBadge } from "@/components/portal/status-badge";
import { adminApi, type AdminRequest } from "@/lib/admin-api";
import { PortalApiError } from "@/lib/portal-api";

const STATUSES = ["submitted", "in_review", "in_progress", "needs_docs", "completed", "cancelled"];

export default function AdminRequestsPage() {
  const [items, setItems] = React.useState<AdminRequest[] | null>(null);
  const [error, setError] = React.useState("");
  const [savingId, setSavingId] = React.useState<number | null>(null);

  const load = React.useCallback(() => {
    adminApi
      .listRequests()
      .then(setItems)
      .catch(() => setError("Could not load requests — is the backend running?"));
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(id: number, status: string) {
    setSavingId(id);
    setError("");
    try {
      const updated = await adminApi.updateRequest(id, { status });
      setItems((prev) => prev?.map((r) => (r.id === id ? updated : r)) ?? null);
    } catch (err) {
      setError(err instanceof PortalApiError ? err.message : "Something went wrong.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl tracking-tight">Service requests</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every request filed from the client portal, newest first.
        </p>

        {error && (
          <p role="alert" className="mt-6 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {items === null && !error && (
          <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading…
          </div>
        )}

        {items?.length === 0 && <p className="mt-8 text-sm text-muted-foreground">No service requests yet.</p>}

        {items && items.length > 0 && (
          <ul className="mt-8 space-y-3">
            {items.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent-strong">
                    <FolderOpen className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/admin/requests/${r.id}`}
                      className="font-medium hover:text-accent-strong hover:underline"
                    >
                      {r.title}
                    </Link>
                    <p className="truncate text-sm text-muted-foreground">
                      {r.client_name} · {r.client_email} · {r.service_slug}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={r.status} />
                  <select
                    aria-label={`Change status of ${r.title}`}
                    value={r.status}
                    disabled={savingId === r.id}
                    onChange={(e) => changeStatus(r.id, e.target.value)}
                    className="flex h-9 rounded-xl border border-border bg-card px-3 text-sm shadow-xs transition-colors focus-visible:border-ring disabled:opacity-50"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
