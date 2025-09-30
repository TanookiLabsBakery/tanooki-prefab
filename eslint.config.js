// @ts-check
import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import reactHooks from "eslint-plugin-react-hooks"

export default tseslint.config(
  {
    ignores: ["app/frontend/__generated__/*", "public/*"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs["recommended-latest"].rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "off",
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
  }
)
