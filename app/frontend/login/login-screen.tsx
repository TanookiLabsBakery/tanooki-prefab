import { useMutation, useQuery } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import * as z from "zod"
import { gql } from "~/__generated__"
import { rootPath } from "~/common/paths"
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
  mutation Login($input: LoginWithCredentialsInput!) {
    login: loginWithCredentials(input: $input) {
      user {
        id
        firstName
        lastName
      }
    }
  }
`)

const VIEWER_QUERY = gql(`
  query Viewer {
    viewer {
      id
    }
  }
`)

export const LoginScreen: React.FC = () => {
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION)
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

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login({
        variables: {
          input: {
            email: values.email,
            password: values.password,
            rememberMe: true,
          },
        },
      })
      toast({
        title: "Login Successful",
        description: "You have been successfully logged in.",
        variant: "default",
      })
      // Redirect to the root path
      navigate(rootPath({}))
    } catch (err) {
      console.error("Login failed:", err)
      toast({
        title: "Login Failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-center text-2xl font-bold">Login</h1>
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
            {error && (
              <p className="mt-2 text-sm text-red-500">
                {error.message || "An error occurred during login."}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
