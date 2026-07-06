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
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ["maplibre-gl"],
    esbuildOptions: {
      target: "es2017",
    },
  },
  build: {
    target: ["es2017", "safari13"],
    chunkSizeWarningLimit: 10000,
    commonjsOptions: {
      include: [/maplibre-gl/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'map-vendor': ['maplibre-gl'],
          'pdf-vendor': ['jspdf', 'jspdf-autotable'],
          'chart-vendor': ['recharts'],
          'three-vendor': ['three'],
          'editor-vendor': ['@blocknote/core', '@blocknote/mantine', '@blocknote/react', '@mantine/core', '@mantine/hooks'],
          'animation-vendor': ['framer-motion', 'motion']
        }
      },
    },
  },
});
