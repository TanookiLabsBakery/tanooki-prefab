// @ts-check
import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
  ignores: ["app/frontend/__generated__"],
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
  },
})
