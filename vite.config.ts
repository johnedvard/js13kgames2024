// vite.config.js
import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    assetsDir: "",
    rollupOptions: {
      output: {
        // Define output pattern for entry files (main JavaScript files)
        entryFileNames: "[name].js", // No hash in the filename
        chunkFileNames: "[name].js", // No hash in the filename
      },
    },
  },
  plugins: [ViteMinifyPlugin({})],
});
