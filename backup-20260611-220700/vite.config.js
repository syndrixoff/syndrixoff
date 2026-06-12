export default {
  root: ".",
  base: "/syndrixoff/",
  publicDir: "public",
  server: { host: true, port: 3000, allowedHosts: true },
  build: {
    cssMinify: "lightningcss",
    outDir: "dist",
  },
  plugins: [
    {
      name: "non-blocking-css",
      transformIndexHtml(html) {
        return html.replace(
          /<link rel="stylesheet" crossorigin href="([^"]+\.css)">/,
          (_, href) =>
            `<link rel="stylesheet" media="print" onload="this.media='all'" crossorigin href="${href}">` +
            `<noscript><link rel="stylesheet" crossorigin href="${href}"></noscript>`
        );
      },
    },
  ],
};
