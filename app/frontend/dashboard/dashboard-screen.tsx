import { useQuery } from "@apollo/client/react"
import { format } from "date-fns"
import { CalendarClock, CheckCircle2, Clock, PenSquare } from "lucide-react"
import { Link } from "react-router-dom"
import { gql } from "~/__generated__"
import { useViewer } from "~/auth/use-viewer"
import { calendarPath, composerPath, postAnalyticsPath } from "~/common/paths"
import { useDocumentTitle } from "~/common/use-document-title"
import { Badge } from "~/ui/badge"
import { Button } from "~/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card"
import { GraphqlError } from "~/ui/graphql-error"
import { Skeleton } from "~/ui/skeleton"

const DASHBOARD_QUERY = gql(/* GraphQL */ `
  query Dashboard {
    dashboard {
      scheduledPosts {
        id
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
      needsApprovalPosts {
        id
        scheduledAt
        viewerCanApprove
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
      recentPublishedPosts {
        id
        scheduledAt
        channelVariants {
          id
          body
          channel {
            id
            name
            provider
          }
          postAnalytic {
            id
            impressions
            likes
            comments
          }
        }
      }
      channels {
        id
        name
        provider
      }
    }
  }
`)

const PROVIDER_LABELS: Record<string, string> = {
  BLUESKY: "Bluesky",
  MASTODON: "Mastodon",
  THREADS: "Threads",
}

const PostPreviewCard = ({
  post,
  href,
  state,
}: {
  post: {
    id: string
    scheduledAt?: string | null
    channelVariants: Array<{
      id: string
      body?: string | null
      channel: { id: string; name: string; provider: string }
    }>
  }
  href: string
  state?: Record<string, string>
}) => {
  const firstVariant = post.channelVariants[0]
  return (
    <Link to={href} state={state} className="block">
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="pt-4">
          <p className="line-clamp-2 text-sm">{firstVariant?.body ?? "No content"}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {post.scheduledAt && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {format(new Date(post.scheduledAt), "MMM d, h:mm a")}
              </span>
            )}
            {post.channelVariants.map((v) => (
              <Badge key={v.id} variant="secondary" className="text-xs">
                {PROVIDER_LABELS[v.channel.provider] ?? v.channel.provider}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

const SectionSkeleton = () => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} className="h-20 rounded-lg" />
    ))}
  </div>
)

export const DashboardScreen = () => {
  const { viewer } = useViewer()
  useDocumentTitle("Dashboard")

  const { data, loading, error } = useQuery(DASHBOARD_QUERY)

  const dashboard = data?.dashboard

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {viewer.firstName}</h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your content.
          </p>
        </div>
        <Button asChild>
          <Link to={composerPath({})}>
            <PenSquare className="mr-2 size-4" />
            New Post
          </Link>
        </Button>
      </div>

      {error && <GraphqlError error={error} />}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Connected Channels
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{dashboard?.channels.length ?? 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{dashboard?.scheduledPosts.length ?? 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Needs Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{dashboard?.needsApprovalPosts.length ?? 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <CalendarClock className="size-4" />
              Scheduled Posts
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to={calendarPath({})}>View calendar</Link>
            </Button>
          </div>
          {loading ? (
            <SectionSkeleton />
          ) : dashboard?.scheduledPosts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No upcoming scheduled posts.{" "}
                <Link to={composerPath({})} className="underline underline-offset-2">
                  Create one
                </Link>
                .
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {dashboard?.scheduledPosts.map((post) => (
                <PostPreviewCard
                  key={post.id}
                  post={post}
                  href={composerPath({})}
                  state={{ postId: post.id }}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <CheckCircle2 className="size-4" />
              Needs Approval
            </h2>
          </div>
          {loading ? (
            <SectionSkeleton />
          ) : dashboard?.needsApprovalPosts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No posts awaiting approval.
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {dashboard?.needsApprovalPosts.map((post) => (
                <PostPreviewCard
                  key={post.id}
                  post={post}
                  href={composerPath({})}
                  state={{ postId: post.id }}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Recent Published Posts
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to={calendarPath({})}>View all</Link>
          </Button>
        </div>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : dashboard?.recentPublishedPosts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No published posts yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard?.recentPublishedPosts.map((post) => {
              const totalImpressions = post.channelVariants.reduce(
                (sum, v) => sum + (v.postAnalytic?.impressions ?? 0),
                0
              )
              const totalLikes = post.channelVariants.reduce(
                (sum, v) => sum + (v.postAnalytic?.likes ?? 0),
                0
              )
              const totalComments = post.channelVariants.reduce(
                (sum, v) => sum + (v.postAnalytic?.comments ?? 0),
                0
              )
              const firstVariant = post.channelVariants[0]
              return (
                <Link key={post.id} to={postAnalyticsPath({ postId: post.id })}>
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardDescription>
                        {post.scheduledAt
                          ? format(new Date(post.scheduledAt), "MMM d, yyyy")
                          : "Published"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <p className="line-clamp-2 text-sm">{firstVariant?.body ?? "No content"}</p>
                      <div className="flex flex-wrap gap-1">
                        {post.channelVariants.map((v) => (
                          <Badge key={v.id} variant="secondary" className="text-xs">
                            {PROVIDER_LABELS[v.channel.provider] ?? v.channel.provider}
                          </Badge>
                        ))}
                      </div>
                      {totalImpressions > 0 && (
                        <dl className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <dt className="text-muted-foreground">Impressions</dt>
                            <dd className="font-semibold">{totalImpressions.toLocaleString()}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Likes</dt>
                            <dd className="font-semibold">{totalLikes.toLocaleString()}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Comments</dt>
                            <dd className="font-semibold">{totalComments.toLocaleString()}</dd>
                          </div>
                        </dl>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
