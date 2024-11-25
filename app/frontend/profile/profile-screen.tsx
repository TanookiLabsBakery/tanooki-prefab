import { useViewer } from "~/auth/use-viewer"
import { TablePageLayout } from "~/layouts/table-page-layout"
import { LinkButton } from "~/ui/link-button"
import { profileEditPath } from "~/common/paths"
import { UserAvatar } from "~/users/user-avatar"

export const ProfileScreen = () => {
  const { viewer } = useViewer()

  return (
    <TablePageLayout>
      <div className="flex flex-1 flex-col">
        <div className="bottom-1 mb-4 flex items-center justify-between border-b border-gray-300 py-4">
          <h1 className="text-2xl">{viewer.fullName}</h1>
          <LinkButton to={profileEditPath({})}>Edit Details</LinkButton>
        </div>
        <div>
          <UserAvatar
            user={viewer}
            alt="A picture that represents you and your account"
            className="mb-8 mt-4 h-16 w-16"
          />
          <table className="flex flex-wrap">
            <tbody>
              <tr>
                <td className="pr-10 text-gray-500">Date Created</td>
                <td>{viewer.createdAt}</td>
              </tr>
              <tr>
                <td className="pr-10 text-gray-500">Email Address</td>
                <td>{viewer.email}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </TablePageLayout>
  )
}
