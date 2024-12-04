// electron.vite.config.mjs
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src")
      }
    },
    plugins: [vue(), VueJsx()],
    build: {
      rollupOptions: {
        input: {
          index: resolve("src/renderer/index.html"),
          about: resolve("src/renderer/login/index.html")
        }
      }
    }
  }
});
export {
  electron_vite_config_default as default
};
