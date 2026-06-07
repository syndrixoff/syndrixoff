export default {
  root: ".",
  base: "/syndrixoff/",
  publicDir: "public",
  server: { host: true, port: 3000, allowedHosts: true },
  build: {
    cssMinify: "lightningcss",
    outDir: "dist",
  },
};
