import React from "react";

/**
 * Badge — tiny pill counter (cart count, notifications).
 * Default amber tone with dark text; "frost" tone for neutral counts.
 */
export function Badge({ children, tone = "amber", style, ...rest }) {
  const tones = {
    amber: { background: "var(--amber-core)", color: "var(--resin-black-base)" },
    frost: { background: "rgba(184,240,206,0.16)", color: "var(--trichome-frost)" },
    violet: { background: "var(--iridescent-violet)", color: "var(--resin-black-base)" },
  };
  const t = tones[tone] || tones.amber;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 16,
        height: 16,
        padding: "0 5px",
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-mono)",
        fontWeight: "var(--weight-bold)",
        fontSize: 9,
        lineHeight: "100%",
        boxSizing: "border-box",
        ...t,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

export default Badge;
