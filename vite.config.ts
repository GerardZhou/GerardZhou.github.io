import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite is the development server and production bundler. `defineConfig` adds
// editor autocomplete and type-checking without changing the generated output.
export default defineConfig({
  // This repository is a GitHub Pages *user site* (GerardZhou.github.io), so it
  // is served from the domain root. A project site would need "/repo-name/".
  base: "/",
  // The React plugin transforms JSX and enables fast refresh during `pnpm dev`.
  plugins: [react()],
  build: {
    // Target modern browsers so Vite does not ship unnecessary legacy helpers.
    target: "es2022",
    // Let Vite emit CSS separately so the browser can cache it independently.
    cssCodeSplit: true,
    // Source maps connect production bundles back to these TypeScript files,
    // which makes browser debugging understandable after deployment.
    sourcemap: true,
  },
});
