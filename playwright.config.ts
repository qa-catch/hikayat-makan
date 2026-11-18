import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

// URL d'un site déployé (test de fumée de production, docs/deploiement.md) : aucun serveur local.
const externalURL = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  webServer: externalURL
    ? undefined
    : {
        command: `node node_modules/next/dist/bin/next start --port ${PORT}`,
        url: `http://localhost:${PORT}/ar`,
        reuseExistingServer: !process.env.CI,
      },
  use: {
    baseURL: externalURL ?? `http://localhost:${PORT}`,
    // Local sans téléchargement de navigateur : PW_CHANNEL=msedge. La CI installe Chromium.
    channel: process.env.PW_CHANNEL,
  },
  // Mobile d'abord : un seul profil (Chromium), fenêtre et tactile d'un téléphone.
  projects: [{ name: "mobile", use: { ...devices["Pixel 7"] } }],
});
