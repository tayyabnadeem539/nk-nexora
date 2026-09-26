import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base so the built dist/ also works when opened from any sub-folder
  base: './',
  server: { port: 5200 }
});
