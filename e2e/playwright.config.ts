import path from 'path';

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: /browser\.test\.ts/,
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3123',
    headless: true,
  },
  webServer: {
    command: 'pnpm exec vite --config e2e/fixtures/vite.config.ts',
    port: 3123,
    cwd: path.resolve(__dirname, '..'),
    reuseExistingServer: !process.env.CI,
  },
});
