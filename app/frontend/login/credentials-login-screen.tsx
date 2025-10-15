import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import * as z from "zod"
import { gql } from "~/__generated__"
import { useViewerMaybe } from "~/auth/use-viewer"
import { useNavigateAfterAuth } from "~/auth/utils"
import { loginPath } from "~/common/paths"
import { useFormErrors } from "~/common/use-form-errors"
import { useSafeMutation } from "~/common/use-safe-mutation"
import { TextField } from "~/fields/text-field"
import { Button } from "~/ui/button"
import { Form } from "~/ui/form"
import { useToast } from "~/ui/use-toast"

const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
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
  const [login, loginResult] = useSafeMutation(LOGIN_MUTATION)
  const { viewer } = useViewerMaybe()
  const { toast } = useToast()
  const {
    result: { refetch: refetchViewer },
  } = useViewerMaybe()
  const { navigateAfterAuth } = useNavigateAfterAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  useFormErrors(form.setError, loginResult)

  const onSubmit = async (values: LoginFormValues) => {
    const result = await login({
      variables: {
        input: {
          email: values.email,
          password: values.password,
          rememberMe: true,
        },
      },
    })

    if (result.errors) {
      return
    }

    await refetchViewer()
    toast({
      title: "Login Successful",
      description: "You have been successfully logged in.",
      variant: "default",
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
