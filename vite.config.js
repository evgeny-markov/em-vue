import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

// GitHub Pages project site: https://evgeny-markov.github.io/em-vue/
const pagesBase = "/em-vue/";

export default defineConfig({
  base: process.env.DEPLOY_PAGES === "true" ? pagesBase : "/",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "127.0.0.1",
  },
});
