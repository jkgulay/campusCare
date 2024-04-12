import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "./src",
  build: {
    outDir: "../dist",
    minify: false,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        login: resolve(__dirname, "src/login.html"),
        home: resolve(__dirname, "src/home.html"),
        menu: resolve(__dirname, "src/menu.html"),
        profile: resolve(__dirname, "src/profile.html"),
      },
    },
  },
});
