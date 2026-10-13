import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

import { qrcode } from "vite-plugin-qrcode";

// Default values for local development
const port = Number(process.env.PORT) || 5173;

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    qrcode(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
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
          'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage', 'firebase/analytics'],
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
    proxy: {
      '/api/contact': {
        target: 'https://shrawankarki.com.np',
        changeOrigin: true,
      },
      '/.netlify/functions': {
        target: 'https://shrawankarki.com.np',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port,
    host: true,
  },
});
