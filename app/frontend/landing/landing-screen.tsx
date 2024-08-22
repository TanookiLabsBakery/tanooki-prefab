import React from "react"
import { Link } from "react-router-dom"
import { useViewerMaybe } from "~/auth/use-viewer"
import { useLogout } from "~/auth/use-logout"
import { loginPath } from "~/common/paths"
import { Button } from "~/ui/button"

export const LandingScreen: React.FC = () => {
  const { viewer, result } = useViewerMaybe()
  const logout = useLogout()

  if (result.loading) return <div>Loading...</div>
  if (result.error) return <div>Error: {result.error.message}</div>

  return (
    <div data-testid="landing-screen">
      <h1>Welcome to the Landing Screen</h1>
      {viewer ? (
        <div>
          <p>
            Hello, {viewer.firstName} {viewer.lastName}!
          </p>
          <p>Your ID is: {viewer.id}</p>
          <Button onClick={logout}>Logout</Button>
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <Link to={loginPath({})}>
            <Button>Login</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
