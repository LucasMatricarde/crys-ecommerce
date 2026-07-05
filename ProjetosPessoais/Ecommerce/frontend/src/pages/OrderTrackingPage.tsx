import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderView, fetchNotifications } from "../api/orders";
import type { ApiError, OrderView, OrderViewStatus } from "../types/api";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { LoadingState, ErrorState } from "../components/States";
import { formatBrlFromCents } from "../cart/CartContext";

const POLL_MS = 1500;
const TERMINAL: OrderViewStatus[] = ["CONFIRMED", "CANCELLED"];

const STATUS_META: Record<OrderViewStatus, { label: string; color: string }> = {
  PENDING: { label: "Processando", color: "var(--amber-core)" },
  RESERVED: { label: "Estoque reservado", color: "var(--iridescent-cyan)" },
  CONFIRMED: { label: "Confirmado", color: "var(--trichome-core)" },
  CANCELLED: { label: "Cancelado", color: "var(--iridescent-magenta)" },
};

function isTerminal(v: OrderView | undefined): boolean {
  return v !== undefined && TERMINAL.includes(v.status);
}

export function OrderTrackingPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ["order-view", id],
    queryFn: () => fetchOrderView(id),
    // Eventual-consistency tolerance (8.4): an early 404 means the projection
    // is not ready yet — keep retrying instead of erroring out.
    retry: (failureCount, error) => (error as unknown as ApiError).kind === "notFound" && failureCount < 40,
    retryDelay: POLL_MS,
    // Poll while non-terminal; stop once CONFIRMED/CANCELLED (8.3).
    refetchInterval: (q) => (isTerminal(q.state.data) ? false : POLL_MS),
  });

  const view = query.data;

  // Still projecting: query is erroring with 404 but we keep polling via retry.
  const projecting = query.isError && (query.error as unknown as ApiError).kind === "notFound";

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 96px" }}>
      <div
        onClick={() => navigate("/")}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", marginBottom: 32 }}
      >
        <Icon name="chevronDown" size={16} style={{ transform: "rotate(90deg)" }} /> voltar ao catálogo
      </div>

      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, color: "var(--text-primary)", margin: "0 0 4px" }}>Seu pedido</h1>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", marginBottom: 32 }}>#{id}</div>

      {query.isPending || projecting ? (
        <LoadingState label="Processando seu pedido…" />
      ) : query.isError ? (
        <ErrorState message={(query.error as unknown as ApiError).message} onRetry={() => query.refetch()} />
      ) : view ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 24,
              borderRadius: "var(--radius-lg)",
              background: "var(--resin-black-raised)",
              boxShadow: "var(--inset-frost)",
              marginBottom: 24,
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>Status</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: STATUS_META[view.status].color }} />
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-primary)" }}>
                  {STATUS_META[view.status].label}
                </span>
                {!isTerminal(view) ? (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>atualizando…</span>
                ) : null}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>{view.productSlug} × {view.quantity}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 20, color: "var(--accent-primary)", marginTop: 4 }}>
                {formatBrlFromCents(view.amountCents)}
              </div>
            </div>
          </div>

          {view.reason ? (
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "var(--radius-md)",
                background: view.status === "CANCELLED" ? "rgba(233,79,161,0.10)" : "var(--resin-black-elevated)",
                boxShadow: "var(--inset-frost)",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: view.status === "CANCELLED" ? "var(--iridescent-magenta)" : "var(--text-primary)",
                marginBottom: 24,
              }}
              role="status"
            >
              {view.reason}
            </div>
          ) : null}

          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-primary)", margin: "0 0 16px" }}>Linha do tempo</h2>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 0 }}>
            {view.timeline.map((entry, i) => {
              const last = i === view.timeline.length - 1;
              return (
                <li key={`${entry.step}-${entry.at}`} style={{ display: "flex", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--accent-secondary)", marginTop: 4 }} />
                    {!last ? <span style={{ flex: 1, width: 2, background: "var(--border-frost)" }} /> : null}
                  </div>
                  <div style={{ paddingBottom: last ? 0 : 20 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{entry.step}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{new Date(entry.at).toLocaleTimeString("pt-BR")}</div>
                  </div>
                </li>
              );
            })}
          </ol>

          <NotificationsPanel orderId={id} terminal={isTerminal(view)} />

          {isTerminal(view) ? (
            <div style={{ marginTop: 40 }}>
              <Button variant="secondary" onClick={() => navigate("/")}>
                Voltar ao catálogo
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

/** Optional notifications feed (8.5) — polls alongside the order view. */
function NotificationsPanel({ orderId, terminal }: { orderId: string; terminal: boolean }) {
  const query = useQuery({
    queryKey: ["notifications", orderId],
    queryFn: () => fetchNotifications(orderId),
    refetchInterval: terminal ? false : POLL_MS,
    retry: false,
  });

  const notifications = query.data ?? [];
  if (notifications.length === 0) return null;

  return (
    <div style={{ marginTop: 40 }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-primary)", margin: "0 0 16px" }}>Notificações</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              background: "var(--resin-black-elevated)",
              boxShadow: "var(--inset-frost)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-primary)" }}>{n.message}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{n.channel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderTrackingPage;
