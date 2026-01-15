import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      strategies: "injectManifest",
      srcDir: "public",
      filename: "sw.js",
      registerType: "autoUpdate",
      devOptions: { enabled: true },

      manifest: {
        name: "Task Tracker",
        short_name: "Tasks",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",

        // REQUIRED for Chrome Push Notifications
        gcm_sender_id: "103953800507",

        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      } as any,
    }),
  ],

  /* 🔴 REQUIRED FOR SHADCN */
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
