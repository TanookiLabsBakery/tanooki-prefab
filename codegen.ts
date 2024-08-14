import { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  schema: "schema.graphql",
  documents: ["app/frontend/**/*.{ts,tsx,graphql}"],
  ignoreNoDocuments: true,
  generates: {
    "./app/frontend/__generated__/": {
      config: {
        scalars: {
          ISO8601Date: "string",
          ISO8601DateTime: "string",
          BigInt: "string",
        },
      },
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
      },
    },
  },
}

export default config
