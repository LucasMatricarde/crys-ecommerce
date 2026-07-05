import React from "react";
import { Icon } from "../core/Icon.jsx";
import { Badge } from "../core/Badge.jsx";

/**
 * NavBar — frosted-glass top navigation. Wordmark, center links, cart with badge.
 * Sticky glass: translucent resin surface + blur + frost hairline underline.
 */
export function NavBar({
  brand = "CRYS.",
  links = ["Extrações", "Flores", "Kits", "Sobre"],
  active = "Extrações",
  cartCount = 2,
  onCart,
  onNavigate,
  style,
  ...rest
}) {
  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        padding: "0 64px",
        background: "rgba(11,15,12,0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "var(--inset-frost)",
        boxSizing: "border-box",
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: "var(--weight-extrabold)",
          fontSize: 22,
          lineHeight: "100%",
          color: "var(--accent-primary)",
          letterSpacing: "-0.01em",
          cursor: "pointer",
        }}
      >
        {brand}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {links.map((l) => (
          <span
            key={l}
            onClick={() => onNavigate && onNavigate(l)}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: l === active ? "var(--weight-semibold)" : "var(--weight-regular)",
              fontSize: 14,
              lineHeight: "100%",
              color: l === active ? "var(--text-primary)" : "var(--text-muted)",
              cursor: "pointer",
              transition: "color .15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = l === active ? "var(--text-primary)" : "var(--text-muted)")}
          >
            {l}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Icon name="search" size={20} color="var(--text-primary)" style={{ cursor: "pointer", opacity: 0.9 }} />
        <button
          type="button"
          onClick={onCart}
          aria-label="Carrinho"
          style={{
            position: "relative",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Icon name="cart" size={22} color="var(--text-primary)" style={{ opacity: 0.9 }} />
          {cartCount > 0 ? (
            <span style={{ position: "absolute", top: -6, right: -8 }}>
              <Badge tone="amber">{cartCount}</Badge>
            </span>
          ) : null}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
