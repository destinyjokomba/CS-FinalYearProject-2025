import { defineConfig } from "cypress";
import { mergeConfig } from "vite";
import viteConfig from "./vite.config.ts";  // 👈 correct extension

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: false,
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents() {
      // no events yet
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: mergeConfig(viteConfig, {
        // Any Cypress-specific overrides go here if needed
      }),
    },
    specPattern: "cypress/components/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: false,
    iindexHtmlFile: "cypress/support/component-index.html", 
  },
});
