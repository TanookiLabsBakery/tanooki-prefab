import { ApolloLink, HttpLink } from "@apollo/client"
import { Operation } from "@apollo/client/core"
import { createConsumer } from "@rails/actioncable"
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink"

const cable = createConsumer()

const hasSubscriptionOperation = ({ query: { definitions } }: Operation) => {
  return definitions.some(
    // @ts-expect-error see if this needs to be updated
    ({ kind, operation }) => kind === "OperationDefinition" && operation === "subscription"
  )
}

export function createApolloLink(csrfToken: string | null): ApolloLink {
  const headers: Record<string, string> = {}

  if (csrfToken == null) {
    console.warn("missing csrf token")
  } else {
    headers["X-CSRF-Token"] = csrfToken
  }

  const httpLink = new HttpLink({
    credentials: "same-origin",
    headers,
  })

  return ApolloLink.split(hasSubscriptionOperation, new ActionCableLink({ cable }), httpLink)
}
