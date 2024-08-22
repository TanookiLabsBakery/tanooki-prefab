import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import * as z from "zod"
import { gql } from "~/__generated__"
import { credentialsLoginPath } from "~/common/paths"
import { useSafeMutation } from "~/common/use-safe-mutation"
import { TextField } from "~/fields/text-field"
import { Button } from "~/ui/button"
import { Form } from "~/ui/form"
import { useToast } from "~/ui/use-toast"

const emailLoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

type EmailLoginFormValues = z.infer<typeof emailLoginFormSchema>

const EMAIL_AUTH_CHALLENGE_MUTATION = gql(/* GraphQL */ `
  mutation EmailAuthChallenge($input: EmailUserAuthChallengeInput!) {
    emailUserAuthChallenge(input: $input) {
      success
    }
  }
`)

export const EmailLoginScreen: React.FC = () => {
  const [emailAuthChallenge, { loading, error }] = useSafeMutation(EMAIL_AUTH_CHALLENGE_MUTATION)
  const { toast } = useToast()

  const form = useForm<EmailLoginFormValues>({
    resolver: zodResolver(emailLoginFormSchema),
    defaultValues: {
      email: "",
    },
  })

  useEffect(() => {
    const storedAuthCodes = JSON.parse(localStorage.getItem("authCodes") || "[]")
    if (storedAuthCodes.length === 0) {
      const newAuthCode = uuidv4()
      localStorage.setItem("authCodes", JSON.stringify([newAuthCode]))
    }
  }, [])

  const onSubmit = async (values: EmailLoginFormValues) => {
    const authCodes = JSON.parse(localStorage.getItem("authCodes") || "[]")
    const clientAuthCode = authCodes[authCodes.length - 1]

    const result = await emailAuthChallenge({
      variables: {
        input: {
          email: values.email,
          clientAuthCode,
        },
      },
    })

    if (result.errors) {
      console.error("Email auth challenge failed:", result.errors)
      toast({
        title: "Login Failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (result.data?.emailUserAuthChallenge.success) {
      toast({
        title: "Email Sent",
        description: "Please check your email for the login link.",
        variant: "default",
      })
    } else {
      toast({
        title: "Login Failed",
        description: "Unable to send login email. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-center text-2xl font-bold">Login with Email</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TextField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter your email"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Login Link"}
            </Button>
          </form>
        </Form>
        {error && (
          <p className="mt-2 text-sm text-red-500">
            {error.message || "An error occurred during login."}
          </p>
        )}
        <div className="text-center">
          <Link to={credentialsLoginPath({})} className="text-sm text-blue-600 hover:underline">
            Login with username and password
          </Link>
        </div>
      </div>
    </div>
  )
}
