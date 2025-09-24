import path from "path"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

import ReactPlugin from "@vitejs/plugin-react"
import CodegenPlugin from "vite-plugin-graphql-codegen"
import RubyPlugin from "vite-plugin-ruby"

export default defineConfig({
  plugins: [RubyPlugin(), ReactPlugin(), CodegenPlugin(), svgr()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, path.join("app", "frontend")),
    },
  },
})
