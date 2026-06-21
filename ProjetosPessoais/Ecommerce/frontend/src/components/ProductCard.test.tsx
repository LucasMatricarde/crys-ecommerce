import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "./ProductCard";
import { rosin, soldOut } from "../test/fixtures";

describe("ProductCard", () => {
  it("renders name, BRL price and THC/CBD data row", () => {
    render(<ProductCard product={rosin} />);
    expect(screen.getByText("Rosin Premium")).toBeInTheDocument();
    expect(screen.getByText("R$ 89,90")).toBeInTheDocument();
    expect(screen.getByText("THC 26% · CBD 0.8% · 3.5g")).toBeInTheDocument();
  });

  it("calls onAdd for an available product", () => {
    const onAdd = vi.fn();
    render(<ProductCard product={rosin} onAdd={onAdd} />);
    fireEvent.click(screen.getByRole("button", { name: "Adicionar" }));
    expect(onAdd).toHaveBeenCalledOnce();
  });

  it("disables add for an unavailable product", () => {
    render(<ProductCard product={soldOut} />);
    expect(screen.getByRole("button", { name: "Indisponível" })).toBeDisabled();
  });
});
