import type { OrderView, Product } from "../types/api";

export const rosin: Product = {
  id: "1",
  slug: "rosin-premium",
  name: "Rosin Premium",
  strainType: "INDICA",
  thcPercent: 26,
  cbdPercent: 0.8,
  weightGrams: 3.5,
  priceCents: 8990,
  priceFormatted: "R$ 89,90",
  imageSlot: "rosin",
  available: true,
  description: "Prensado a frio, sem solventes.",
};

export const soldOut: Product = {
  ...rosin,
  id: "2",
  slug: "shatter-cristal",
  name: "Shatter Cristal",
  available: false,
};

export const confirmedView: OrderView = {
  orderId: "order-1",
  productSlug: "rosin-premium",
  quantity: 1,
  amountCents: 8990,
  status: "CONFIRMED",
  reason: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  timeline: [
    { step: "CREATED", at: new Date().toISOString() },
    { step: "RESERVED", at: new Date().toISOString() },
    { step: "CONFIRMED", at: new Date().toISOString() },
  ],
};

export const cancelledView: OrderView = {
  ...confirmedView,
  orderId: "order-2",
  status: "CANCELLED",
  reason: "Sem estoque disponível",
  timeline: [
    { step: "CREATED", at: new Date().toISOString() },
    { step: "CANCELLED", at: new Date().toISOString() },
  ],
};
