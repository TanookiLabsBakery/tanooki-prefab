import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import * as paths from "~/common/paths"
import { useViewerMaybe } from "../auth/use-viewer"
import { LinkButton } from "~/ui/link-button"

export const RootScreen = () => {
  const { viewer } = useViewerMaybe()
  const navigate = useNavigate()

  useEffect(() => {
    if (viewer) {
      navigate(paths.dashboardPath({}))
    }
  }, [navigate, viewer])

  return (
    <div data-testid="root-screen">
      <LinkButton to={paths.loginPath({})}>Sign In</LinkButton>
    </div>
  )
}
