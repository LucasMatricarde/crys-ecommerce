import React from "react";
import { StrainTag } from "./StrainTag.jsx";
import { PriceChip } from "./PriceChip.jsx";
import { Button } from "../core/Button.jsx";

/**
 * ProductCard — the core storefront tile. Image slot, strain tag, name,
 * THC/CBD data row, price chip + add-to-cart button.
 * Hover lifts the frost hairline and adds a molten amber glow.
 */
export function ProductCard({
  name = "Rosin Premium",
  strain = "indica",
  thc = "THC 28%",
  data = "THC 26% · CBD 0.8% · 3.5g",
  price = "R$ 89,90",
  image = null,
  onAdd,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 280,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 20,
        borderRadius: "var(--radius-lg)",
        background: hover ? "rgba(26,33,37,0.95)" : "rgba(26,33,37,0.8)",
        boxShadow: hover
          ? "var(--inset-frost-strong), var(--shadow-card)"
          : "var(--inset-frost)",
        boxSizing: "border-box",
        transition: "box-shadow .25s ease, background .25s ease, transform .25s ease",
        transform: hover ? "translateY(-2px)" : "none",
        ...style,
      }}
      {...rest}
    >
      {/* image slot */}
      <div
        style={{
          width: "100%",
          height: 160,
          borderRadius: "var(--radius-md)",
          background: image
            ? `center/cover no-repeat url(${image})`
            : "rgba(14,59,42,0.6)",
          flexShrink: 0,
        }}
      />
      <div style={{ marginTop: 4 }}>
        <StrainTag type={strain} thc={thc} />
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: "var(--weight-bold)",
          fontSize: 18,
          lineHeight: "100%",
          color: "var(--text-primary)",
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          lineHeight: "100%",
          color: "var(--text-muted)",
        }}
      >
        {data}
      </div>
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <PriceChip price={price} />
        <Button variant="primary" size="sm" onClick={onAdd}>
          Adicionar
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
