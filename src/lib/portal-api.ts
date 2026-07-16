import { decodeJwtRole } from "@/lib/session";

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone: string;
  email_verified: boolean;
  role: string;
  open_requests_count: number;
  upcoming_consults_count: number;
};

export type ServiceRequestRecord = {
  id: number;
  user_id: number;
  service_slug: string;
  title: string;
  details: string;
  status: string;
  assigned_admin_id: number | null;
  created_at: string;
  updated_at: string;
};

export type ConsultationRecord = {
  id: number;
  user_id: number;
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

export type ConsultationSlot = { slot: string; available: boolean };

export type PortalMessage = {
  id: number;
  request_id: number;
  sender_id: number;
  sender_role: string;
  body: string;
  attachments: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
};

export class PortalApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parseErrorDetail(res: Response) {
  const body = await res.json().catch(() => ({}));
  return typeof body.detail === "string" ? body.detail : "Something went wrong.";
}

async function portalRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/portal${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new PortalApiError(await parseErrorDetail(res), res.status);
  return res.json();
}

export const portalApi = {
  me: () => portalRequest<UserProfile>("/me"),

  listRequests: () => portalRequest<ServiceRequestRecord[]>("/requests"),
  createRequest: (data: { service_slug: string; title: string; details: string }) =>
    portalRequest<ServiceRequestRecord>("/requests", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getRequest: (id: number) => portalRequest<ServiceRequestRecord>(`/requests/${id}`),

  listMessages: (requestId: number) =>
    portalRequest<PortalMessage[]>(`/requests/${requestId}/messages`),
  sendMessage: (requestId: number, body: string) =>
    portalRequest<PortalMessage>(`/requests/${requestId}/messages`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),

  listConsultations: () => portalRequest<ConsultationRecord[]>("/consultations"),
  createConsultation: (data: {
    service_slug?: string;
    request_id?: number;
    preferred_date: string;
    slot: string;
    mode: string;
    office?: string;
    notes?: string;
  }) =>
    portalRequest<ConsultationRecord>("/consultations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  cancelConsultation: (id: number) =>
    portalRequest<ConsultationRecord>(`/consultations/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "cancelled" }),
    }),
  getSlots: (date: string, office: string) =>
    portalRequest<ConsultationSlot[]>(
      `/consultations/slots?date=${encodeURIComponent(date)}&office=${encodeURIComponent(office)}`
    ),
};

async function authRequest(path: string, data: unknown) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new PortalApiError(await parseErrorDetail(res), res.status);
  return res.json();
}

// The middleware gates /portal and /admin on this cookie. In local dev the
// Next proxy route sets it (httpOnly); in production nginx sends /api/*
// straight to FastAPI, so the proxy never runs and we set it here instead.
const SESSION_COOKIE = "wb_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // matches the backend's token expiry

function setSessionCookie(token: string) {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${SESSION_COOKIE}=${token}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; samesite=lax${secure}`;
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

export const signUp = (data: { name: string; email: string; phone: string; password: string }) =>
  authRequest("/api/auth/sign-up", data);

export async function signIn(data: { email: string; password: string }) {
  const result = await authRequest("/api/auth/sign-in", data);
  // Direct-to-backend response (production nginx): { access_token, token_type }.
  // The backend has already set its own httpOnly access_token cookie for API
  // auth; wb_session only drives the routing middleware.
  if (typeof result.access_token === "string") {
    setSessionCookie(result.access_token);
    return { ok: true, role: decodeJwtRole(result.access_token) ?? "client" };
  }
  // Next proxy response (local dev): { ok, role } — cookie already set.
  return result;
}

export async function signOut() {
  await fetch("/api/auth/sign-out", { method: "POST" });
  clearSessionCookie();
}
