import { useMutation } from "@apollo/client/react"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { gql } from "~/__generated__"
import { useViewer } from "~/auth/use-viewer"
import { composerPath, connectChannelPath, dashboardPath } from "~/common/paths"
import { useDocumentTitle } from "~/common/use-document-title"
import { Button } from "~/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card"
import { GraphqlError } from "~/ui/graphql-error"

const CHANNEL_CREATE_MUTATION = gql(/* GraphQL */ `
  mutation ChannelCreate($input: ChannelCreateInput!) {
    channelCreate(input: $input) {
      channel {
        id
        name
        provider
        remoteId
      }
    }
  }
`)

const COMPLETE_ONBOARDING_MUTATION = gql(/* GraphQL */ `
  mutation CompleteOnboardingAfterChannel($input: CompleteOnboardingInput!) {
    completeOnboarding(input: $input) {
      viewer {
        id
        onboardingCompletedAt
      }
    }
  }
`)

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

const BlueSkyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 568 501"
    className="size-6"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.209C491.866-1.611 568-28.906 568 57.876c0 17.796-10.162 149.737-16.107 171.16-20.681 73.148-96.064 91.878-163.014 80.553 117.141 19.964 147.036 86.092 82.697 152.22C358.337 534.651 312.42 505.75 284 439.351c-28.42 66.399-74.337 95.3-187.576 22.457-64.339-66.128-34.444-132.256 82.697-152.22-66.95 11.325-142.333-7.405-163.014-80.553C10.162 207.613 0 75.672 0 57.876 0-28.906 76.134-1.611 123.121 33.664Z" />
  </svg>
)

const MastodonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 74 79"
    className="size-6"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M73.7014 17.4323C72.5616 9.05152 65.1774 2.4469 56.424 1.1671C54.9472 0.950843 49.3518 0.163818 36.3901 0.163818H36.2933C23.3281 0.163818 20.5465 0.950843 19.0697 1.1671C10.56 2.41145 2.78877 8.34604 0.903306 16.826C-0.00357854 21.0022 -0.100361 25.6322 0.068112 29.8793C0.308273 35.9699 0.354125 42.0498 0.91497 48.1084C1.45197 53.568 2.35021 58.9834 3.60449 64.3162C5.33016 71.427 12.4781 77.4405 19.4354 79.8523C26.8861 82.4145 34.9209 82.8367 42.6044 81.0574C43.3993 80.8771 44.1852 80.6763 44.9608 80.4549C46.8447 79.9165 49.0105 79.3062 50.6385 78.1798C50.6601 78.1643 50.6781 78.1442 50.6911 78.1211C50.7041 78.0979 50.7118 78.0722 50.7135 78.0459V71.8295C50.7117 71.8067 50.7049 71.7845 50.6934 71.7648C50.682 71.7451 50.6661 71.7284 50.6474 71.7159C50.6286 71.7034 50.6073 71.6952 50.585 71.6921C50.5627 71.689 50.5401 71.691 50.5186 71.6979C45.9765 73.0166 41.2822 73.6748 36.5629 73.658C29.7024 73.658 27.9821 70.4272 27.4853 69.1729C27.0713 68.0803 26.8032 66.9388 26.6878 65.7791C26.686 65.7575 26.6888 65.7357 26.6959 65.7153C26.703 65.6948 26.7143 65.6762 26.7291 65.6606C26.7439 65.645 26.7619 65.6328 26.7819 65.625C26.8018 65.6172 26.8232 65.6139 26.8447 65.6154C31.3026 66.9218 35.9204 67.582 40.5617 67.5799C41.6616 67.5799 42.7581 67.5799 43.8546 67.5503C48.5502 67.4193 53.4969 67.1929 58.0956 66.2822C58.2007 66.2604 58.3058 66.2418 58.3949 66.2168C65.6512 64.7786 72.5425 60.4386 73.2629 49.4399C73.2881 49.0204 73.3421 44.8127 73.3421 44.3759C73.3557 42.8756 73.8522 33.1862 73.7014 17.4323ZM61.4399 55.5905H53.1917V31.0993C53.1917 26.9799 51.4497 24.8765 47.9175 24.8765C44.0595 24.8765 42.126 27.4442 42.126 32.5153V45.3854H33.9169V32.5153C33.9169 27.4442 31.9798 24.8765 28.1218 24.8765C24.6027 24.8765 22.8607 26.9799 22.8607 31.0993V55.5905H14.6113V30.5489C14.6113 26.4295 15.6871 23.1367 17.8398 20.6714C20.0589 18.2056 22.9977 16.9397 26.6756 16.9397C30.9356 16.9397 34.1521 18.5443 36.2928 21.7537L38.0635 24.5702L39.8341 21.7537C41.9748 18.5443 45.1913 16.9397 49.4513 16.9397C53.1261 16.9397 56.0649 18.2056 58.2901 20.6714C60.4428 23.1367 61.5186 26.4295 61.5186 30.5489L61.4399 55.5905Z" />
  </svg>
)

const ConnectProviderCards = () => (
  <div className="flex flex-1 flex-col gap-6 p-6">
    <div>
      <h1 className="text-2xl font-bold">Connect a Channel</h1>
      <p className="text-muted-foreground">
        Connect your social media accounts to start publishing content.
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BlueSkyIcon />
            <CardTitle>Bluesky</CardTitle>
          </div>
          <CardDescription>
            Connect your Bluesky account to publish and manage your content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a href="/auth/bluesky">
            <Button className="w-full">Connect Bluesky</Button>
          </a>
        </CardContent>
      </Card>

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

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <MastodonIcon />
            <CardTitle>Mastodon</CardTitle>
          </div>
          <CardDescription>
            Connect your Mastodon account to publish and manage your content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a href="/auth/mastodon">
            <Button className="w-full">Connect Mastodon</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  </div>
)

const FinishConnectChannel = () => {
  const navigate = useNavigate()
  const { viewer } = useViewer()
  const [searchParams] = useSearchParams()
  const [mutationError, setMutationError] = useState<Error | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const wasOnboardingRef = useRef(!viewer.onboardingCompletedAt)

  const credentialId = searchParams.get("credential_id")
  const name = searchParams.get("name")
  const remoteId = searchParams.get("remote_id")
  const error = searchParams.get("error")

  const [channelCreate] = useMutation(CHANNEL_CREATE_MUTATION, { onError: () => null })
  const [completeOnboarding] = useMutation(COMPLETE_ONBOARDING_MUTATION, { onError: () => null })

  useEffect(() => {
    if (!credentialId || !name || !remoteId) return

    const timer = setTimeout(() => {
      setIsCreating(true)

      channelCreate({
        variables: {
          input: {
            credentialId,
            name,
            remoteId,
          },
        },
      })
        .then(async (result) => {
          if (result.error) {
            setMutationError(result.error)
            setIsCreating(false)
            return
          }

          if (wasOnboardingRef.current) {
            await completeOnboarding({ variables: { input: {} } })
          }

          toast.success("Channel connected!", {
            description: `${name} has been successfully connected.`,
          })
          navigate(wasOnboardingRef.current ? composerPath({}) : dashboardPath({}))
        })
        .catch((err) => {
          setMutationError(err)
          setIsCreating(false)
        })
    }, 0)

    return () => clearTimeout(timer)
  }, [credentialId, name, remoteId, channelCreate, completeOnboarding, navigate])

  if (error) {
    const errorMessages: Record<string, string> = {
      invalid_state: "The authorization request was invalid. Please try again.",
      missing_code: "No authorization code was received. Please try again.",
      token_exchange_failed:
        "Failed to complete authorization with the provider. Please try again.",
      access_denied: "You denied access. Please try connecting again.",
    }

    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">Connection Failed</h1>
          <p className="text-muted-foreground">
            {errorMessages[error] ?? "Something went wrong during the connection."}
          </p>
        </div>
        <div>
          <a href={connectChannelPath({})}>
            <Button variant="outline">Try Again</Button>
          </a>
        </div>
      </div>
    )
  }

  if (mutationError) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">Connection Failed</h1>
          <p className="text-muted-foreground">
            We connected to the provider but could not save your channel.
          </p>
        </div>
        <GraphqlError error={mutationError} />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {isCreating ? "Connecting your channel…" : "Almost there…"}
        </h1>
        <p className="text-muted-foreground">
          {name ? `Setting up ${name}` : "Finalizing your channel connection"}
        </p>
      </div>
    </div>
  )
}

export const ConnectChannelScreen = () => {
  const [searchParams] = useSearchParams()
  useDocumentTitle("Connect Channel")

  const isFinishing = searchParams.has("credential_id") || searchParams.has("error")

  return isFinishing ? <FinishConnectChannel /> : <ConnectProviderCards />
}
