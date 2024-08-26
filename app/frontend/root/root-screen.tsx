import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { dashboardPath, profilePath, loginPath } from "~/common/paths"
import { useViewerMaybe } from "../auth/use-viewer"
import { LinkButton } from "~/ui/link-button"
import { UserRole } from "~/__generated__/graphql"

export const RootScreen = () => {
  const { viewer } = useViewerMaybe()
  const navigate = useNavigate()

  useEffect(() => {
    if (viewer) {
      if (viewer.userRole === UserRole.SystemAdmin) {
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
