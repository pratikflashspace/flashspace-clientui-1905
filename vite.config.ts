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
    chunkSizeWarningLimit: 10000,
    commonjsOptions: {
      include: [/maplibre-gl/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 1. Heavy Data/3D
            if (id.includes("country-state-city")) return "vendor-geo-data";
            if (id.includes("three")) return "vendor-3d";
            
            // 2. Heavy UI Components
            if (id.includes("maplibre-gl") || id.includes("recharts") || id.includes("gsap") || id.includes("sheryjs")) {
              return "vendor-heavy-ui";
            }
            
            // 3. Icons (Keep separate as they are numerous)
            if (id.includes("lucide-react") || id.includes("react-icons") || id.includes("@tabler/icons-react")) {
              return "vendor-icons";
            }

            // 4. Everything else (Core & Libs combined to prevent circular deps)
            return "vendor-core";
          }
        },
      },
    },
  },
});
