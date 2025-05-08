import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:7224",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            // Forward cookies
            proxyReq.setHeader("Origin", "http://localhost:5173");
          });
        },
      },
      "/uploads": {
        target: "https://localhost:7224",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
