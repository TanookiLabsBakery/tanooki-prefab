import { ApolloClient, InMemoryCache } from "@apollo/client"
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev"
import { ApolloProvider } from "@apollo/client/react"
import { relayStylePagination } from "@apollo/client/utilities"
import { KeyArgsFunction } from "node_modules/@apollo/client/cache/inmemory/policies"
import { RouterProvider } from "react-router-dom"
import invariant from "tiny-invariant"
import { uiAccessQuery } from "~/auth/use-ui-access"
import { ViewerProvider, viewerQuery } from "~/auth/use-viewer"
import { PwaPullToRefresh } from "~/common/pwa-pull-to-refresh"
import { Toaster } from "~/ui/sonner"
import { createApolloLink } from "../common/create-apollo-link"
import { router } from "./router"

// @ts-expect-error this is a vite-only feature
if (import.meta.env.DEV) {
  // Adds messages only in a dev environment
  loadDevMessages()
  loadErrorMessages()
}

const excludePaginationArgs: KeyArgsFunction = (args) => {
  if (!args) return false
  return Object.keys(args).filter((k) => !["first", "after"].includes(k))
}

const apolloClient = new ApolloClient({
  link: createApolloLink(),
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
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
})

const metaTag = document.querySelector("meta[name=preloaded-data]")
invariant(metaTag, "missing preloaded-data meta tag")

const preloadedDataContent = metaTag.getAttribute("content")
invariant(preloadedDataContent, "missing preloaded-data meta tag content")

const preloadedData = JSON.parse(preloadedDataContent)

if (!preloadedData.data) {
  throw new Error("Error preloading data")
}

apolloClient.writeQuery({
  query: viewerQuery,
  data: { viewer: preloadedData.data.viewer },
  variables: {},
})

apolloClient.writeQuery({
  query: uiAccessQuery,
  data: { uiAccess: preloadedData.data.uiAccess },
  variables: {},
})

export default function App() {
  return (
    <PwaPullToRefresh>
      <ApolloProvider client={apolloClient}>
        <ViewerProvider>
          <RouterProvider router={router} />
        </ViewerProvider>
      </ApolloProvider>
      <Toaster />
    </PwaPullToRefresh>
  )
}
