import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  base: '/',
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
  plugins: [
    {
      name: 'inline-css',
      enforce: 'post',
      apply: 'build',
      closeBundle() {
        const dist = path.resolve(__dirname, 'dist');
        const htmlPath = path.join(dist, 'index.html');
        if (!fs.existsSync(htmlPath)) return;
        let html = fs.readFileSync(htmlPath, 'utf-8');
        html = html.replace(
          /<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g,
          (match, href) => {
            const cssPath = path.resolve(dist, href.replace(/^\//, ''));
            if (!fs.existsSync(cssPath)) return match;
            const css = fs.readFileSync(cssPath, 'utf-8');
            fs.unlinkSync(cssPath);
            return `<style>${css}</style>`;
          },
        );
        fs.writeFileSync(htmlPath, html);
      },
    },
  ],
});
