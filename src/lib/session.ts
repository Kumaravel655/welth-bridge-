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
