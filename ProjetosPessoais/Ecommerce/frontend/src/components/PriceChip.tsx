import type { CSSProperties } from "react";

/** Boxed price tile. Mono amber price on a raised surface. */
export function PriceChip({ price, unit, style }: { price: string; unit?: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 2,
        padding: "8px 12px",
        borderRadius: "var(--radius-sm)",
        background: "var(--resin-black-raised)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: "var(--weight-bold)" as unknown as number,
          fontSize: 20,
          lineHeight: "100%",
          color: "var(--accent-primary)",
          whiteSpace: "nowrap",
        }}
      >
        {price}
      </span>
      {unit ? (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            lineHeight: "100%",
            color: "var(--text-muted)",
            whiteSpace: "nowrap",
          }}
        >
          {unit}
        </span>
      ) : null}
    </div>
  );
}

export default PriceChip;
