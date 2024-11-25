import { gql } from "~/__generated__"
import { UserAvatarFragment } from "~/__generated__/graphql"
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/avatar"

gql(`
  fragment UserAvatar on User {
    id
    firstName
    lastName
    avatarThumbUrl
  }
`)

export const UserAvatar = ({
  user,
  alt,
  className,
}: {
  user: UserAvatarFragment
  alt?: string
  className?: string
}) => {
  return (
    <Avatar className={className}>
      {user.avatarThumbUrl && <AvatarImage src={user.avatarThumbUrl} alt={alt} />}
      <AvatarFallback>
        {user.firstName[0]}
        {user.lastName[0]}
      </AvatarFallback>
    </Avatar>
  )
}
