import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: backendUrl,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
