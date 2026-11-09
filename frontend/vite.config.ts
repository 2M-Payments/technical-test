import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // O proxy mantém front e API na mesma origem, então o cookie de sessão funciona sem CORS.
    proxy: {
      '/api': { target: 'http://localhost:3333', changeOrigin: true },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts',
    css: false,
  },
});
