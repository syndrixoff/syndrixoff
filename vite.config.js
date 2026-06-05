export default {
  root: ".",
  publicDir: "public",
  server: { host: true, port: 3000, allowedHosts: true },
  build: {
    chunkSizeWarningLimit: 5000,
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@splinetool/runtime")) return "spline";
          if (id.includes("node_modules/three")) return "three";
          if (id.includes("node_modules/gsap")) return "gsap";
        },
      },
    },
  },
};
