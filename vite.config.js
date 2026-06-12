import { defineConfig } from 'vite';

export default defineConfig({
  base: '/syndrixoff/',
  server: {
    open: true,
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'index.[hash].js',
      },
    },
  },
});
