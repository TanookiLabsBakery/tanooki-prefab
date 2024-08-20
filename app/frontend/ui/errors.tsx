import { ApolloError } from "@apollo/client"

export const GraphqlError = ({ error }: { error: ApolloError }) => (
  <ErrorBox>
    <div>GraphQL Error</div>
    {error.graphQLErrors.map((e, i) => (
      <pre key={i}>{JSON.stringify(e, null, 2)}</pre>
    ))}
    {error.graphQLErrors.length === 0 ? <pre>{JSON.stringify(error, null, 2)}</pre> : null}
  </ErrorBox>
)

export const ErrorBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-shrink-0 overflow-auto">
    <div className="flex-shrink-0 overflow-auto rounded border border-red-500 p-3 text-red-600">
      {children}
    </div>
  </div>
)
