import { Slot } from "@radix-ui/react-slot";

const badgeVariants = {
  default: {
    background: "var(--accent)",
    color: "var(--accent-foreground)",
    border: "1px solid transparent",
  },
  outline: {
    background: "transparent",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
  },
} as const;

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
  variant?: keyof typeof badgeVariants;
};

export function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "div";
  const selectedVariant = badgeVariants[variant ?? "default"];

  return (
    <Comp
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "6px 12px",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        ...selectedVariant,
      }}
      {...props}
    />
  );
}
