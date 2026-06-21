import React from "react";

const STRAINS = {
  indica: { label: "Indica", dot: "var(--strain-indica)", bg: "rgba(42,31,74,0.9)" },
  sativa: { label: "Sativa", dot: "var(--strain-sativa)", bg: "rgba(59,42,15,0.9)" },
  hybrid: { label: "Hybrid", dot: "var(--strain-hybrid)", bg: "rgba(14,42,26,0.9)" },
};

/**
 * StrainTag — small pill identifying a cannabis strain class + THC reading.
 * Colored dot + strain label (in the strain's accent) + mono THC value.
 */
export function StrainTag({ type = "indica", thc = "THC 28%", style, ...rest }) {
  const s = STRAINS[type] || STRAINS.indica;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px",
        borderRadius: "var(--radius-pill)",
        background: s.bg,
        boxSizing: "border-box",
        ...style,
      }}
      {...rest}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: "var(--weight-semibold)",
          fontSize: 11,
          lineHeight: "100%",
          color: s.dot,
        }}
      >
        {s.label}
      </span>
      <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 11 }}>·</span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: "var(--weight-regular)",
          fontSize: 11,
          lineHeight: "100%",
          color: "var(--text-primary)",
          whiteSpace: "nowrap",
        }}
      >
        {thc}
      </span>
    </div>
  );
}

export default StrainTag;
