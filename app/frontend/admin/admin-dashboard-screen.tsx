import { useQuery } from "@apollo/client/react"
import { gql } from "~/__generated__"
import { TablePageLayout } from "~/layouts/table-page-layout"
import { Button } from "~/ui/button"
import { GraphqlError } from "~/ui/graphql-error"
import { ScreenLoading } from "~/ui/screen-loading"
import { columns } from "./columns"
import { DataTable } from "./data-table"

export const usersQuery = gql(/* GraphQL */ `
  query Users($first: Int = 20, $after: String) {
    internalAdminUsers(first: $first, after: $after) {
      edges {
        node {
          id
          fullName
          email
          createdAt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`)

export const InternalAdminDashboardScreen = () => {
  const { data, fetchMore, error, loading } = useQuery(usersQuery)

  const users = data?.internalAdminUsers.edges.map((edge) => edge.node) ?? []
  const pageInfo = data?.internalAdminUsers.pageInfo

  return (
    <TablePageLayout>
      <h1 className="text-2xl">Users</h1>
      <hr className="my-4 border-0 border-b" />

      {!data && loading ? (
        <ScreenLoading />
      ) : error ? (
        <GraphqlError error={error} />
      ) : (
        <>
          <DataTable columns={columns} data={users} />
          {pageInfo && pageInfo.hasNextPage && (
            <>
              <hr className="my-4 border-0 border-b" />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="disabled:bg-gray-100"
                  onClick={() => {
                    fetchMore({
                      variables: {
                        after: pageInfo.endCursor,
                      },
                    })
                  }}
                  disabled={!pageInfo.hasNextPage}
                >
                  Load more
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </TablePageLayout>
  )
}
