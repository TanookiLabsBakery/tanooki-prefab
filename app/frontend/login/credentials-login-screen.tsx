import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import * as z from "zod"
import { gql } from "~/__generated__"
import { useUiAccess } from "~/auth/use-ui-access"
import { useViewerMaybe } from "~/auth/use-viewer"
import { useNavigateAfterAuth } from "~/auth/utils"
import { useFormErrorHandling } from "~/common/error-handling"
import { loginPath } from "~/common/paths"
import { Button } from "~/ui/button"
import { Form } from "~/ui/form"
import { TextField } from "~/ui/forms/fields/text-field"
import { FormGeneralErrors } from "~/ui/forms/form-general-errors"

const loginFormSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string(),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

const LOGIN_MUTATION = gql(/* GraphQL */ `
  mutation Login($input: CredentialsUserAuthInput!) {
    login: credentialsUserAuth(input: $input) {
      user {
        id
        firstName
        lastName
      }
    }
  }
`)

export const CredentialsLoginScreen: React.FC = () => {
  const [login, loginResult] = useMutation(LOGIN_MUTATION)
  const { viewer } = useViewerMaybe()
  const {
    result: { refetch: refetchViewer },
  } = useViewerMaybe()
  const { navigateAfterAuth } = useNavigateAfterAuth()
  const { refetch: refetchUiAccess } = useUiAccess()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const { onError } = useFormErrorHandling(form)

  const onSubmit = async (values: LoginFormValues) => {
    const { error } = await login({
      onError,
      variables: {
        input: {
          email: values.email,
          password: values.password,
          rememberMe: true,
        },
      },
    })

    if (error) {
      return
    }

    await refetchViewer()
    await refetchUiAccess()
    toast.success("Login Successful", {
      description: "You have been successfully logged in.",
    })
    navigateAfterAuth()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-center text-2xl font-bold">Login with Credentials</h1>
        {viewer ? (
          <p className="text-center">You are already logged in.</p>
        ) : (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormGeneralErrors control={form.control} />
                <TextField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                />
                <TextField
                  control={form.control}
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                />
                <Button type="submit" className="w-full" disabled={loginResult.loading}>
                  {loginResult.loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
            <div className="text-center">
              <Link to={loginPath({})} className="text-sm text-blue-600 hover:underline">
                Login with email link
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
