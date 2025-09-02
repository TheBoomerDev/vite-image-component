import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteImagePlugin } from './src/lib/vite-image-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteImagePlugin({
      quality: 75,
      formats: ['webp', 'avif', 'jpeg'],
      sizes: [640, 750, 828, 1080, 1200, 1920],
      placeholder: true,
    }),
  ],
  ssr: {
    external: ['sharp'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
});