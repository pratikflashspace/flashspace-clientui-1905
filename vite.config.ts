import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ["maplibre-gl"],
    esbuildOptions: {
      target: "es2020",
    },
  },
  build: {
    target: "es2020",
    commonjsOptions: {
      include: [/maplibre-gl/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["lucide-react", "gsap"],
          "vendor-heavy": ["maplibre-gl", "jspdf", "recharts"],
        },
      },
    },
  },
});
