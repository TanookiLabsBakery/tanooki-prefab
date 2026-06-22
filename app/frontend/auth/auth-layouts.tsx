import { useEffect, useRef } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import {
  connectChannelFinishPath,
  loginPath,
  onboardingWelcomePath,
  rootPath,
} from "~/common/paths"
import { useUiAccess } from "./use-ui-access"
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
    if (result.loading) return

    redirectedRef.current = true

    if (!viewer) {
      localStorage.setItem(RETURN_TO_STORAGE_KEY, window.location.pathname)
      navigate(loginPath({}))
      return
    }

    if (!viewer.onboardingCompletedAt) {
      const pathname = window.location.pathname
      const isOnboarding = pathname.startsWith("/onboarding")
      const isFinishingChannel = pathname === connectChannelFinishPath.pattern
      if (!isOnboarding && !isFinishingChannel) {
        navigate(onboardingWelcomePath({}))
      }
    }
  }, [navigate, result.loading, viewer])

  if (result.loading || !viewer) return null

  return <Outlet />
}

export const RequireSystemAdminSignedIn = () => {
  const navigate = useNavigate()
  const { viewer, result } = useViewerMaybe()
  const { uiAccess, loading: uiAccessLoading } = useUiAccess()
  const redirectedRef = useRef(false)

  useEffect(() => {
    if (redirectedRef.current) return
    redirectedRef.current = true

    if (!result.loading && !uiAccessLoading && !uiAccess?.canInternalAdmin.value) {
      navigate(rootPath({}))
    }
  }, [navigate, result.loading, uiAccessLoading, uiAccess, viewer])

  if (result.loading || !viewer || uiAccessLoading) return null

  return <Outlet />
}
