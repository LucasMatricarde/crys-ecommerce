import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const SIZES: Record<Size, CSSProperties & { gap: number }> = {
  sm: { padding: "7px 14px", fontSize: 13, height: 30, gap: 6 },
  md: { padding: "10px 16px", fontSize: 15, height: 38, gap: 6 },
  lg: { padding: "14px 24px", fontSize: 16, height: 50, gap: 8 },
};

const VARIANTS: Record<Variant, CSSProperties> = {
  primary: { background: "var(--amber-core)", color: "var(--text-on-amber)", boxShadow: "none" },
  secondary: {
    background: "var(--resin-black-elevated)",
    color: "var(--text-primary)",
    boxShadow: "var(--inset-frost-strong)",
  },
  ghost: { background: "transparent", color: "var(--text-primary)", boxShadow: "none" },
};

/** CRYS. pill button. Ported from the design-system prototype. */
export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  iconLeft = null,
  iconRight = null,
  children,
  style,
  ...rest
}: ButtonProps) {
  const s = SIZES[size];
  const v = VARIANTS[variant];
  return (
    <button
      type="button"
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        height: s.height,
        padding: s.padding,
        border: "none",
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-display)",
        fontWeight: "var(--weight-bold)" as unknown as number,
        fontSize: s.fontSize,
        lineHeight: "100%",
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "filter .18s ease, transform .12s ease, box-shadow .18s ease",
        ...v,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === "primary") e.currentTarget.style.filter = "brightness(1.08)";
        if (variant === "secondary")
          e.currentTarget.style.boxShadow = "var(--inset-frost-strong), var(--shadow-card)";
        if (variant === "ghost") e.currentTarget.style.background = "rgba(184,240,206,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = "none";
        e.currentTarget.style.background = String(v.background);
        e.currentTarget.style.boxShadow = String(v.boxShadow);
      }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}

export default Button;
