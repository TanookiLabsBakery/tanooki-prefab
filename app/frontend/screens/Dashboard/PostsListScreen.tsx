import { useQuery } from "@apollo/client/react"
import { format } from "date-fns"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { gql } from "~/__generated__"
import type { PostStatus } from "~/__generated__/graphql"
import { composerPath, postAnalyticsPath } from "~/common/paths"
import { useDocumentTitle } from "~/common/use-document-title"
import { Badge } from "~/ui/badge"
import { Button } from "~/ui/button"
import { GraphqlError } from "~/ui/graphql-error"
import { Skeleton } from "~/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/ui/table"
import { Tabs, TabsList, TabsTrigger } from "~/ui/tabs"

const POSTS_QUERY = gql(/* GraphQL */ `
  query Posts($first: Int, $after: String, $status: PostStatus) {
    posts(first: $first, after: $after, status: $status) {
      edges {
        node {
          id
          status
          scheduledAt
          createdAt
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
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`)

const PAGE_SIZE = 20

type StatusFilter = "ALL" | PostStatus

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Draft", value: "DRAFT" },
  { label: "Needs Approval", value: "NEEDS_APPROVAL" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Error", value: "ERROR" },
]

const STATUS_BADGE_VARIANTS: Record<
  PostStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "secondary",
  NEEDS_APPROVAL: "outline",
  SCHEDULED: "default",
  PUBLISHED: "default",
  ERROR: "destructive",
}

const STATUS_LABELS: Record<PostStatus, string> = {
  DRAFT: "Draft",
  NEEDS_APPROVAL: "Needs Approval",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  ERROR: "Error",
}

export const PostsListScreen = () => {
  useDocumentTitle("All Posts")

  const [activeTab, setActiveTab] = useState<StatusFilter>("ALL")

  const statusVariable = activeTab === "ALL" ? undefined : activeTab

  const { data, loading, error, fetchMore } = useQuery(POSTS_QUERY, {
    variables: { first: PAGE_SIZE, status: statusVariable },
    notifyOnNetworkStatusChange: true,
  })

  const edges = data?.posts.edges ?? []
  const pageInfo = data?.posts.pageInfo

  const handleTabChange = (value: string) => {
    setActiveTab(value as StatusFilter)
  }

  const handleLoadMore = () => {
    if (!pageInfo?.endCursor) return
    fetchMore({
      variables: {
        first: PAGE_SIZE,
        after: pageInfo.endCursor,
        status: statusVariable,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        return {
          posts: {
            ...fetchMoreResult.posts,
            edges: [...prev.posts.edges, ...fetchMoreResult.posts.edges],
          },
        }
      },
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Posts</h1>
          <p className="text-muted-foreground">Manage and review all your posts.</p>
        </div>
        <Button asChild>
          <Link to={composerPath({})}>
            <PlusCircle className="mr-2 size-4" />
            New Post
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {error && <GraphqlError error={error} />}

      {loading && edges.length === 0 ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : (
        <>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Channels</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {edges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                      No posts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  edges.map(({ node: post }) => {
                    if (!post) return null
                    const previewBody = post.channelVariants[0]?.body
                    const channelNames = post.channelVariants
                      .map((v) => v.channel.name)
                      .filter((name, i, arr) => arr.indexOf(name) === i)

                    return (
                      <TableRow key={post.id}>
                        <TableCell className="max-w-xs">
                          <p className="truncate text-sm">
                            {previewBody ?? (
                              <span className="text-muted-foreground italic">No content</span>
                            )}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={STATUS_BADGE_VARIANTS[post.status]}>
                            {STATUS_LABELS[post.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {channelNames.length > 0 ? channelNames.join(", ") : "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {post.scheduledAt
                              ? format(new Date(post.scheduledAt), "MMM d, yyyy")
                              : "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(post.createdAt), "MMM d, yyyy")}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {post.status === "PUBLISHED" && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={postAnalyticsPath({ postId: post.id })}>Analytics</Link>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {pageInfo?.hasNextPage && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
