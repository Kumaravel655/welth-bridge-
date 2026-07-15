"use client";

import { Loader2, UserRound } from "lucide-react";
import * as React from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { adminApi, type AdminClient } from "@/lib/admin-api";

export default function AdminClientsPage() {
  const [clients, setClients] = React.useState<AdminClient[] | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    adminApi
      .listClients()
      .then(setClients)
      .catch(() => setError("Could not load clients — is the backend running?"));
  }, []);

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl tracking-tight">Clients</h1>
        <p className="mt-2 text-sm text-muted-foreground">Everyone with a portal account.</p>

        {error && (
          <p role="alert" className="mt-6 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {clients === null && !error && (
          <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading…
          </div>
        )}

        {clients?.length === 0 && <p className="mt-8 text-sm text-muted-foreground">No clients yet.</p>}

        {clients && clients.length > 0 && (
          <ul className="mt-8 space-y-3">
            {clients.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent-strong">
                    <UserRound className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {c.email} · {c.phone}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>
                    {c.requests_count} request{c.requests_count === 1 ? "" : "s"} · {c.consults_count}{" "}
                    consultation{c.consults_count === 1 ? "" : "s"}
                  </p>
                  <p>Joined {new Date(c.created_at).toLocaleDateString("en-IN")}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
