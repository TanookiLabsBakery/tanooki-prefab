import ReactPlugin from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"
import RubyPlugin from "vite-plugin-ruby"
import svgr from "vite-plugin-svgr"

export default defineConfig({
  plugins: [
    RubyPlugin(),
    ReactPlugin({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    svgr(),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, path.join("app", "frontend")),
    },
  },
  server: {
    hmr: {
      host: "localhost",
    },
  },
})
