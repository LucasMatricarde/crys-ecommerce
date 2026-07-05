import axios, { AxiosError, type AxiosInstance } from "axios";
import type { ApiError, ApiErrorKind } from "../types/api";
import { clearToken, getToken } from "../auth/tokenStore";

const baseURL = import.meta.env.VITE_API_BASE_URL;

/** Single axios instance for the whole app. baseURL is the gateway `/api`. */
export const apiClient: AxiosInstance = axios.create({ baseURL });

// Request interceptor (2.2): attach the bearer token when present.
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401 we clear the session and redirect to /login. We use a hard location
// change so this works outside the React tree (interceptors run anywhere).
function handleUnauthorized(): void {
  clearToken();
  if (window.location.pathname !== "/login") {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.assign(`/login?next=${next}`);
  }
}

function classify(status: number | null): ApiErrorKind {
  if (status === null) return "network";
  if (status === 401) return "unauthorized";
  if (status === 404) return "notFound";
  if (status === 400 || status === 422) return "validation";
  if (status === 429) return "rateLimited";
  if (status >= 500) return "server";
  return "unknown";
}

const MESSAGES: Record<ApiErrorKind, string> = {
  unauthorized: "Sua sessão expirou. Faça login novamente.",
  notFound: "Não encontrado.",
  validation: "Dados inválidos. Verifique e tente novamente.",
  rateLimited: "Muitas requisições. Aguarde um instante e tente de novo.",
  network: "Falha de conexão. Verifique sua rede e tente novamente.",
  server: "Erro no servidor. Tente novamente em instantes.",
  unknown: "Algo deu errado. Tente novamente.",
};

/** Normalize any thrown value into a typed ApiError. */
export function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<{ message?: string; error?: string }>;
    const status = ax.response?.status ?? null;
    const kind = classify(status);
    const serverMsg = ax.response?.data?.message ?? ax.response?.data?.error;
    return { kind, status, message: serverMsg || MESSAGES[kind] };
  }
  return { kind: "unknown", status: null, message: MESSAGES.unknown };
}

// Response interceptor (2.3): normalize errors; on 401 clear+redirect.
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error);
    if (apiError.kind === "unauthorized") {
      handleUnauthorized();
    }
    return Promise.reject(apiError);
  },
);
