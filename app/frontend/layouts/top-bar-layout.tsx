import { Outlet, useMatches } from "react-router-dom"
import { useViewerMaybe } from "~/auth/use-viewer"
import { useLogout } from "~/auth/use-logout"
import { Button } from "~/ui/button"

const PageTitle = () => {
  const matches = useMatches()
  const handle = matches[matches.length - 1].handle as
    | {
        title: string
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
      }
    | undefined

  const title = handle?.title
  const Icon = handle?.icon

  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon className="h-6 w-6" />}
      <h1 className="text-2xl">{title}</h1>
    </div>
  )
}

export const TopBarLayout = () => {
  const { viewer } = useViewerMaybe()
  const logout = useLogout()

  return (
    <>
      <div className="flex h-[77px] items-center justify-between border-b px-10">
        <PageTitle />

        {viewer && (
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <div className="text-xs-plus font-medium leading-snug">
                  {viewer.firstName} {viewer.lastName}
                  <Button onClick={logout}>Logout</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Outlet />
    </>
  )
}
