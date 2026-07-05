import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { useCart } from "../cart/CartContext";
import { useAuth } from "../auth/AuthContext";

/** Frosted-glass top nav. Wordmark → home, cart with count, login/logout. */
export function NavBar({ onCart }: { onCart: () => void }) {
  const navigate = useNavigate();
  const { count } = useCart();
  const { isAuthenticated, subject, logout } = useAuth();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        padding: "0 64px",
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "rgba(11,15,12,0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "var(--inset-frost)",
        boxSizing: "border-box",
      }}
    >
      <span
        onClick={() => navigate("/")}
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: "var(--weight-extrabold)" as unknown as number,
          fontSize: 22,
          color: "var(--accent-primary)",
          letterSpacing: "-0.01em",
          cursor: "pointer",
        }}
      >
        CRYS.
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {isAuthenticated ? (
          <>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Icon name="user" size={16} color="var(--accent-secondary)" /> {subject}
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Sair
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            Entrar
          </Button>
        )}
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
          {count > 0 ? (
            <span style={{ position: "absolute", top: -6, right: -8 }}>
              <Badge tone="amber">{count}</Badge>
            </span>
          ) : null}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
