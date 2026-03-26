import { Slot } from "@radix-ui/react-slot";

const variants = {
  default: {
    background:
      "linear-gradient(135deg, rgba(176, 196, 255, 0.92), rgba(128, 157, 255, 0.92) 45%, rgba(133, 227, 255, 0.86))",
    color: "var(--accent-foreground)",
    border: "1px solid rgba(214, 224, 255, 0.24)",
    boxShadow: "0 0 32px var(--glow)",
  },
  outline: {
    background: "rgba(14, 20, 46, 0.62)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
    boxShadow: "inset 0 0 0 1px rgba(142, 159, 255, 0.06)",
  },
  subtle: {
    background: "rgba(16, 21, 48, 0.84)",
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
        letterSpacing: "0.02em",
        transition: "transform 140ms ease, opacity 140ms ease, box-shadow 140ms ease",
        backdropFilter: "blur(16px)",
        ...variants[variant],
        ...style,
      }}
      {...props}
    />
  );
}
