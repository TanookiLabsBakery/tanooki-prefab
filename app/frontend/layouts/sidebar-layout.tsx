import { Link, Outlet, ScrollRestoration } from "react-router-dom"
import { useViewer, useViewerMaybe } from "~/auth/use-viewer"
import * as paths from "~/common/paths"

export const SidebarLinks = () => {
  const { viewer } = useViewer()

  if (!viewer) return null

  return (
    <nav className="mt-5 space-y-1">
      <div className="px-5 text-xs font-bold uppercase tracking-wide">Navigation</div>

      <ul className="list-none flex-col space-y-1"></ul>
    </nav>
  )
}

export const SidebarLayout = () => {
  const { viewer } = useViewerMaybe()

  if (!viewer) {
    return null
  }

  return (
    <div className="flex flex-1 grow">
      <div className="sidebar flex w-[235px] flex-col justify-between gap-2 bg-[#FCC503] px-2 pb-6">
        <div>
          <Link to={paths.rootPath({})} className="flex pt-6">
            Home (Logo Image)
          </Link>

          <SidebarLinks />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center text-xs">
            <div>
              Copyright © {new Date().getFullYear()} All Rights Reserved.
              <br />
              Prefab
            </div>

            <div>Version 0.0.0 (0.0.0)</div>
          </div>
        </div>
      </div>

      <div className="flex max-w-full flex-1 flex-col overflow-hidden">
        <Outlet />
        <ScrollRestoration />
      </div>
    </div>
  )
}
