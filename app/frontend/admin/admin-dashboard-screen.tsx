import { useQuery } from "@apollo/client"
import { gql } from "~/__generated__"
import { TablePageLayout } from "~/layouts/table-page-layout"
import { Button } from "~/ui/button"
import { GraphqlError } from "~/ui/errors"
import { columns } from "./columns"
import { DataTable } from "./data-table"

export const usersQuery = gql(/* GraphQL */ `
  query Users($first: Int = 20, $after: String) {
    users(first: $first, after: $after) {
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

export const AdminDashboardScreen = () => {
  const { data, fetchMore, error } = useQuery(usersQuery)

  if (error) {
    return <GraphqlError error={error} />
  }

  const users = data?.users.edges.map((edge) => edge.node) ?? []
  const pageInfo = data?.users.pageInfo

  return (
    <TablePageLayout>
      <h1 className="text-2xl">Users</h1>
      <hr className="my-4 border-0 border-b" />
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
    </TablePageLayout>
  )
}
