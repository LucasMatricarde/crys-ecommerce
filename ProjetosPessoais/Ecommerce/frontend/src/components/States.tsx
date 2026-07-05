import type { ReactNode } from "react";
import { Button } from "./Button";

const wrap = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  padding: "64px 24px",
  textAlign: "center" as const,
  fontFamily: "var(--font-body)",
  color: "var(--text-muted)",
};

export function LoadingState({ label = "Carregando…" }: { label?: string }) {
  return (
    <div style={wrap} role="status" aria-live="polite">
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "3px solid var(--border-frost)",
          borderTopColor: "var(--amber-core)",
          animation: "crys-spin 0.8s linear infinite",
        }}
      />
      <span style={{ fontSize: 14 }}>{label}</span>
      <style>{"@keyframes crys-spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  );
}

export function EmptyState({ children = "Nada por aqui." }: { children?: ReactNode }) {
  return (
    <div style={wrap}>
      <span style={{ fontSize: 15 }}>{children}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div style={wrap} role="alert">
      <span style={{ fontSize: 15, color: "var(--text-primary)" }}>{message}</span>
      {onRetry ? (
        <Button variant="secondary" size="md" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
