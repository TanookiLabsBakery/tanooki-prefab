import * as React from "react"
import { RouterProvider } from "react-router-dom"
import { router } from "./router"

import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  Operation,
} from "@apollo/client"
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev"
import { createConsumer } from "@rails/actioncable"
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink"
import { getMetaContent } from "../common/get-meta-content"

// @ts-expect-error this is a vite-only feature
if (import.meta.env.DEV) {
  // Adds messages only in a dev environment
  loadDevMessages()
  loadErrorMessages()
}

const cable = createConsumer()

// https://graphql-ruby.org/javascript_client/apollo_subscriptions#apollo-link--actioncable
const hasSubscriptionOperation = ({ query: { definitions } }: Operation) => {
  return definitions.some(
    // @ts-expect-error TODO see if this needs to be fixed
    ({ kind, operation }) =>
      kind === "OperationDefinition" && operation === "subscription",
  )
}

const csrfToken = getMetaContent("csrf-token")

if (csrfToken == null) {
  console.warn("missing csrf token")
}

const httpLink = new HttpLink({
  credentials: "same-origin",
  headers: {
    "X-CSRF-Token": csrfToken,
  },
})

const link = ApolloLink.split(
  hasSubscriptionOperation,
  new ActionCableLink({ cable }),
  httpLink,
)

// const excludePaginationArgs: KeyArgsFunction = (args) => {
//   if (!args) return false
//   return Object.keys(args).filter((k) => !["first", "after"].includes(k))
// }

const apolloClient = new ApolloClient({
  uri: "/graphql",
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // users: relayStylePagination(excludePaginationArgs),
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

// const metaTag = document.querySelector("meta[name=viewer-cache]")
// invariant(metaTag, "missing viewer-cache meta tag")
// const viewerDataContent = metaTag.getAttribute("content")
// invariant(viewerDataContent)
// const userData = JSON.parse(viewerDataContent)
// if (!userData.data) {
//   // eslint-disable-next-line no-console
//   console.warn("Error preloading viewer")
// } else {
//   apolloClient.writeQuery({
//     query: viewerQuery,
//     data: userData.data,
//     variables: {},
//   })
// }

export default function App() {
  return (
    <React.StrictMode>
      <ApolloProvider client={apolloClient}>
        {/* <ViewerProvider> */}
        <RouterProvider router={router} />
        {/* </ViewerProvider> */}
      </ApolloProvider>
    </React.StrictMode>
  )
}
