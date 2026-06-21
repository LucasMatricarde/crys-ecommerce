import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { mintToken } from "../api/auth";
import { toApiError } from "../api/client";
import type { ApiError } from "../types/api";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login } = useAuth();
  const [subject, setSubject] = useState("demo");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const next = params.get("next");

  const doLogin = async () => {
    const trimmed = subject.trim();
    if (!trimmed) {
      setError("Informe um identificador.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { token } = await mintToken(trimmed);
      login(token, trimmed);
      navigate(next ? decodeURIComponent(next) : "/", { replace: true });
    } catch (err) {
      setError((err as ApiError).message ?? toApiError(err).message);
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void doLogin();
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "96px 24px" }}>
      <form
        onSubmit={submit}
        style={{
          width: 420,
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          padding: 32,
          borderRadius: "var(--radius-lg)",
          background: "var(--resin-black-surface)",
          boxShadow: "var(--inset-frost), var(--shadow-drop)",
        }}
      >
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: "var(--text-primary)", margin: 0 }}>Entrar</h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            background: "var(--tint-violet-12)",
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--trichome-frost)",
          }}
        >
          <Icon name="shield" size={16} color="var(--iridescent-violet)" />
          Autenticação <strong>demo</strong>: sem senha. Digite qualquer identificador para receber um token de demonstração.
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>
          Identificador (subject)
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="ex.: demo"
            icon={<Icon name="user" size={16} />}
            autoFocus
          />
        </label>

        {error ? <span style={{ color: "var(--iridescent-magenta)", fontFamily: "var(--font-body)", fontSize: 13 }}>{error}</span> : null}

        <Button variant="primary" size="lg" disabled={busy} onClick={() => void doLogin()} style={{ width: "100%" }}>
          {busy ? "Entrando…" : "Entrar (demo)"}
        </Button>
        {/* hidden native submit so pressing Enter in the field submits the form */}
        <button type="submit" hidden aria-hidden="true" />
      </form>
    </div>
  );
}

export default LoginPage;
