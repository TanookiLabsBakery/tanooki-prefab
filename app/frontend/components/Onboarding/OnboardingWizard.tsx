import { useMutation } from "@apollo/client/react"
import { Check } from "lucide-react"
import { Fragment, useRef, useState } from "react"
import { gql } from "~/__generated__"
import { cn } from "~/common/cn"
import { Button } from "~/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card"

const COMPLETE_ONBOARDING_MUTATION = gql(/* GraphQL */ `
  mutation CompleteOnboarding($input: CompleteOnboardingInput!) {
    completeOnboarding(input: $input) {
      viewer {
        id
        onboardingCompletedAt
      }
    }
  }
`)

const STEPS = [
  { number: 1, label: "Welcome" },
  { number: 2, label: "Connect Channel" },
  { number: 3, label: "Create a Post" },
]

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center gap-0">
    {STEPS.map((step, index) => (
      <Fragment key={step.number}>
        <div className="flex flex-col items-center gap-1.5">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
              step.number < currentStep && "bg-primary text-primary-foreground",
              step.number === currentStep &&
                "bg-primary text-primary-foreground ring-4 ring-primary/20",
              step.number > currentStep && "bg-muted text-muted-foreground"
            )}
          >
            {step.number < currentStep ? <Check className="size-4" /> : step.number}
          </div>
          <span
            className={cn(
              "text-xs font-medium",
              step.number <= currentStep ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {step.label}
          </span>
        </div>
        {index < STEPS.length - 1 && (
          <div
            className={cn(
              "mb-5 h-px w-16 shrink-0 transition-colors",
              step.number < currentStep ? "bg-primary" : "bg-border"
            )}
          />
        )}
      </Fragment>
    ))}
  </div>
)

const ThreadsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 192 192"
    className="size-6"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.723-10.548 21.347-10.548h.23c8.248.054 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 6.979 4.708 15.965 7.006 25.313 6.479 12.323-.68 21.982-5.377 28.705-13.956 5.12-6.498 8.36-14.917 9.792-25.588 5.864 3.543 10.208 8.216 12.643 13.95 4.062 9.696 4.303 25.64-8.453 38.334-11.246 11.178-24.763 16.01-45.147 16.153-22.625-.162-39.733-7.42-50.853-21.566C41.405 136.5 36 118.5 36 96c0-22.5 5.405-40.5 16.086-53.568C63.206 28.286 80.314 21.03 102.939 20.868c22.756.163 40.176 7.45 51.82 21.668 5.74 7.02 10.034 15.88 12.757 26.235l16.206-4.343c-3.26-12.107-8.498-22.66-15.633-31.398C151.86 14.558 129.795 4.765 102.984 4.6h-.067C76.27 4.765 54.527 14.588 39.663 32.812 26.29 49.293 19.374 72.277 19.2 96c.174 23.723 7.09 46.707 20.463 63.188 14.864 18.224 36.607 28.047 63.114 28.212h.068c23.682-.144 40.337-6.37 54.101-20.134 18.171-18.124 17.612-40.892 11.658-54.864-4.296-10.256-12.597-18.584-26.067-23.414ZM100.946 129.4c-10.437.576-21.287-4.098-21.845-14.218-.4-7.498 5.334-15.883 22.605-16.866 1.979-.114 3.921-.169 5.827-.169 6.18 0 11.95.601 17.204 1.752-1.959 24.402-13.996 28.924-23.79 29.501Z" />
  </svg>
)

const WelcomeStep = ({ onNext, firstName }: { onNext: () => void; firstName: string }) => (
  <div className="flex flex-col items-center gap-8 text-center">
    <div className="flex flex-col gap-3">
      <h1 className="text-3xl font-bold tracking-tight">Welcome, {firstName}!</h1>
      <p className="max-w-md text-muted-foreground">
        Let&apos;s get you set up in just a couple of steps. You&apos;ll be publishing content in no
        time.
      </p>
    </div>

    <div className="grid w-full max-w-sm gap-3 text-left">
      {[
        { icon: "📡", title: "Connect a channel", desc: "Link your social accounts" },
        { icon: "✍️", title: "Create your first post", desc: "Draft and schedule content" },
        { icon: "📊", title: "Track performance", desc: "Monitor engagement and reach" },
      ].map((item) => (
        <div
          key={item.title}
          className="flex items-center gap-3 rounded-lg border border-border p-3"
        >
          <span className="text-xl">{item.icon}</span>
          <div>
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>

    <Button size="lg" onClick={onNext} className="min-w-[160px]">
      Get Started
    </Button>
  </div>
)

const ConnectChannelStep = () => (
  <div className="flex flex-col items-center gap-6 text-center">
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold">Connect your first channel</h2>
      <p className="max-w-md text-muted-foreground">
        Link a social media account to start publishing and managing your content.
      </p>
    </div>

    <div className="grid w-full max-w-sm gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <ThreadsIcon />
            <CardTitle>Threads</CardTitle>
          </div>
          <CardDescription>
            Connect your Threads account to publish and manage your content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a href="/auth/threads">
            <Button className="w-full">Connect Threads</Button>
          </a>
        </CardContent>
      </Card>
    </div>

    <p className="text-xs text-muted-foreground">More platforms coming soon</p>
  </div>
)

export const OnboardingWizard = ({ firstName }: { firstName: string }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [completeOnboarding] = useMutation(COMPLETE_ONBOARDING_MUTATION, { onError: () => null })
  const completedRef = useRef(false)

  const handleSkip = async () => {
    if (completedRef.current) return
    completedRef.current = true
    await completeOnboarding({ variables: { input: {} } })
    window.location.href = "/dashboard"
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 p-6">
      <div className="w-full max-w-lg">
        <StepIndicator currentStep={currentStep} />
      </div>

      <div className="w-full max-w-lg">
        {currentStep === 1 && (
          <WelcomeStep firstName={firstName} onNext={() => setCurrentStep(2)} />
        )}
        {currentStep === 2 && <ConnectChannelStep />}
      </div>

      <button
        type="button"
        onClick={handleSkip}
        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
      >
        Skip onboarding
      </button>
    </div>
  )
}
