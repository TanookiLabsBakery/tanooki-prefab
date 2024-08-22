import { ApolloError } from "@apollo/client"
import { GraphQLError, GraphQLFormattedError } from "graphql"

/** based on app/graphql/validation_error.rb */
type ValidationError = {
  field: string
  resource: string
  fullMessage: string
  message: string
  type: string
}

type ValidationErrorPayload = {
  extensions: {
    code: "VALIDATION_ERROR"
    validationErrors: Array<ValidationError>
  }
  message: string
}

const isApolloError = (t: readonly GraphQLError[] | ApolloError): t is ApolloError => {
  return (t as ApolloError).graphQLErrors !== undefined
}

const getGraphqlErrors = (_errors?: readonly GraphQLError[] | ApolloError) => {
  if (!_errors) return
  let errors: Array<GraphQLError | GraphQLFormattedError> = []

  if (isApolloError(_errors)) {
    errors = [..._errors.graphQLErrors]
  } else {
    errors = [..._errors]
  }

  return errors
}

export { getGraphqlErrors, type ValidationErrorPayload }
