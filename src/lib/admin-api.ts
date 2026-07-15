import { PortalApiError, type PortalMessage } from "@/lib/portal-api";

export type AdminStats = {
  clients: number;
  pending_consultations: number;
  upcoming_consultations: number;
  open_requests: number;
  confirmed_subscribers: number;
  newsletters_sent: number;
};

export type AdminConsultation = {
  id: number;
  user_id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_slug: string | null;
  request_id: number | null;
  preferred_date: string;
  slot: string;
  mode: string;
  office: string;
  status: string;
  meeting_link: string | null;
  notes: string | null;
  created_at: string;
};

export type AdminRequest = {
  id: number;
  user_id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_slug: string;
  title: string;
  details: string;
  status: string;
  assigned_admin_id: number | null;
  created_at: string;
  updated_at: string;
};

export type AdminClient = {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  email_verified: boolean;
  requests_count: number;
  consults_count: number;
};

export type AdminNewsletter = {
  id: number;
  subject: string;
  body_mdx: string;
  status: string;
  sent_at: string | null;
  created_at: string;
};

export type AdminSubscriber = {
  id: number;
  email: string;
  phone: string | null;
  source: string | null;
  status: string;
  created_at: string;
};

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/admin${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = typeof body.detail === "string" ? body.detail : "Something went wrong.";
    throw new PortalApiError(detail, res.status);
  }
  return res.json();
}

export const adminApi = {
  stats: () => adminRequest<AdminStats>("/stats"),

  listConsultations: (filters?: { status?: string; office?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status_filter", filters.status);
    if (filters?.office) params.set("office", filters.office);
    const qs = params.toString();
    return adminRequest<AdminConsultation[]>(`/consultations${qs ? `?${qs}` : ""}`);
  },
  updateConsultation: (
    id: number,
    data: {
      status?: string;
      meeting_link?: string;
      notes?: string;
      office?: string;
      preferred_date?: string;
      slot?: string;
    }
  ) =>
    adminRequest<AdminConsultation>(`/consultations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  listRequests: () => adminRequest<AdminRequest[]>("/requests"),
  getRequest: (id: number) => adminRequest<AdminRequest>(`/requests/${id}`),
  updateRequest: (id: number, data: { status?: string; assigned_admin_id?: number }) =>
    adminRequest<AdminRequest>(`/requests/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  listRequestMessages: (id: number) => adminRequest<PortalMessage[]>(`/requests/${id}/messages`),
  sendRequestMessage: (id: number, body: string) =>
    adminRequest<PortalMessage>(`/requests/${id}/messages`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),

  listClients: () => adminRequest<AdminClient[]>("/users"),

  listNewsletters: () => adminRequest<AdminNewsletter[]>("/newsletters"),
  createNewsletter: (data: { subject: string; body_mdx: string }) =>
    adminRequest<AdminNewsletter>("/newsletters", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  sendNewsletter: (id: number) =>
    adminRequest<{ newsletter_id: number; recipients: number }>(`/newsletters/${id}/send`, {
      method: "POST",
    }),
  listSubscribers: () => adminRequest<AdminSubscriber[]>("/subscribers"),
};
