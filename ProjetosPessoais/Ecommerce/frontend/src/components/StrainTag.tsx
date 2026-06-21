import type { CSSProperties } from "react";
import type { StrainType } from "../types/api";

const STRAINS = {
  INDICA: { label: "Indica", dot: "var(--strain-indica)", bg: "rgba(42,31,74,0.9)" },
  SATIVA: { label: "Sativa", dot: "var(--strain-sativa)", bg: "rgba(59,42,15,0.9)" },
  HYBRID: { label: "Hybrid", dot: "var(--strain-hybrid)", bg: "rgba(14,42,26,0.9)" },
} as const;

/** Strain class pill + THC reading. Accepts the backend uppercase StrainType. */
export function StrainTag({
  type = "INDICA",
  thc = "THC —",
  style,
}: {
  type?: StrainType;
  thc?: string;
  style?: CSSProperties;
}) {
  const s = STRAINS[type] ?? STRAINS.INDICA;
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
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: "var(--weight-semibold)" as unknown as number,
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
