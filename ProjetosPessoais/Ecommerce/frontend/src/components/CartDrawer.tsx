import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { useCart, formatBrlFromCents } from "../cart/CartContext";

/** Slide-in cart. "Finalizar compra" routes to checkout (guard handles auth). */
export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { items, count, totalCents, remove, setQty } = useCart();

  const checkout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(7,9,10,0.6)",
          backdropFilter: "blur(2px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity .25s ease",
          zIndex: 40,
        }}
      />
      <aside
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: 420,
          maxWidth: "90vw",
          background: "var(--resin-black-surface)",
          boxShadow: "var(--inset-frost), var(--shadow-drop)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .3s cubic-bezier(.2,.8,.2,1)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 24px 16px",
            borderBottom: "1px solid var(--border-frost)",
          }}
        >
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-primary)", margin: 0 }}>
            Carrinho{" "}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>({count})</span>
          </h3>
          <button onClick={onClose} aria-label="Fechar" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}>
            <Icon name="x" size={22} color="var(--text-muted)" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 14, marginTop: 40 }}>
              Seu carrinho está vazio.
            </div>
          ) : (
            items.map((it) => (
              <div
                key={it.slug}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: 14,
                  borderRadius: "var(--radius-md)",
                  background: "var(--resin-black-raised)",
                  boxShadow: "var(--inset-frost)",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "var(--radius-sm)",
                    flexShrink: 0,
                    background: "radial-gradient(closest-side at 40% 40%, var(--amber-honey), rgba(200,118,26,.8))",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>{it.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "6px 0" }}>
                    <button onClick={() => setQty(it.slug, it.qty - 1)} aria-label="Diminuir" style={qtyBtn}>–</button>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-primary)", minWidth: 16, textAlign: "center" }}>{it.qty}</span>
                    <button onClick={() => setQty(it.slug, it.qty + 1)} aria-label="Aumentar" style={qtyBtn}>+</button>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>× {it.priceFormatted}</span>
                  </div>
                  <div onClick={() => remove(it.slug)} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--iridescent-magenta)", cursor: "pointer" }}>
                    remover
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 15, color: "var(--accent-primary)" }}>
                  {formatBrlFromCents(it.priceCents * it.qty)}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ padding: 24, borderTop: "1px solid var(--border-frost)", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)" }}>Total</span>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 24, color: "var(--accent-primary)" }}>
              {formatBrlFromCents(totalCents)}
            </span>
          </div>
          <Button variant="primary" size="lg" disabled={items.length === 0} style={{ width: "100%" }} onClick={checkout}>
            Finalizar compra
          </Button>
        </div>
      </aside>
    </>
  );
}

const qtyBtn = {
  width: 22,
  height: 22,
  borderRadius: "var(--radius-sm)",
  border: "none",
  background: "var(--resin-black-elevated)",
  boxShadow: "var(--inset-frost)",
  color: "var(--text-primary)",
  cursor: "pointer",
  fontFamily: "var(--font-mono)",
  fontSize: 14,
  lineHeight: "100%",
};

export default CartDrawer;
