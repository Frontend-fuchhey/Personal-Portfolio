import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

import { qrcode } from "vite-plugin-qrcode";

// Default values for local development
const port = Number(process.env.PORT) || 5173;

export default defineConfig({
  base: "/",
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  plugins: [
    react(),
    tailwindcss(),
    qrcode(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
          'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
        }
      }
    }
  },
  server: {
    port,
    host: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: true,
  },
});
