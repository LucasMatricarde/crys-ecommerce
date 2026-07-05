import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchProducts } from "../api/catalog";
import type { ApiError, StrainType } from "../types/api";
import { ProductCard } from "../components/ProductCard";
import { ResinBlob } from "../components/ResinBlob";
import { Button } from "../components/Button";
import { LoadingState, EmptyState, ErrorState } from "../components/States";
import { useCart } from "../cart/CartContext";

const PAGE_SIZE = 12;
const FILTERS: { label: string; value: StrainType | undefined }[] = [
  { label: "Todos", value: undefined },
  { label: "Indica", value: "INDICA" },
  { label: "Sativa", value: "SATIVA" },
  { label: "Hybrid", value: "HYBRID" },
];

export function CatalogPage() {
  const navigate = useNavigate();
  const { add } = useCart();
  const [strainType, setStrainType] = useState<StrainType | undefined>(undefined);
  const [page, setPage] = useState(0);

  const query = useQuery({
    queryKey: ["products", strainType ?? "ALL", page],
    queryFn: () => fetchProducts({ strainType, page, size: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  const setFilter = (value: StrainType | undefined) => {
    setStrainType(value);
    setPage(0);
  };

  return (
    <div>
      <section style={{ position: "relative", overflow: "hidden", padding: "96px 64px 48px" }}>
        <div
          style={{
            position: "absolute",
            right: -40,
            top: 40,
            width: 760,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(400px 300px at 50% 50%, var(--tint-violet-12) 0%, var(--tint-magenta-06) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "absolute", right: 120, top: 70, pointerEvents: "none" }}>
          <ResinBlob size={420} />
        </div>
        <div style={{ position: "relative", maxWidth: 560 }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 72,
              lineHeight: "80px",
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Resina viva.
            <br />
            Pura arte.
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 18, lineHeight: "28px", color: "var(--text-muted)", margin: "20px 0 0", maxWidth: 480 }}>
            Extrações artesanais de cannabis. Pureza, potência e design que você merece.
          </p>
        </div>
      </section>

      <section style={{ padding: "24px 64px 96px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, letterSpacing: "-0.01em", color: "var(--text-primary)", margin: 0 }}>
            Catálogo
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            {FILTERS.map((f) => (
              <Button
                key={f.label}
                variant={strainType === f.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        {query.isPending ? (
          <LoadingState label="Carregando catálogo…" />
        ) : query.isError ? (
          <ErrorState message={(query.error as unknown as ApiError).message} onRetry={() => query.refetch()} />
        ) : query.data.content.length === 0 ? (
          <EmptyState>Nenhum produto encontrado para esse filtro.</EmptyState>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
              {query.data.content.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={() => add(p)} onOpen={() => navigate(`/product/${p.slug}`)} />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 40 }}>
              <Button variant="secondary" size="sm" disabled={query.data.first} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                Anterior
              </Button>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
                página {query.data.number + 1} / {Math.max(1, query.data.totalPages)}
              </span>
              <Button variant="secondary" size="sm" disabled={query.data.last} onClick={() => setPage((p) => p + 1)}>
                Próxima
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default CatalogPage;
