export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className}
      style={{
        borderRadius: "var(--radius)",
        border: "1px solid var(--border)",
        background: "var(--card)",
        color: "var(--card-foreground)",
        boxShadow: "0 18px 60px rgba(23, 18, 15, 0.05)",
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
