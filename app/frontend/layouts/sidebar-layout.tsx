import { Link, Outlet, ScrollRestoration } from "react-router-dom"
import { useLogout } from "~/auth/use-logout"
import { useViewer } from "~/auth/use-viewer"
import { cn } from "~/common/cn"
import { rootPath } from "~/common/paths"
import gridIcon from "~/images/grid-icon"
import logoutIcon from "~/images/logout-icon"

const sidebarItemStyles =
  "flex px-5 py-3 border-b border-gray-300 hover:bg-gray-100 text-sm font-medium text-gray-400 hover:text-gray-900 cursor-pointer"

const SidebarLink = ({ text, to }: { text: string; to: string }) => (
  <li className={sidebarItemStyles}>
    <Link to={to} className="flex">
      <img {...gridIcon} alt="" />
      <div className="pl-4">{text}</div>
    </Link>
  </li>
)

export const SidebarLinks = () => {
  const { viewer } = useViewer()

  return (
    <nav className="mt-5 border-t border-gray-300">
      <ul className="list-none flex-col">
        {viewer.userRole === "SYSTEM_ADMIN" && (
          <>
            <SidebarLink text={"Link 1"} to={rootPath({})} />
            <SidebarLink text={"Link 2"} to={rootPath({})} />
          </>
        )}
      </ul>
    </nav>
  )
}

export const SidebarLayout = () => {
  const logout = useLogout()

  return (
    <div className="flex min-h-screen flex-1 grow">
      <div className="sidebar flex w-[200px] flex-col justify-between gap-2 bg-white shadow-md">
        <div>
          <Link to={rootPath({})} className="flex pt-6">
            Home (Logo Image)
          </Link>

          <SidebarLinks />
        </div>
        <div className={cn("border-t border-gray-300", sidebarItemStyles)}>
          <button onClick={logout} className="flex w-full">
            <img {...logoutIcon} alt="" />
            <div className="pl-4">Sign Out</div>
          </button>
        </div>
      </div>

      <div className="flex max-w-full flex-1 flex-col overflow-hidden">
        <Outlet />
        <ScrollRestoration />
      </div>
    </div>
  )
}
