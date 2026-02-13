// @ts-check
import eslint from "@eslint/js"
import reactPlugin from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  {
    ignores: ["app/frontend/__generated__/*", "public/*"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "off",
      "react/prop-types": "off",
      "react-hooks/incompatible-library": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@apollo/client",
              importNames: ["gql"],
              message: "Please use gql from ~/__generated",
            },
            {
              name: "@apollo/client",
              importNames: ["useMutation"],
              message: "Please use useSafeMutation from ~/common/use-safe-mutation",
            },
          ],
        },
      ],
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
])
