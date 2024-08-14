import { defineConfig } from "vite";

import ReactPlugin from "@vitejs/plugin-react";
import CodegenPlugin from "vite-plugin-graphql-codegen";
import RubyPlugin from "vite-plugin-ruby";

export default defineConfig({
  plugins: [RubyPlugin(), ReactPlugin(), CodegenPlugin()],
});
