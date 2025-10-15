import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { loginPath, profilePath } from "~/common/paths"
import { LinkButton } from "~/ui/link-button"
import { useViewerMaybe } from "../auth/use-viewer"

export const RootScreen = () => {
  const { viewer } = useViewerMaybe()
  const navigate = useNavigate()

  useEffect(() => {
    if (viewer) {
      navigate(profilePath({}))
    }
  }, [navigate, viewer])

  if (viewer) return null

  return (
    <div data-testid="root-screen">
      <LinkButton to={loginPath({})}>Sign In</LinkButton>
    </div>
  )
}
