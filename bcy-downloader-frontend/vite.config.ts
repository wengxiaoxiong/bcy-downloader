import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const ip = "http://localhost:3001/";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      "/banciyuan": {
        changeOrigin: true, // 开启跨域
        target: ip, // server host
      },
    },
  },
});
