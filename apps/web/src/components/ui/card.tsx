export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className}
      style={{
        borderRadius: "var(--radius)",
        border: "1px solid var(--border)",
        background: "var(--card)",
        color: "var(--card-foreground)",
        backdropFilter: "blur(24px)",
        boxShadow:
          "0 22px 70px rgba(2, 4, 14, 0.42), inset 0 1px 0 rgba(221, 228, 255, 0.04), 0 0 0 1px rgba(120, 141, 255, 0.04)",
      }}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} style={{ display: "flex", flexDirection: "column", gap: 16, padding: 24 }} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={className} style={{ margin: 0, fontSize: "1.5rem" }} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} style={{ padding: "0 24px 24px" }} {...props} />;
}
