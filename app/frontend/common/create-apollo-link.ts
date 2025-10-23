import { from, Operation, ApolloLink, HttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { createConsumer } from "@rails/actioncable"
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink"
import { getMetaContentMaybe } from "./get-meta-content"

const cable = createConsumer()

const hasSubscriptionOperation = ({ query: { definitions } }: Operation) => {
  return definitions.some(
    // @ts-expect-error see if this needs to be updated
    ({ kind, operation }) => kind === "OperationDefinition" && operation === "subscription"
  )
}

export function createApolloLink(): ApolloLink {
  const csrfLink = setContext((_, { headers }) => {
    const csrfToken = getMetaContentMaybe("csrf-token")
    return {
      headers: {
        ...headers,
        "X-CSRF-Token": csrfToken,
      },
    }
  })

  const httpLink = from([
    // @ts-ignore
    csrfLink,
    new HttpLink({
      credentials: "same-origin",
    }),
  ])

  return ApolloLink.split(hasSubscriptionOperation, new ActionCableLink({ cable }), httpLink)
}
