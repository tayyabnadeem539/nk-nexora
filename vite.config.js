import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Root base: React Router uses real paths (/anime, /article/:id), so assets
  // must resolve from the site root. The dev/preview servers fall back to
  // index.html for unknown paths (SPA mode).
  base: '/',
  server: { port: 5200 },
  preview: { port: 5200 },
  build: {
    rollupOptions: {
      output: {
        // Keep React + React Router in their own long-cached chunk
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
});
