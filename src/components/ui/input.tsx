type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        borderRadius: 14,
        border: "1px solid var(--border)",
        background: "rgba(255,255,255,0.76)",
        color: "var(--foreground)",
        padding: "12px 14px",
        outline: "none",
        ...(props.style ?? {}),
      }}
    />
  );
}
