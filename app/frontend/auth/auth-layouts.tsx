import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { loginPath, rootPath } from "~/common/paths"
import { useViewerMaybe } from "./use-viewer"

export const RequireUserSignedOut = () => {
  const navigate = useNavigate()
  const { viewer, result } = useViewerMaybe()

  useEffect(() => {
    if (viewer) {
      navigate(rootPath.pattern)
    }
  }, [viewer, navigate])

  if (result.loading) return null

  return <Outlet />
}

export const RequireUserSignedIn = () => {
  const navigate = useNavigate()
  const { viewer, result } = useViewerMaybe()

  useEffect(() => {
    if (!result.loading && !viewer) {
      navigate(loginPath({}) + "?" + new URLSearchParams({ returnTo: window.location.pathname }))
    }
  }, [navigate, result.loading, viewer])

  if (result.loading) return null

  return <Outlet />
}

export const RequireSystemAdminSignedIn = () => {
  const navigate = useNavigate()
  const { viewer, result } = useViewerMaybe()

  useEffect(() => {
    if (viewer?.userRole !== "SYSTEM_ADMIN") {
      navigate(rootPath({}))
    }
  }, [navigate, result.loading, viewer])

  if (result.loading) return null

  return <Outlet />
}
