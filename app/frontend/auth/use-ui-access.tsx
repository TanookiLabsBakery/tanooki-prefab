import { useQuery } from "@apollo/client"
import { gql } from "~/__generated__"

export const uiAccessQuery = gql(/* GraphQL */ `
  query UiAccess {
    uiAccess {
      canInternalAdmin {
        value
      }
    }
  }
`)

export const useUiAccess = () => {
  const result = useQuery(uiAccessQuery, { fetchPolicy: "cache-first" })

  return {
    uiAccess: result.data?.uiAccess,
    loading: result.loading,
    error: result.error,
  }
}
