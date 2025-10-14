import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import { KeyArgsFunction } from "@apollo/client/cache/inmemory/policies"
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev"
import { relayStylePagination } from "@apollo/client/utilities"
import * as React from "react"
import { RouterProvider } from "react-router-dom"
import invariant from "tiny-invariant"
import { ViewerProvider, viewerQuery } from "~/auth/use-viewer"
import { Toaster } from "~/ui/toaster"
import { createApolloLink } from "../common/create-apollo-link"
import { getMetaContentMaybe } from "../common/get-meta-content"
import { router } from "./router"

// @ts-expect-error this is a vite-only feature
if (import.meta.env.DEV) {
  // Adds messages only in a dev environment
  loadDevMessages()
  loadErrorMessages()
}

const csrfToken = getMetaContentMaybe("csrf-token")

const excludePaginationArgs: KeyArgsFunction = (args) => {
  if (!args) return false
  return Object.keys(args).filter((k) => !["first", "after"].includes(k))
}

const apolloClient = new ApolloClient({
  uri: "/graphql",
  link: createApolloLink(csrfToken),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          users: relayStylePagination(excludePaginationArgs),
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
})

const metaTag = document.querySelector("meta[name=viewer-cache]")
invariant(metaTag, "missing viewer-cache meta tag")

const viewerDataContent = metaTag.getAttribute("content")
invariant(viewerDataContent, "missing viewer-cache meta tag content")

const userData = JSON.parse(viewerDataContent)

if (!userData.data) {
  throw new Error("Error preloading viewer")
} else {
  apolloClient.writeQuery({
    query: viewerQuery,
    data: userData.data,
    variables: {},
  })
}

export default function App() {
  return (
    <React.StrictMode>
      <ApolloProvider client={apolloClient}>
        <ViewerProvider>
          <RouterProvider router={router} />
        </ViewerProvider>
      </ApolloProvider>
      <Toaster />
    </React.StrictMode>
  )
}
