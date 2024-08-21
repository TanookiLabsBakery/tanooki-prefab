import { useMutation } from "@apollo/client"
import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { gql } from "~/__generated__"
import { useViewerMaybe } from "~/auth/viewer-context"
import { loginPath } from "~/common/paths"
import { Button } from "~/ui/button"
import { useToast } from "~/ui/use-toast"

const LOGOUT_MUTATION = gql(`
  mutation Logout($input: LogoutInput!) {
    logout(input: $input) {
      success
    }
  }
`)

export const LandingScreen: React.FC = () => {
  const { viewer, result } = useViewerMaybe()
  const [logout] = useMutation(LOGOUT_MUTATION)
  const { toast } = useToast()
  const navigate = useNavigate()

  if (result.loading) return <div>Loading...</div>
  if (result.error) return <div>Error: {result.error.message}</div>

  const handleLogout = async () => {
    try {
      const result = await logout({
        variables: { input: {} },
      })
      if (result.data?.logout.success) {
        toast({
          title: "Logout Successful",
          description: "You have been successfully logged out.",
          variant: "default",
        })
        navigate(loginPath({}))
      }
    } catch (err) {
      console.error("Logout failed:", err)
      toast({
        title: "Logout Failed",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div data-testid="landing-screen">
      <h1>Welcome to the Landing Screen</h1>
      {viewer ? (
        <div>
          <p>
            Hello, {viewer.firstName} {viewer.lastName}!
          </p>
          <p>Your ID is: {viewer.id}</p>
          <Button onClick={handleLogout}>Logout</Button>
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
