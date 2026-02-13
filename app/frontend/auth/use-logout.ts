import { useMutation } from "@apollo/client/react"
import invariant from "tiny-invariant"
import { gql } from "~/__generated__"
import { rootPath } from "~/common/paths"
import { useToast } from "~/ui/use-toast"

const LOGOUT_MUTATION = gql(`
  mutation Logout($input: LogoutInput!) {
    logout(input: $input) {
      success
    }
  }
`)

export const useLogout = () => {
  const [logoutMutation] = useMutation(LOGOUT_MUTATION)
  const { toast } = useToast()

  const logout = async () => {
    const result = await logoutMutation({
      variables: { input: {} },
    })

    if (result.error) {
      console.error("Logout failed:", result.error)
      toast({
        title: "Logout Failed",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      })
      return
    }

    invariant(result.data, "Data should be defined")
    invariant(result.data.logout.success, "Logout failed")

    window.location.href = rootPath({})
  }

  return logout
}
