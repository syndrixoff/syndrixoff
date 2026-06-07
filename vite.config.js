export default {
  root: ".",
  base: "/syndrixoff/",
  publicDir: "public",
  server: { host: true, port: 3000, allowedHosts: true },
  build: {
    cssMinify: "lightningcss",
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/gsap")) return "gsap";
        },
      },
    },
  },
};
