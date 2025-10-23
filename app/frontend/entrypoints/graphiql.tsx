import type { Fetcher } from "@graphiql/toolkit"
import { GraphiQL } from "graphiql"
import { createRoot } from "react-dom/client"
//@ts-expect-error no types
import "graphiql/style.css"
import { getMetaContent } from "~/common/get-meta-content"

console.log("Vite ⚡️ Rails")

const rootElement = document.getElementById("root")!
const csrfToken = getMetaContent("csrf-token")

const fetcher: Fetcher = async (graphQLParams: any) => {
  const data = await fetch("graphql", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify(graphQLParams),
    credentials: "same-origin",
  })
  return data.json().catch(() => data.text())
}

const root = createRoot(rootElement)
root.render(<GraphiQL fetcher={fetcher} />)
