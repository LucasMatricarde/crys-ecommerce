import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { CartProvider } from "./cart/CartContext";
import type { ApiError } from "./types/api";

// Reuse the existing CRYS design-system tokens (1.2). styles.css @imports the
// fonts + colors + typography + spacing token files from frontend/.
import "../styles.css";
import "./global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Do not retry auth/validation failures; let polling/explicit retry handle the rest.
      retry: (failureCount, error) => {
        const kind = (error as unknown as ApiError)?.kind;
        if (kind === "unauthorized" || kind === "validation" || kind === "notFound") return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
