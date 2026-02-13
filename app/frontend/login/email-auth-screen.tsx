import { useMutation } from "@apollo/client/react"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { gql } from "~/__generated__"
import { useUiAccess } from "~/auth/use-ui-access"
import { useViewerMaybe } from "~/auth/use-viewer"
import { useNavigateAfterAuth } from "~/auth/utils"
import { rootPath } from "~/common/paths"
import { Button } from "~/ui/button"
import { updateCsrfTag } from "./utils"

export const EMAIL_TOKEN_AUTH_MUTATION = gql(/* GraphQL */ `
  mutation EmailTokenAuth($input: EmailTokenUserAuthInput!) {
    emailTokenUserAuth(input: $input) {
      success
      csrfToken
    }
  }
`)

const checkValidity = (clientAuthCode: string | undefined) => {
  const storedAuthCodes = JSON.parse(localStorage.getItem("authCodes") || "[]")
  return storedAuthCodes.includes(clientAuthCode)
}

export const EmailAuthScreen: React.FC = () => {
  const { email, token, clientAuthCode } = useParams<{
    email: string
    token: string
    clientAuthCode: string
  }>()
  const [emailTokenAuth] = useMutation(EMAIL_TOKEN_AUTH_MUTATION)
  const navigate = useNavigate()
  const [isValidClient] = useState<boolean | null>(checkValidity(clientAuthCode))
  const { navigateAfterAuth } = useNavigateAfterAuth()

  useEffect(() => {}, [clientAuthCode])
  const {
    result: { refetch: viewerRefetch },
  } = useViewerMaybe()
  const { refetch: refetchUiAccess } = useUiAccess()

  const handleAuthentication = async () => {
    if (!email || !token || !clientAuthCode) {
      toast.error("Authentication Failed", {
        description: "Missing required information for authentication.",
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

    if (result.error) {
      console.error("Email token auth failed:", result.error)
      toast.error("Authentication Failed", {
        description: "An error occurred during authentication. Please try again.",
      })
      return
    }

    if (result.data?.emailTokenUserAuth.success) {
      updateCsrfTag(result.data.emailTokenUserAuth.csrfToken)
      await viewerRefetch()
      await refetchUiAccess()
      toast.success("Authentication Successful", {
        description: "You have been successfully logged in.",
      })
      navigateAfterAuth()
    } else {
      toast.error("Authentication Failed", {
        description: "Unable to authenticate. Please try again.",
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
              It appears you&apos;re using a different browser than the one you initiated the login
              from. Please return to the original browser or device to complete the authentication
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
