import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  plugins: [
    react({
      babel: {
        // Dev-only: adds data-source attributes (file paths) to elements.
        // Kept out of production builds so they don't leak into the live HTML.
        plugins: command === "serve" ? ["./scripts/babel-plugin-jsx-source-location.cjs"] : [],
      },
    }),
    tailwindcss(),
  ],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  base: "./",
  build: { outDir: "dist", emptyOutDir: true },
}));
