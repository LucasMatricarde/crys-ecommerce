import React from "react";

/**
 * PriceChip — boxed price tile. Mono amber price on a raised surface.
 * Optional small "unit" caption (e.g. per gram).
 */
export function PriceChip({ price = "R$ 89,90", unit, style, ...rest }) {
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
      {...rest}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: "var(--weight-bold)",
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
