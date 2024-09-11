import { useApolloClient } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import * as z from "zod"
import { gql } from "~/__generated__"
import { useViewerMaybe } from "~/auth/use-viewer"
import { createApolloLink } from "~/common/create-apollo-link"
import { credentialsLoginPath, rootPath } from "~/common/paths"
import { useSafeMutation } from "~/common/use-safe-mutation"
import { TextField } from "~/fields/text-field"
import { Button } from "~/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/ui/input-otp"
import { useToast } from "~/ui/use-toast"

const emailLoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

const otpFormSchema = z.object({
  otp: z.string().length(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

type EmailLoginFormValues = z.infer<typeof emailLoginFormSchema>
type OtpFormValues = z.infer<typeof otpFormSchema>

const EMAIL_AUTH_CHALLENGE_MUTATION = gql(/* GraphQL */ `
  mutation EmailAuthChallenge($input: EmailUserAuthChallengeInput!) {
    emailUserAuthChallenge(input: $input) {
      success
    }
  }
`)

const EMAIL_TOKEN_AUTH_MUTATION = gql(/* GraphQL */ `
  mutation EmailTokenAuth($input: EmailTokenUserAuthInput!) {
    emailTokenUserAuth(input: $input) {
      success
      csrfToken
    }
  }
`)

export const EmailLoginScreen: React.FC = () => {
  const [emailAuthChallenge, { loading: challengeLoading }] = useSafeMutation(
    EMAIL_AUTH_CHALLENGE_MUTATION
  )
  const [emailTokenAuth, { loading: tokenAuthLoading }] = useSafeMutation(EMAIL_TOKEN_AUTH_MUTATION)
  const { toast } = useToast()
  const [step, setStep] = useState<"email" | "checkEmail" | "otp">("email")
  const [email, setEmail] = useState("")
  const navigate = useNavigate()
  const apolloClient = useApolloClient()
  const {
    result: { refetch: viewerRefetch },
  } = useViewerMaybe()

  const emailForm = useForm<EmailLoginFormValues>({
    resolver: zodResolver(emailLoginFormSchema),
    defaultValues: {
      email: "",
    },
  })

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  })

  const onEmailSubmit = async (values: EmailLoginFormValues) => {
    const storedAuthCodes = JSON.parse(localStorage.getItem("authCodes") || "[]")
    let newClientAuthCode: string
    if (storedAuthCodes.length === 0) {
      newClientAuthCode = uuidv4()
      localStorage.setItem("authCodes", JSON.stringify([newClientAuthCode]))
    } else {
      newClientAuthCode = storedAuthCodes[storedAuthCodes.length - 1]
    }

    const result = await emailAuthChallenge({
      variables: {
        input: {
          email: values.email,
          clientAuthCode: newClientAuthCode,
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
      setEmail(values.email)
      setStep("checkEmail")
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

  const onOtpSubmit = async (values: OtpFormValues) => {
    const result = await emailTokenAuth({
      variables: {
        input: {
          email,
          token: values.otp,
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-center text-2xl font-bold">Login with Email</h1>
        {step === "email" && (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
              <TextField
                control={emailForm.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
              <Button type="submit" className="w-full" disabled={challengeLoading}>
                {challengeLoading ? "Sending..." : "Send Login Link"}
              </Button>
            </form>
          </Form>
        )}
        {step === "checkEmail" && (
          <div className="space-y-6">
            <p className="text-center">Check your email for the login link.</p>
            <Button onClick={() => setStep("otp")} className="w-full">
              Enter code manually
            </Button>
          </div>
        )}
        {step === "otp" && (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="flex flex-col space-y-6">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter code</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        data-1p-ignore="true"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={tokenAuthLoading}>
                {tokenAuthLoading ? "Verifying..." : "Continue with login code"}
              </Button>
            </form>
          </Form>
        )}
        <div className="space-y-2 text-center">
          <Link
            to={credentialsLoginPath({})}
            className="block text-sm text-blue-600 hover:underline"
          >
            Login with username and password
          </Link>
        </div>
      </div>
    </div>
  )
}
