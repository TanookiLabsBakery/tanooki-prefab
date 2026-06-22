import { useQuery } from "@apollo/client/react"
import { format } from "date-fns"
import { Activity, Heart, TrendingUp } from "lucide-react"
import { gql } from "~/__generated__"
import { useDocumentTitle } from "~/common/use-document-title"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card"
import { GraphqlError } from "~/ui/graphql-error"
import { Skeleton } from "~/ui/skeleton"

const CHANNEL_ANALYTICS_QUERY = gql(/* GraphQL */ `
  query ChannelAnalytics {
    channelAnalytics {
      channel {
        id
        name
        provider
      }
      impressions
      likes
      engagementRate
      topPosts {
        id
        scheduledAt
        channelVariants {
          id
          body
          channel {
            id
          }
          postAnalytic {
            id
            impressions
            likes
          }
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

export const AnalyticsScreen = () => {
  useDocumentTitle("Analytics")

  const { data, loading, error } = useQuery(CHANNEL_ANALYTICS_QUERY)

  const channelAnalytics = data?.channelAnalytics ?? []

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Channel Analytics</h1>
        <p className="text-muted-foreground">
          Performance metrics for your connected channels over the last 30 days.
        </p>
      </div>

      {error && <GraphqlError error={error} />}

      {loading && (
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      )}

      {!loading && !error && channelAnalytics.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No analytics data available. Connect a channel and publish posts to see analytics.
          </CardContent>
        </Card>
      )}

      {!loading && channelAnalytics.length > 0 && (
        <div className="grid gap-6">
          {channelAnalytics.map((analytics) => {
            const channel = analytics.channel
            const topPostsWithVariants = analytics.topPosts.map((post) => ({
              ...post,
              channelVariant: post.channelVariants.find((v) => v.channel.id === channel.id),
            }))

            return (
              <Card key={channel.id}>
                <CardHeader>
                  <CardTitle>{channel.name}</CardTitle>
                  <CardDescription>
                    {PROVIDER_LABELS[channel.provider] ?? channel.provider}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                        <Activity className="size-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {analytics.impressions.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Likes</CardTitle>
                        <Heart className="size-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.likes.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                        <TrendingUp className="size-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {analytics.engagementRate.toFixed(2)}%
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {topPostsWithVariants.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Top Posts
                      </h3>
                      <div className="space-y-3">
                        {topPostsWithVariants.map((post) => {
                          const variant = post.channelVariant
                          const analytic = variant?.postAnalytic
                          return (
                            <div
                              key={post.id}
                              className="rounded-lg border border-border p-3 text-sm"
                            >
                              <p className="line-clamp-2 text-foreground">
                                {variant?.body ?? "No content"}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                {post.scheduledAt && (
                                  <span>{format(new Date(post.scheduledAt), "MMM d, yyyy")}</span>
                                )}
                                {analytic && (
                                  <>
                                    <span>{analytic.impressions.toLocaleString()} impressions</span>
                                    <span>{analytic.likes.toLocaleString()} likes</span>
                                  </>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
