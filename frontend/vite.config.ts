import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Served from the domain root in dev and on single-origin hosts; on GitHub Pages
// project sites the app lives under a `/<repo>/` sub-path, supplied at build time
// via VITE_BASE_PATH so asset URLs resolve correctly.
export default defineConfig(({ mode }) => {
  const deploymentEnvironment = loadEnv(mode, process.cwd(), '');
  if (mode === 'production' && !deploymentEnvironment.VITE_API_BASE_URL?.trim()) {
    throw new Error('VITE_API_BASE_URL must be set for a production build.');
  }

  return {
    base: deploymentEnvironment.VITE_BASE_PATH || '/',
    plugins: [react()],
    test: {
      environment: 'jsdom',
      include: ['tests/**/*.test.{ts,tsx}'],
      setupFiles: './tests/setup.ts',
      clearMocks: true,
      restoreMocks: true,
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        reporter: ['text', 'html', 'lcov'],
        reportsDirectory: 'coverage',
      },
    },
  };
});
