import { defineConfig } from "vite"
import preact from "@preact/preset-vite"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [preact(), tailwindcss()],
  root: ".",
  base: "/admin/",
  build: {
    outDir: "../../public/admin",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat",
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:8787",
    },
  },
})
