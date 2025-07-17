import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { dashboardPath, loginPath, profilePath } from "~/common/paths"
import { LinkButton } from "~/ui/link-button"
import { useViewerMaybe } from "../auth/use-viewer"

export const RootScreen = () => {
  const { viewer } = useViewerMaybe()
  const navigate = useNavigate()

  useEffect(() => {
    if (viewer) {
      if (viewer.userRole === "SYSTEM_ADMIN") {
        navigate(dashboardPath({}))
      } else {
        navigate(profilePath({}))
      }
    }
  }, [navigate, viewer])

  return (
    <div data-testid="root-screen">
      <LinkButton to={loginPath({})}>Sign In</LinkButton>
    </div>
  )
}
