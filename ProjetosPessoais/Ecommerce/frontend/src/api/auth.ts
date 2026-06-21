import { apiClient } from "./client";
import type { AuthToken } from "../types/api";

/** POST /api/auth/token — public demo mint. Stands in for a real IdP. */
export async function mintToken(subject: string): Promise<AuthToken> {
  const { data } = await apiClient.post<AuthToken>("/auth/token", { subject });
  return data;
}
