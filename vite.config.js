import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Semanal",
        icons: [
          {
            src: "/icons/lessIcon.png",
            sizes: "200x200",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        theme_color: "#FFF",
        display: "standalone",
        start_url: "/",
      },
      // devOptions: {
      //   enabled: true,
      // },
    }),
  ],
  build: {
    outDir: "build",
  },
});