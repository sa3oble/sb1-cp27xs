import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/sb1-cp27xs/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/.netlify/functions/': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react'],
        },
      },
    },
  },
});
