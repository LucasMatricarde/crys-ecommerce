import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "../api/catalog";
import type { ApiError } from "../types/api";
import { StrainTag } from "../components/StrainTag";
import { PriceChip } from "../components/PriceChip";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { LoadingState, EmptyState, ErrorState } from "../components/States";
import { useCart } from "../cart/CartContext";

const PERKS: { icon: "truck" | "shield" | "leaf"; text: string }[] = [
  { icon: "truck", text: "Entrega discreta em 24-48h" },
  { icon: "shield", text: "Laudo de laboratório incluso" },
  { icon: "leaf", text: "Cultivo orgânico, sem solventes" },
];

export function ProductDetailPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();

  const query = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
    retry: (failureCount, error) => (error as unknown as ApiError).kind !== "notFound" && failureCount < 2,
  });

  return (
    <div style={{ padding: "40px 64px 96px" }}>
      <div
        onClick={() => navigate("/")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--text-muted)",
          marginBottom: 32,
        }}
      >
        <Icon name="chevronDown" size={16} style={{ transform: "rotate(90deg)" }} /> voltar ao catálogo
      </div>

      {query.isPending ? (
        <LoadingState label="Carregando produto…" />
      ) : query.isError ? (
        (query.error as unknown as ApiError).kind === "notFound" ? (
          <EmptyState>Produto não encontrado.</EmptyState>
        ) : (
          <ErrorState message={(query.error as unknown as ApiError).message} onRetry={() => query.refetch()} />
        )
      ) : (
        (() => {
          const p = query.data;
          return (
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 56, alignItems: "start" }}>
              <div
                style={{
                  position: "relative",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  background: "rgba(14,59,42,0.6)",
                  aspectRatio: "1 / 1",
                  boxShadow: "var(--inset-frost)",
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(closest-side at 50% 40%, var(--tint-violet-12), transparent 70%)" }} />
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "46%",
                    transform: "translate(-50%,-50%)",
                    width: 220,
                    height: 220,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(closest-side at 40% 40%, var(--amber-honey) 0%, rgba(245,166,35,.95) 45%, rgba(200,118,26,.8) 75%, rgba(122,62,15,.6) 100%)",
                    boxShadow: "var(--shadow-molten)",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 8 }}>
                <StrainTag type={p.strainType} thc={`THC ${p.thcPercent}%`} />
                <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 48, lineHeight: "52px", letterSpacing: "-0.02em", color: "var(--text-primary)", margin: 0 }}>
                  {p.name}
                </h1>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 18, lineHeight: "28px", color: "var(--text-muted)", margin: 0 }}>{p.description}</p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                  {[`THC ${p.thcPercent}%`, `CBD ${p.cbdPercent}%`, `${p.weightGrams}g`].map((d) => (
                    <span key={d} style={{ padding: "6px 12px", borderRadius: "var(--radius-pill)", background: "var(--resin-black-elevated)", boxShadow: "var(--inset-frost)", color: "var(--text-primary)" }}>
                      {d}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
                  <PriceChip price={p.priceFormatted} />
                  <Button variant="primary" size="lg" disabled={!p.available} onClick={() => add(p)} iconLeft={<Icon name="cart" size={18} />}>
                    {p.available ? "Adicionar ao carrinho" : "Indisponível"}
                  </Button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16, paddingTop: 24, borderTop: "1px solid var(--border-frost)" }}>
                  {PERKS.map((perk) => (
                    <div key={perk.text} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)" }}>
                      <Icon name={perk.icon} size={18} color="var(--accent-secondary)" /> {perk.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}

export default ProductDetailPage;
