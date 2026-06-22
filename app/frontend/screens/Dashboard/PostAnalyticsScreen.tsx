import { useQuery } from "@apollo/client/react"
import { format } from "date-fns"
import { Activity, Heart, MessageCircle, Repeat2, Share2 } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { gql } from "~/__generated__"
import { calendarPath } from "~/common/paths"
import { useDocumentTitle } from "~/common/use-document-title"
import { EngagementChart } from "~/components/Analytics/EngagementChart"
import { StatsCard } from "~/components/Analytics/StatsCard"
import { Badge } from "~/ui/badge"
import { Button } from "~/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card"
import { GraphqlError } from "~/ui/graphql-error"
import { Skeleton } from "~/ui/skeleton"

const POST_ANALYTICS_QUERY = gql(/* GraphQL */ `
  query PostAnalytics($id: ID!) {
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
        postAnalytic {
          id
          impressions
          likes
          comments
          shares
          reposts
          fetchedAt
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

const METRIC_COLORS = {
  impressions: "hsl(var(--primary))",
  likes: "hsl(var(--destructive))",
  comments: "hsl(var(--secondary))",
  shares: "#10b981",
  reposts: "#8b5cf6",
}

export const PostAnalyticsScreen = () => {
  useDocumentTitle("Post Analytics")

  const { postId } = useParams<{ postId: string }>()

  const { data, loading, error } = useQuery(POST_ANALYTICS_QUERY, {
    variables: { id: postId ?? "" },
    skip: !postId,
  })

  const post = data?.post

  const variantsWithAnalytics = post?.channelVariants.filter((v) => v.postAnalytic) ?? []

  const totalImpressions = variantsWithAnalytics.reduce(
    (sum, v) => sum + (v.postAnalytic?.impressions ?? 0),
    0
  )
  const totalLikes = variantsWithAnalytics.reduce((sum, v) => sum + (v.postAnalytic?.likes ?? 0), 0)
  const totalComments = variantsWithAnalytics.reduce(
    (sum, v) => sum + (v.postAnalytic?.comments ?? 0),
    0
  )
  const totalShares = variantsWithAnalytics.reduce(
    (sum, v) => sum + (v.postAnalytic?.shares ?? 0),
    0
  )
  const totalReposts = variantsWithAnalytics.reduce(
    (sum, v) => sum + (v.postAnalytic?.reposts ?? 0),
    0
  )

  const channelNames = variantsWithAnalytics.map((v) => v.channel.name)
  const hasDuplicateNames = channelNames.length !== new Set(channelNames).size
  const channelLabel = (v: (typeof variantsWithAnalytics)[0]) =>
    hasDuplicateNames
      ? `${v.channel.name} (${PROVIDER_LABELS[v.channel.provider] ?? v.channel.provider})`
      : v.channel.name

  const chartData = variantsWithAnalytics.flatMap((v) => [
    {
      name: `${channelLabel(v)} Likes`,
      value: v.postAnalytic?.likes ?? 0,
      color: METRIC_COLORS.likes,
    },
    {
      name: `${channelLabel(v)} Comments`,
      value: v.postAnalytic?.comments ?? 0,
      color: METRIC_COLORS.comments,
    },
    {
      name: `${channelLabel(v)} Reposts`,
      value: v.postAnalytic?.reposts ?? 0,
      color: METRIC_COLORS.reposts,
    },
  ])

  const lastFetched = variantsWithAnalytics
    .map((v) => v.postAnalytic?.fetchedAt)
    .filter(Boolean)
    .sort()
    .at(-1)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Post Analytics</h1>
          <p className="text-muted-foreground">
            Engagement metrics for this post across all channels.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to={calendarPath({})}>Back to Calendar</Link>
        </Button>
      </div>

      {error && <GraphqlError error={error} />}

      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      )}

      {!loading && post && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base">Post Overview</CardTitle>
                  <CardDescription>
                    {post.scheduledAt
                      ? `Published ${format(new Date(post.scheduledAt), "PPP 'at' p")}`
                      : "No scheduled date"}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{post.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {post.channelVariants[0]?.body ?? "No content"}
              </p>
              {lastFetched && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Analytics last updated: {format(new Date(lastFetched), "PPP 'at' p")}
                </p>
              )}
            </CardContent>
          </Card>

          {variantsWithAnalytics.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No analytics data available yet. Analytics are collected after publishing.
              </CardContent>
            </Card>
          ) : (
            <>
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Total Engagement
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                  <StatsCard
                    label="Impressions"
                    value={totalImpressions}
                    icon={<Activity className="size-4" />}
                  />
                  <StatsCard label="Likes" value={totalLikes} icon={<Heart className="size-4" />} />
                  <StatsCard
                    label="Comments"
                    value={totalComments}
                    icon={<MessageCircle className="size-4" />}
                  />
                  <StatsCard
                    label="Shares"
                    value={totalShares}
                    icon={<Share2 className="size-4" />}
                  />
                  <StatsCard
                    label="Reposts"
                    value={totalReposts}
                    icon={<Repeat2 className="size-4" />}
                  />
                </div>
              </div>

              {chartData.length > 0 && (
                <EngagementChart data={chartData} title="Engagement by Channel & Metric" />
              )}

              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  By Channel
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {variantsWithAnalytics.map((variant) => {
                    const analytic = variant.postAnalytic!
                    return (
                      <Card key={variant.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{variant.channel.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {PROVIDER_LABELS[variant.channel.provider] ?? variant.channel.provider}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div>
                              <dt className="text-muted-foreground">Impressions</dt>
                              <dd className="font-semibold">
                                {analytic.impressions.toLocaleString()}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Likes</dt>
                              <dd className="font-semibold">{analytic.likes.toLocaleString()}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Comments</dt>
                              <dd className="font-semibold">
                                {analytic.comments.toLocaleString()}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Shares</dt>
                              <dd className="font-semibold">{analytic.shares.toLocaleString()}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Reposts</dt>
                              <dd className="font-semibold">{analytic.reposts.toLocaleString()}</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
