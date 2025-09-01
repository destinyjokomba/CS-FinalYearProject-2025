import { defineConfig } from "cypress";
import { mergeConfig } from "vite";
import viteConfig from "./vite.config"; // adjust extension if vite.config.ts

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: false,
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents() {
      // you can add e2e plugins here later
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: mergeConfig(viteConfig, {
        // any overrides for Cypress, usually none needed
      }),
    },
    indexHtmlFile: "index.html", // 👈 tells Cypress to use your real Vite index.html
    specPattern: "cypress/components/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: false, // optional, disable default support if not needed
  },
});
