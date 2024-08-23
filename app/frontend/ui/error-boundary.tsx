import { isRouteErrorResponse, useRouteError } from "react-router-dom"
import { useDocumentTitle } from "~/common/use-document-title"

export const ErrorBoundary = () => {
  const error = useRouteError()
  useDocumentTitle("Error")
  if (isRouteErrorResponse(error)) {
    return (
      <ErrorContainer>
        <div className="grid gap-1">
          <h1 className="text-red-700">{error.status}</h1>

          {error.statusText ? <p className="text-red-700">{error.statusText}</p> : null}
        </div>
      </ErrorContainer>
    )
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return (
      <ErrorContainer>
        <h1 className="mb-2 text-red-700">An error occured</h1>
        <pre className="whitespace-pre-wrap">{error.message}</pre>
      </ErrorContainer>
    )
  }

  throw error
}

const ErrorContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="m-4 mx-auto max-w-7xl">
    <div className="overflow-auto rounded border border-red-700 p-4 py-2">{children}</div>
  </div>
)
