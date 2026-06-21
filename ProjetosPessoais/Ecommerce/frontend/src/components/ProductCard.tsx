import { useState } from "react";
import type { CSSProperties } from "react";
import type { Product } from "../types/api";
import { StrainTag } from "./StrainTag";
import { PriceChip } from "./PriceChip";
import { Button } from "./Button";

/** Storefront tile rendered from a live Product DTO. */
export function ProductCard({
  product,
  onAdd,
  onOpen,
  style,
}: {
  product: Product;
  onAdd?: () => void;
  onOpen?: () => void;
  style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  const dataRow = `THC ${product.thcPercent}% · CBD ${product.cbdPercent}% · ${product.weightGrams}g`;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 20,
        borderRadius: "var(--radius-lg)",
        background: hover ? "rgba(26,33,37,0.95)" : "rgba(26,33,37,0.8)",
        boxShadow: hover ? "var(--inset-frost-strong), var(--shadow-card)" : "var(--inset-frost)",
        boxSizing: "border-box",
        transition: "box-shadow .25s ease, background .25s ease, transform .25s ease",
        transform: hover ? "translateY(-2px)" : "none",
        ...style,
      }}
    >
      <div
        onClick={onOpen}
        role={onOpen ? "button" : undefined}
        style={{
          width: "100%",
          height: 160,
          borderRadius: "var(--radius-md)",
          background: "rgba(14,59,42,0.6)",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
          cursor: onOpen ? "pointer" : "default",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            width: 96,
            height: 96,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side at 40% 40%, var(--amber-honey), rgba(200,118,26,.8))",
            opacity: product.available ? 1 : 0.35,
          }}
        />
      </div>
      <div style={{ marginTop: 4 }}>
        <StrainTag type={product.strainType} thc={`THC ${product.thcPercent}%`} />
      </div>
      <div
        onClick={onOpen}
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: "var(--weight-bold)" as unknown as number,
          fontSize: 18,
          lineHeight: "100%",
          color: "var(--text-primary)",
          cursor: onOpen ? "pointer" : "default",
        }}
      >
        {product.name}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: "150%", color: "var(--text-muted)" }}>
        {dataRow}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <PriceChip price={product.priceFormatted} />
        <Button variant="primary" size="sm" disabled={!product.available} onClick={onAdd}>
          {product.available ? "Adicionar" : "Indisponível"}
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
