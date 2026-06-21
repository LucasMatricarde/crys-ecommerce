/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// CRYS. storefront — Vite + React. Dev server proxies nothing; the SPA talks
// directly to the gateway via VITE_API_BASE_URL (CORS is open on the gateway).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: false,
  },
});
