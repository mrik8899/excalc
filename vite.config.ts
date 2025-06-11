import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js', // <-- Explicitly tell Vite where your PostCSS config is
  },
  // You can also add other Vite options here if needed, like server.host, etc.
});
