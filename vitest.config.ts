import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), EnvironmentPlugin('all')],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './jest.setup.ts',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
    }
  }
});