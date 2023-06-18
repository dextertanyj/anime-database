/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
    proxy: { "/api/graphql": "http://localhost:8080" },
  },
  resolve: {
    alias: [
      { find: "src", replacement: resolve(__dirname, "src") },
      { find: "~shared", replacement: resolve(__dirname, "..", "shared", "src") },
    ],
  },
  build: { outDir: "build" },
  test: { passWithNoTests: true },
  plugins: [react()],
});
