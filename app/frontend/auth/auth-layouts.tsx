import { useEffect, useRef } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { loginPath, rootPath } from "~/common/paths"
import { useViewerMaybe } from "./use-viewer"
import { RETURN_TO_STORAGE_KEY } from "./utils"

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
  const redirectedRef = useRef(false)
  const { viewer, result } = useViewerMaybe()

  useEffect(() => {
    if (redirectedRef.current) return
    redirectedRef.current = true

    if (!result.loading && !viewer) {
      localStorage.setItem(RETURN_TO_STORAGE_KEY, window.location.pathname)
      navigate(loginPath({}))
    }
  }, [navigate, result.loading, viewer])

  if (result.loading || !viewer) return null

  return <Outlet />
}

export const RequireSystemAdminSignedIn = () => {
  const navigate = useNavigate()
  const { viewer, result } = useViewerMaybe()
  const redirectedRef = useRef(false)

  useEffect(() => {
    if (redirectedRef.current) return
    redirectedRef.current = true

    if (viewer?.userRole !== "SYSTEM_ADMIN") {
      navigate(rootPath({}))
    }
  }, [navigate, result.loading, viewer])

  if (result.loading || !viewer) return null

  return <Outlet />
}
