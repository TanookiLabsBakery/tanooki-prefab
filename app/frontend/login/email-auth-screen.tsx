import { useApolloClient } from "@apollo/client"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { gql } from "~/__generated__"
import { useViewerMaybe } from "~/auth/use-viewer"
import { createApolloLink } from "~/common/create-apollo-link"
import { rootPath } from "~/common/paths"
import { useSafeMutation } from "~/common/use-safe-mutation"
import { Button } from "~/ui/button"
import { useToast } from "~/ui/use-toast"

const EMAIL_TOKEN_AUTH_MUTATION = gql(/* GraphQL */ `
  mutation EmailTokenAuth($input: EmailTokenUserAuthInput!) {
    emailTokenUserAuth(input: $input) {
      success
      csrfToken
    }
  }
`)

export const EmailAuthScreen: React.FC = () => {
  const { email, token, clientAuthCode } = useParams<{
    email: string
    token: string
    clientAuthCode: string
  }>()
  const [emailTokenAuth] = useSafeMutation(EMAIL_TOKEN_AUTH_MUTATION)
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isValidClient, setIsValidClient] = useState<boolean | null>(null)

  useEffect(() => {
    const storedAuthCodes = JSON.parse(localStorage.getItem("authCodes") || "[]")
    setIsValidClient(storedAuthCodes.includes(clientAuthCode))
  }, [clientAuthCode])
  const apolloClient = useApolloClient()
  const {
    result: { refetch: viewerRefetch },
  } = useViewerMaybe()

  const handleAuthentication = async () => {
    if (!email || !token || !clientAuthCode) {
      toast({
        title: "Authentication Failed",
        description: "Missing required information for authentication.",
        variant: "destructive",
      })
      return
    }

    const result = await emailTokenAuth({
      variables: {
        input: {
          email,
          token,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      },
    })

    if (result.errors) {
      console.error("Email token auth failed:", result.errors)
      toast({
        title: "Authentication Failed",
        description: "An error occurred during authentication. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (result.data?.emailTokenUserAuth.success) {
      apolloClient.link = createApolloLink(result.data.emailTokenUserAuth.csrfToken)
      viewerRefetch()
      toast({
        title: "Authentication Successful",
        description: "You have been successfully logged in.",
        variant: "default",
      })
      navigate(rootPath({}))
    } else {
      toast({
        title: "Authentication Failed",
        description: "Unable to authenticate. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isValidClient === null) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-center text-2xl font-bold">Email Authentication</h1>
        {isValidClient ? (
          <div className="space-y-4">
            <p>Click the button below to complete your authentication.</p>
            <Button onClick={handleAuthentication} className="w-full">
              Authenticate
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p>
              It appears you're using a different browser than the one you initiated the login from.
              Please return to the original browser or device to complete the authentication
              process.
            </p>
            <Button onClick={() => navigate(rootPath({}))} className="w-full">
              Return to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
