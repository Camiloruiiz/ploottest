import { envStatus } from "@/lib/config/env";

export function EnvSummary() {
  const statuses = [
    ["NEXT_PUBLIC_SUPABASE_URL", envStatus.NEXT_PUBLIC_SUPABASE_URL],
    ["NEXT_PUBLIC_SUPABASE_ANON_KEY", envStatus.NEXT_PUBLIC_SUPABASE_ANON_KEY],
    ["SUPABASE_SERVICE_ROLE_KEY (optional)", envStatus.SUPABASE_SERVICE_ROLE_KEY],
  ] as const;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {statuses.map(([label, configured]) => (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "12px 14px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.66)",
            border: "1px solid var(--border)",
          }}
        >
          <code>{label}</code>
          <span style={{ color: configured ? "var(--success)" : "var(--warning)" }}>
            {configured ? "configured" : "missing"}
          </span>
        </div>
      ))}
    </div>
  );
}
