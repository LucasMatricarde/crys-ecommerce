import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../api/orders";
import type { ApiError } from "../types/api";
import { Button } from "../components/Button";
import { EmptyState } from "../components/States";
import { useCart, formatBrlFromCents } from "../cart/CartContext";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalCents, clear } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // The backend order saga is single-product per order; place an order for the
  // first cart line (the demo flows are keyed off productSlug + quantity).
  const primary = items[0];

  const submit = async () => {
    if (!primary) return;
    setBusy(true);
    setError(null);
    try {
      const order = await placeOrder(primary.slug, primary.qty);
      clear();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      const apiErr = err as ApiError;
      // 401 is handled globally (redirect to login) by the response interceptor.
      setError(apiErr.message);
    } finally {
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: "64px" }}>
        <EmptyState>Seu carrinho está vazio. Volte ao catálogo para escolher um produto.</EmptyState>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="secondary" onClick={() => navigate("/")}>
            Ir ao catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 96px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, color: "var(--text-primary)", margin: "0 0 8px" }}>Checkout</h1>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)", margin: "0 0 32px" }}>
        Confirme seu pedido. O processamento é assíncrono — você acompanhará o status em seguida.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {items.map((it, i) => (
          <div
            key={it.slug}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
              borderRadius: "var(--radius-md)",
              background: i === 0 ? "var(--resin-black-raised)" : "var(--resin-black-elevated)",
              boxShadow: "var(--inset-frost)",
              opacity: i === 0 ? 1 : 0.55,
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>{it.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
                {it.qty} × {it.priceFormatted}
                {i > 0 ? " · (não enviado neste pedido demo)" : ""}
              </div>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 16, color: "var(--accent-primary)" }}>
              {formatBrlFromCents(it.priceCents * it.qty)}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "16px 0", borderTop: "1px solid var(--border-frost)", marginBottom: 24 }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)" }}>Total do carrinho</span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 24, color: "var(--accent-primary)" }}>{formatBrlFromCents(totalCents)}</span>
      </div>

      {error ? (
        <div style={{ color: "var(--iridescent-magenta)", fontFamily: "var(--font-body)", fontSize: 13, marginBottom: 16 }} role="alert">
          {error}
        </div>
      ) : null}

      <Button variant="primary" size="lg" disabled={busy} onClick={() => void submit()} style={{ width: "100%" }}>
        {busy ? "Enviando pedido…" : `Confirmar pedido (${primary.name} × ${primary.qty})`}
      </Button>
    </div>
  );
}

export default CheckoutPage;
