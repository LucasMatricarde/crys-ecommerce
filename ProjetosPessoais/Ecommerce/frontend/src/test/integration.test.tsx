import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "../App";
import { AuthProvider } from "../auth/AuthContext";
import { CartProvider } from "../cart/CartContext";
import { rosin, confirmedView } from "./fixtures";

// Mock the API layer so the integration test exercises the full UI flow
// (browse → login → checkout → tracking) without a live gateway.
vi.mock("../api/catalog", () => ({
  fetchProducts: vi.fn(async () => ({
    content: [rosin],
    totalElements: 1,
    totalPages: 1,
    number: 0,
    size: 12,
    first: true,
    last: true,
  })),
  fetchProduct: vi.fn(async () => rosin),
}));
vi.mock("../api/auth", () => ({
  mintToken: vi.fn(async () => ({ token: "demo.jwt.token", expiresInSeconds: 3600 })),
}));
vi.mock("../api/orders", () => ({
  placeOrder: vi.fn(async () => ({
    id: "order-1",
    productSlug: "rosin-premium",
    quantity: 1,
    amountCents: 8990,
    status: "PENDING",
  })),
  fetchOrderView: vi.fn(async () => confirmedView),
  fetchNotifications: vi.fn(async () => []),
}));

function renderApp() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/"]}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("storefront end-to-end (mocked API)", () => {
  beforeEach(() => localStorage.clear());

  it("browses, logs in, checks out, and tracks an order to CONFIRMED", async () => {
    const user = userEvent.setup();
    renderApp();

    // Browse: catalog loads the live (mocked) product.
    expect(await screen.findByText("Rosin Premium")).toBeInTheDocument();

    // Add to cart.
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    // Log in (demo).
    await user.click(screen.getByRole("button", { name: "Entrar" }));
    expect(await screen.findByRole("heading", { name: "Entrar" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Entrar \(demo\)/ }));

    // Back on catalog, authenticated: open the cart and check out.
    // (the name appears in both the card and the cart drawer)
    expect((await screen.findAllByText("Rosin Premium")).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "Carrinho" }));
    await user.click(await screen.findByRole("button", { name: "Finalizar compra" }));

    // Checkout page → confirm order.
    const confirm = await screen.findByRole("button", { name: /Confirmar pedido/ });
    await user.click(confirm);

    // Tracking page polls and shows the terminal CONFIRMED status.
    expect(await screen.findByText("Confirmado")).toBeInTheDocument();
    const timeline = screen.getByText("Linha do tempo").parentElement as HTMLElement;
    expect(within(timeline).getByText("CONFIRMED")).toBeInTheDocument();
  });
});
