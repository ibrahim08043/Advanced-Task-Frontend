import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const basePath = process.env.VITE_BASE_PATH || "/";

export default defineConfig({
  base: basePath,

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
  },

  build: {
    outDir: "dist",           // ← Changed to standard "dist"
    emptyOutDir: true,
  },

  server: {
    port: Number(process.env.PORT) || 5173,
    host: "0.0.0.0",
  },
});