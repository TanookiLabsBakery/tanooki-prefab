import { useApolloClient, useQuery } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import invariant from "tiny-invariant"
import * as z from "zod"
import { gql } from "~/__generated__"
import { createApolloLink } from "~/common/create-apollo-link"
import { emailLoginPath, rootPath } from "~/common/paths"
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
  mutation CredentialsLoginScreenLogin($input: CredentialsUserAuthInput!) {
    login: credentialsUserAuth(input: $input) {
      user {
        id
        firstName
        lastName
      }
      csrfToken
    }
  }
`)

const VIEWER_QUERY = gql(`
  query CredentialsLoginScreenViewer {
    viewer {
      id
    }
  }
`)

export const CredentialsLoginScreen: React.FC = () => {
  const [login, loginResult] = useSafeMutation(LOGIN_MUTATION)
  const { data: viewerData } = useQuery(VIEWER_QUERY)
  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  useFormErrors(form.setError, loginResult)

  const apolloClient = useApolloClient()

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
    invariant(result.data, "Data should be present")

    apolloClient.link = createApolloLink(result.data.login.csrfToken)

    toast({
      title: "Login Successful",
      description: "You have been successfully logged in.",
      variant: "default",
    })
    // Redirect to the root path
    navigate(rootPath({}))
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-center text-2xl font-bold">Login with Credentials</h1>
        {viewerData?.viewer ? (
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
              <Link to={emailLoginPath({})} className="text-sm text-blue-600 hover:underline">
                Login with email link
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
