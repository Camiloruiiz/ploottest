type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        borderRadius: 16,
        border: "1px solid var(--border)",
        background: "rgba(12, 16, 35, 0.88)",
        color: "var(--foreground)",
        padding: "12px 14px",
        outline: "none",
        backdropFilter: "blur(18px)",
        ...(props.style ?? {}),
      }}
    />
  );
}
