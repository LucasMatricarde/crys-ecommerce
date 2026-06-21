import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "../types/api";

export interface CartItem {
  slug: string;
  name: string;
  priceCents: number;
  priceFormatted: string;
  strainType: Product["strainType"];
  qty: number;
}

interface CartState {
  items: CartItem[];
  count: number;
  totalCents: number;
  add: (product: Product, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CART_KEY = "crys.cart";
const CartContext = createContext<CartState | null>(null);

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartState>(() => {
    const add = (product: Product, qty = 1) =>
      setItems((prev) => {
        const existing = prev.find((it) => it.slug === product.slug);
        if (existing) {
          return prev.map((it) => (it.slug === product.slug ? { ...it, qty: it.qty + qty } : it));
        }
        return [
          ...prev,
          {
            slug: product.slug,
            name: product.name,
            priceCents: product.priceCents,
            priceFormatted: product.priceFormatted,
            strainType: product.strainType,
            qty,
          },
        ];
      });

    const setQty = (slug: string, qty: number) =>
      setItems((prev) =>
        qty <= 0
          ? prev.filter((it) => it.slug !== slug)
          : prev.map((it) => (it.slug === slug ? { ...it, qty } : it)),
      );

    const remove = (slug: string) => setItems((prev) => prev.filter((it) => it.slug !== slug));
    const clear = () => setItems([]);

    const count = items.reduce((s, it) => s + it.qty, 0);
    const totalCents = items.reduce((s, it) => s + it.priceCents * it.qty, 0);

    return { items, count, totalCents, add, setQty, remove, clear };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function formatBrlFromCents(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}
