// Session can arrive via two cookies:
//  - wb_session: the raw JWT, set by the Next sign-in proxy (dev) or by
//    client JS after a direct-to-backend sign-in (prod nginx).
//  - access_token: set by FastAPI itself with the value "Bearer <jwt>".
//    Starlette quotes cookie values containing spaces, and proxies may
//    URL-encode them, so normalize all shapes down to the bare JWT.
export function normalizeSessionToken(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let v = raw.trim();
  if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
  try {
    v = decodeURIComponent(v);
  } catch {
    // not URL-encoded — keep as-is
  }
  if (v.startsWith("Bearer ")) v = v.slice(7);
  return v || null;
}

// The wb_session cookie holds the backend's JWT. We decode (NOT verify) its
// payload here purely for routing decisions — the FastAPI backend verifies
// the signature on every real request, so a forged role claim can redirect
// a browser but never read admin data.
export function decodeJwtRole(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof json.role === "string" ? json.role : null;
  } catch {
    return null;
  }
}
