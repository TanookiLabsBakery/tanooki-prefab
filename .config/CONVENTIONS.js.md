- use this gql function instead of apollo's, it takes one argument:
  ```tsx
  import { gql } from "~/__generated__"
  gql(/* GraphQL */ ` <query or mutation> `)
  ```
- use shadcn ui components
- if a new component is needed suggest installing it with `pnpx shadcn-ui add <component>`
- filenames should be written in kebab case
- new url paths should be defined in app/frontend/common/paths.ts using static-path for type safety
- forms should use zod schema
- form schemas only used by one form should be in the same file as the form
- react-router is used for links and navigation
