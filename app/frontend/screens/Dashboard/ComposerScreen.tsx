import { useQuery } from "@apollo/client/react"
import { format } from "date-fns"
import { useLocation } from "react-router-dom"
import { gql } from "~/__generated__"
import { useDocumentTitle } from "~/common/use-document-title"
import { ApprovalControls } from "~/components/Composer/ApprovalControls"
import { UnifiedComposer } from "~/components/Composer/UnifiedComposer"
import { Badge } from "~/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card"
import { GraphqlError } from "~/ui/graphql-error"
import { Skeleton } from "~/ui/skeleton"

const POST_DETAIL_QUERY = gql(/* GraphQL */ `
  query PostDetail($id: ID!) {
    post(id: $id) {
      id
      status
      scheduledAt
      channelVariants {
        id
        body
        channel {
          id
          name
          provider
        }
      }
    }
  }
`)

const PROVIDER_LABELS: Record<string, string> = {
  BLUESKY: "Bluesky",
  MASTODON: "Mastodon",
  THREADS: "Threads",
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  NEEDS_APPROVAL: "Needs Approval",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  ERROR: "Error",
}

const PostDetailView = ({ postId }: { postId: string }) => {
  const { data, loading, error } = useQuery(POST_DETAIL_QUERY, {
    variables: { id: postId },
  })

  if (loading) return <Skeleton className="h-48 w-full max-w-3xl rounded-lg" />
  if (error) return <GraphqlError error={error} />

  const post = data?.post
  if (!post) return <p className="text-sm text-muted-foreground">Post not found.</p>

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base">Post</CardTitle>
            <Badge variant="secondary">{STATUS_LABELS[post.status] ?? post.status}</Badge>
          </div>
          {post.scheduledAt && (
            <CardDescription>
              Scheduled for {format(new Date(post.scheduledAt), "PPP 'at' p")}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {post.channelVariants.map((variant) => (
            <div key={variant.id} className="flex flex-col gap-1">
              <p className="text-xs font-medium text-muted-foreground">
                {variant.channel.name} &mdash;{" "}
                {PROVIDER_LABELS[variant.channel.provider] ?? variant.channel.provider}
              </p>
              <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
                {variant.body ?? <span className="italic text-muted-foreground">No content</span>}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <ApprovalControls postId={postId} />
    </div>
  )
}

export const ComposerScreen = () => {
  useDocumentTitle("Compose")
  const location = useLocation()
  const postId = (location.state as { postId?: string } | null)?.postId

  if (postId) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">Post Detail</h1>
          <p className="text-muted-foreground">Review and manage this post.</p>
        </div>
        <PostDetailView postId={postId} />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">New Post</h1>
        <p className="text-muted-foreground">
          Compose a post and customise it for each connected channel.
        </p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Compose</CardTitle>
          <CardDescription>
            Write your content once, then tweak it per channel if needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UnifiedComposer />
        </CardContent>
      </Card>
    </div>
  )
}
