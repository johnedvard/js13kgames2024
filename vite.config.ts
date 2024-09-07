// vite.config.js
import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  build: {
    minify: "terser",
    cssMinify: true,
    assetsDir: "",
    terserOptions: {
      toplevel: true,
      keep_classnames: false,
      compress: {
        drop_console: true,
      },
    },
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        // Define output pattern for entry files (main JavaScript files)
        entryFileNames: "[name].js", // No hash in the filename
        chunkFileNames: "[name].js", // No hash in the filename
      },
    },
  },
  plugins: [
    ViteMinifyPlugin({
      removeAttributeQuotes: true,
      minifyJS: true,
      minifyCSS: true,
      removeComments: true,
      sortAttributes: true,
      useShortDoctype: true,
      sortClassName: true,
      removeScriptTypeAttributes: true,
      removeRedundantAttributes: true,
    }),
  ],
});
