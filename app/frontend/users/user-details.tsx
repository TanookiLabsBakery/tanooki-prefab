import { useQuery } from "@apollo/client/react"
import { useNavigate } from "react-router-dom"
import invariant from "tiny-invariant"
import { gql } from "~/__generated__"
import { profilePath } from "~/common/paths"
import { TablePageLayout } from "~/layouts/table-page-layout"
import { Button } from "~/ui/button"
import { GraphqlError } from "~/ui/graphql-error"
import Text from "~/ui/typography"

const userDetailsQuery = gql(/* GraphQL */ `
  query userDetails($userId: ID!) {
    node(id: $userId) {
      ... on User {
        firstName
        lastName
        userRole
        fullName
        email
      }
    }
  }
`)

export const UserDetails: React.FC<{ userId: string }> = ({ userId }) => {
  const navigate = useNavigate()
  const { data, error, loading } = useQuery(userDetailsQuery, {
    variables: {
      userId,
    },
  })

  const handleEdit = () => {
    navigate(profilePath({}))
  }

  if (error) {
    return <GraphqlError error={error} />
  }

  if (loading) {
    return <div>Loading...</div>
  }

  invariant(data)
  invariant(data.node)
  invariant(data.node.__typename === "User")

  const user = data.node

  return (
    <TablePageLayout>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <Text as="h1">{user.fullName}</Text>
          <Button onClick={handleEdit}>Edit Details</Button>
        </div>
        <hr className="my-4 border-border" />
        <div className="space-y-4">
          <div className="flex">
            <Text variant="default" className="w-24 text-muted-foreground">
              First Name
            </Text>
            <Text variant="default">{user.firstName}</Text>
          </div>
          <div className="flex">
            <Text variant="default" className="w-24 text-muted-foreground">
              Last Name
            </Text>
            <Text variant="default">{user.lastName}</Text>
          </div>
          <div className="flex">
            <Text variant="default" className="w-24 text-muted-foreground">
              Role
            </Text>
            <Text variant="default">{user.userRole}</Text>
          </div>
        </div>
      </div>
    </TablePageLayout>
  )
}
