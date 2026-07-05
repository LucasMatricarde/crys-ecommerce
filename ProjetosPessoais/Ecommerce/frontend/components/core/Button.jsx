import React from "react";

/**
 * Button — CRYS. pill button.
 * Variants: primary (molten amber), secondary (glass + frost hairline), ghost (text only).
 * Sizes: sm / md / lg.  All radii are full pill.
 */
export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  iconLeft = null,
  iconRight = null,
  children,
  style,
  ...rest
}) {
  const sizes = {
    sm: { padding: "7px 14px", fontSize: 13, height: 30, gap: 6 },
    md: { padding: "10px 16px", fontSize: 15, height: 38, gap: 6 },
    lg: { padding: "14px 24px", fontSize: 16, height: 50, gap: 8 },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: {
      background: "var(--amber-core)",
      color: "var(--text-on-amber)",
      boxShadow: "none",
    },
    secondary: {
      background: "var(--resin-black-elevated)",
      color: "var(--text-primary)",
      boxShadow: "var(--inset-frost-strong)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-primary)",
      boxShadow: "none",
    },
  };
  const v = variants[variant] || variants.primary;

  return (
    <button
      type="button"
      disabled={disabled}
      style={{
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        height: s.height,
        padding: s.padding,
        border: "none",
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-display)",
        fontWeight: "var(--weight-bold)",
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
        if (variant === "secondary") e.currentTarget.style.boxShadow = "var(--inset-frost-strong), var(--shadow-card)";
        if (variant === "ghost") e.currentTarget.style.background = "rgba(184,240,206,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = "none";
        e.currentTarget.style.background = v.background;
        e.currentTarget.style.boxShadow = v.boxShadow;
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}

export default Button;
