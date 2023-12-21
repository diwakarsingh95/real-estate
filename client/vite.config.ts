import { defineConfig, loadEnv, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE");
  const backendUrl = env.VITE_BACKEND_URL || "http://localhost:3000";
  return {
    server: {
      proxy: {
        "/api": {
          target: backendUrl,
          secure: false
        }
      }
    },
    plugins: [react(), splitVendorChunkPlugin()]
  };
});
