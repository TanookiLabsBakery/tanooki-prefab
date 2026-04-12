import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { dashboardPath } from "~/common/paths"
import { LandingPage } from "~/landing/landing-page"
import { useUiAccess } from "../auth/use-ui-access"
import { useViewerMaybe } from "../auth/use-viewer"

export const RootScreen = () => {
  const { viewer } = useViewerMaybe()
  const { uiAccess } = useUiAccess()
  const navigate = useNavigate()

  useEffect(() => {
    if (viewer) {
      navigate(dashboardPath({}))
    }
  }, [navigate, viewer, uiAccess])

  if (viewer) return null

  return <LandingPage />
}
