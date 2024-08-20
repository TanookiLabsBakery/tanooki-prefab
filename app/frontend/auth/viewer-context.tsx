import { QueryResult, useQuery } from "@apollo/client"
import React, { createContext, useContext, useMemo } from "react"
import invariant from "tiny-invariant"
import { gql } from "~/__generated__"
import { Exact, ViewerQuery } from "~/__generated__/graphql"
import { GraphqlError } from "~/ui/errors"

interface ViewerContextType {
  result: QueryResult<
    ViewerQuery,
    Exact<{
      [key: string]: never
    }>
  >
  viewer: ViewerQuery["viewer"]
}

const ViewerContext = createContext<ViewerContextType | null>(null)

export const viewerQuery = gql(/* GraphQL */ `
  query Viewer {
    viewer {
      id
      ...CachedViewerContext
    }
  }
`)

export const ViewerProvider = ({ children }: { children: React.ReactNode }) => {
  const result = useQuery(viewerQuery, { fetchPolicy: "cache-first" })
  const viewer = result.data?.viewer

  const value = useMemo(() => ({ result, viewer }), [result, viewer])

  if (result.error) {
    return <GraphqlError error={result.error} />
  }

  return <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>
}

export const useViewerMaybe = () => {
  const contextValue = useContext(ViewerContext)
  if (contextValue === null) {
    throw Error("Context has not been Provided!")
  }
  return contextValue
}

export const useViewer = () => {
  const contextValue = useContext(ViewerContext)
  invariant(contextValue, "Context has not been Provided!")
  invariant(contextValue.viewer, "User must be logged in")

  return {
    viewer: contextValue.viewer,
    refetch: contextValue.result.refetch,
    startPolling: contextValue.result.startPolling,
    stopPolling: contextValue.result.stopPolling,
  }
}
