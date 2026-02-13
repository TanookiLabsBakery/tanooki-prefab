import { ApolloLink, HttpLink } from "@apollo/client"
import { SetContextLink } from "@apollo/client/link/context"
import { createConsumer } from "@rails/actioncable"
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink"
import { getMetaContentMaybe } from "./get-meta-content"

const cable = createConsumer()

const hasSubscriptionOperation = ({ query: { definitions } }: ApolloLink.Operation) => {
  return definitions.some(
    // @ts-expect-error see if this needs to be updated
    ({ kind, operation }) => kind === "OperationDefinition" && operation === "subscription"
  )
}

export function createApolloLink(): ApolloLink {
  const csrfLink = new SetContextLink(({ headers }) => {
    const csrfToken = getMetaContentMaybe("csrf-token")
    return {
      headers: {
        ...headers,
        "X-CSRF-Token": csrfToken,
      },
    }
  })

  const httpLink = ApolloLink.from([
    csrfLink,
    new HttpLink({
      uri: "/graphql",
      credentials: "same-origin",
    }),
  ])

  return ApolloLink.split(hasSubscriptionOperation, new ActionCableLink({ cable }), httpLink)
}
