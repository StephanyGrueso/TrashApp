import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      // Aquí puedes agregar eventos personalizados de Cypress si los necesitas
      return config;
    },
    baseUrl: "http://localhost:8100",
  },
});
