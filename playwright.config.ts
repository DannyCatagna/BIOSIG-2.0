import { defineConfig } from '@playwright/test';

// BIOSIG_BASE_URL permite ejecutar las mismas comprobaciones sobre el despliegue.
const remoteURL = process.env.BIOSIG_BASE_URL;
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: remoteURL ?? 'http://127.0.0.1:4173',
    browserName: 'chromium',
    launchOptions: process.env.CHROMIUM_PATH
      ? { executablePath: process.env.CHROMIUM_PATH }
      : {},
  },
  webServer: remoteURL ? undefined : {
    command: 'npm run preview -- --host 0.0.0.0 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  },
});
