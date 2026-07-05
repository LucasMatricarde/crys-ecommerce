import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { CartProvider, useCart } from "./CartContext";
import { rosin } from "../test/fixtures";

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

describe("cart", () => {
  it("adds, increments, and totals in cents", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.add(rosin));
    act(() => result.current.add(rosin));
    expect(result.current.count).toBe(2);
    expect(result.current.totalCents).toBe(17980);
  });

  it("removes via setQty(0) and persists to localStorage", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.add(rosin));
    expect(localStorage.getItem("crys.cart")).toContain("rosin-premium");
    act(() => result.current.setQty("rosin-premium", 0));
    expect(result.current.count).toBe(0);
  });
});
