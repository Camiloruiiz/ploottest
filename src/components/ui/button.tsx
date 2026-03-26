import { Slot } from "@radix-ui/react-slot";

const variants = {
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
  subtle: {
    background: "rgba(255,255,255,0.72)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
  },
} as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: keyof typeof variants;
};

export function Button({ asChild = false, variant = "default", style, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      style={{
        borderRadius: 999,
        padding: "12px 18px",
        fontWeight: 700,
        cursor: "pointer",
        transition: "transform 140ms ease, opacity 140ms ease",
        ...variants[variant],
        ...style,
      }}
      {...props}
    />
  );
}
