// Backend DTO types — mirror the CRYS gateway contract (do NOT change the backend).

export type StrainType = "INDICA" | "SATIVA" | "HYBRID";

/** GET /api/catalog/products/{slug} and items of the list page. */
export interface Product {
  id: string;
  slug: string;
  name: string;
  strainType: StrainType;
  thcPercent: number;
  cbdPercent: number;
  weightGrams: number;
  priceCents: number;
  priceFormatted: string;
  imageSlot: string;
  available: boolean;
  description: string;
}

/** Spring Data `Page<T>` JSON shape (subset we consume). */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

/** POST /api/orders 202 response and GET /api/orders/{id}. */
export interface Order {
  id: string;
  productSlug: string;
  quantity: number;
  amountCents: number;
  status: OrderStatus;
}

export type OrderViewStatus = "PENDING" | "RESERVED" | "CONFIRMED" | "CANCELLED";

export interface TimelineEntry {
  step: string;
  at: string; // ISO instant
}

/** GET /api/order-views/{orderId} — CQRS read model. */
export interface OrderView {
  orderId: string;
  productSlug: string;
  quantity: number;
  amountCents: number;
  status: OrderViewStatus;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
}

/** GET /api/notifications?orderId= — protected. */
export interface Notification {
  id: string;
  orderId: string;
  type: string;
  channel: string;
  message: string;
  createdAt: string;
}

/** POST /api/auth/token response (demo mint). */
export interface AuthToken {
  token: string;
  expiresInSeconds: number;
}

/** Normalized API error surfaced to the UI layer. */
export type ApiErrorKind =
  | "unauthorized" // 401
  | "notFound" // 404
  | "validation" // 422 / 400
  | "rateLimited" // 429
  | "network" // no response
  | "server" // 5xx
  | "unknown";

export interface ApiError {
  kind: ApiErrorKind;
  status: number | null;
  message: string;
}
