import { apiClient } from "./client";
import type { Notification, Order, OrderView } from "../types/api";

/** POST /api/orders — protected. Returns 202 with a PENDING order. */
export async function placeOrder(productSlug: string, quantity: number): Promise<Order> {
  const { data } = await apiClient.post<Order>("/orders", { productSlug, quantity });
  return data;
}

/** GET /api/order-views/{orderId} — protected. CQRS read model (may 404 while projecting). */
export async function fetchOrderView(orderId: string): Promise<OrderView> {
  const { data } = await apiClient.get<OrderView>(`/order-views/${orderId}`);
  return data;
}

/** GET /api/notifications?orderId= — protected. */
export async function fetchNotifications(orderId: string): Promise<Notification[]> {
  const { data } = await apiClient.get<Notification[]>("/notifications", { params: { orderId } });
  return data;
}
