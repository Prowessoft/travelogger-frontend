import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    // Replace environment variables in index.html
    '%VITE_GOOGLE_MAPS_API_KEY%': JSON.stringify(process.env.VITE_GOOGLE_MAPS_API_KEY),
  },
  server: {
    hmr: {
      overlay: true
    }
  }
});