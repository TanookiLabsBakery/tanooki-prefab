import React from "react"
import { gql } from "~/__generated__"
import { useQuery, useMutation } from "@apollo/client"
import { Button } from "~/ui/button"
import { useToast } from "~/ui/use-toast"
import { useNavigate } from "react-router-dom"
import { loginPath } from "~/common/paths"

const GET_VIEWER = gql(`
  query GetViewer {
    viewer {
      id
      firstName
      lastName
    }
  }
`)

const LOGOUT_MUTATION = gql(`
  mutation Logout($input: LogoutInput!) {
    logout(input: $input) {
      success
    }
  }
`)

export const LandingScreen: React.FC = () => {
  const { loading, error, data } = useQuery(GET_VIEWER)
  const [logout] = useMutation(LOGOUT_MUTATION)
  const { toast } = useToast()
  const navigate = useNavigate()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const viewer = data?.viewer

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
    <div>
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
        <p>No viewer data available.</p>
      )}
    </div>
  )
}
