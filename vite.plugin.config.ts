import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/vite-plugin.ts'),
      name: 'ViteImagePlugin',
      fileName: (format) => `vite-plugin.${format}.js`,
    },
    rollupOptions: {
      external: ['vite', 'sharp', 'fs', 'path', 'crypto'],
      output: {
        globals: {
          vite: 'vite',
          sharp: 'sharp',
          fs: 'fs',
          path: 'path',
          crypto: 'crypto',
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: false, // Don't empty dist folder to allow multiple builds
  },
  ssr: {
    external: ['sharp'],
  },
});