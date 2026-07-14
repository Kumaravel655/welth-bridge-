import { Badge } from "@/components/ui/badge";

const ACCENT_STATUSES = new Set(["in_progress", "confirmed"]);
const MUTED_STATUSES = new Set(["completed", "cancelled"]);

export function StatusBadge({ status }: { status: string }) {
  const variant = ACCENT_STATUSES.has(status)
    ? "accent"
    : MUTED_STATUSES.has(status)
      ? "muted"
      : "default";

  return <Badge variant={variant}>{status.replace(/_/g, " ")}</Badge>;
}
