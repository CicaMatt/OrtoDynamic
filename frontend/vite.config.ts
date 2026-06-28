import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from the domain root in dev and on single-origin hosts; on GitHub Pages
// project sites the app lives under a `/<repo>/` sub-path, supplied at build time
// via VITE_BASE_PATH so asset URLs resolve correctly.
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react()],
});
