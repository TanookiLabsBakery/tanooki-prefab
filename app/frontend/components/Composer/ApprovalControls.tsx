import { useMutation, useQuery } from "@apollo/client/react"
import { CheckCircle, Clock, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { gql } from "~/__generated__"
import { PostStatus } from "~/__generated__/graphql"
import { cn } from "~/common/cn"
import { Badge } from "~/ui/badge"
import { Button } from "~/ui/button"
import { GraphqlError } from "~/ui/graphql-error"

const APPROVAL_STATUS_QUERY = gql(/* GraphQL */ `
  query PostApprovalStatus($id: ID!) {
    node(id: $id) {
      ... on Post {
        id
        status
        viewerCanApprove
        viewerCanRequestApproval
        viewerCanRepurpose
      }
    }
  }
`)

const POST_REQUEST_APPROVAL_MUTATION = gql(/* GraphQL */ `
  mutation PostRequestApproval($input: PostRequestApprovalInput!) {
    postRequestApproval(input: $input) {
      post {
        id
        status
        viewerCanApprove
        viewerCanRequestApproval
      }
    }
  }
`)

const POST_APPROVE_MUTATION = gql(/* GraphQL */ `
  mutation PostApprove($input: PostApproveInput!) {
    postApprove(input: $input) {
      post {
        id
        status
        viewerCanApprove
        viewerCanRequestApproval
      }
    }
  }
`)

const POST_REPURPOSE_MUTATION = gql(/* GraphQL */ `
  mutation PostRepurpose($input: PostRepurposeInput!) {
    postRepurpose(input: $input) {
      post {
        id
        status
      }
    }
  }
`)

const STATUS_LABELS: Record<PostStatus, string> = {
  DRAFT: "Draft",
  NEEDS_APPROVAL: "Needs Approval",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  ERROR: "Error",
}

const STATUS_VARIANTS: Record<PostStatus, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  NEEDS_APPROVAL: "outline",
  SCHEDULED: "default",
  PUBLISHED: "default",
  ERROR: "destructive",
}

type Props = {
  postId: string
}

export const ApprovalControls = ({ postId }: Props) => {
  const {
    data,
    loading,
    error: queryError,
  } = useQuery(APPROVAL_STATUS_QUERY, {
    variables: { id: postId },
  })

  const [requestApproval, { loading: requesting, error: requestError }] = useMutation(
    POST_REQUEST_APPROVAL_MUTATION,
    {
      onError: () => null,
      onCompleted: () => {
        toast.success("Approval requested", {
          description: "Your post has been submitted for review.",
        })
      },
    }
  )

  const [approvePost, { loading: approving, error: approveError }] = useMutation(
    POST_APPROVE_MUTATION,
    {
      onError: () => null,
      onCompleted: () => {
        toast.success("Post approved", {
          description: "The post has been approved and is ready to publish.",
        })
      },
    }
  )

  const [repurposePost, { loading: repurposing, error: repurposeError }] = useMutation(
    POST_REPURPOSE_MUTATION,
    {
      onError: () => null,
      onCompleted: () => {
        toast.success("Repurposing started", {
          description: "AI is generating channel-optimized variants in the background.",
        })
      },
    }
  )

  if (queryError) return <GraphqlError error={queryError} />

  if (loading || !data?.node || data.node.__typename !== "Post") return null

  const post = data.node
  const status = post.status

  const handleRequestApproval = () => {
    requestApproval({ variables: { input: { postId } } })
  }

  const handleApprove = () => {
    approvePost({ variables: { input: { postId } } })
  }

  const handleRepurpose = () => {
    repurposePost({ variables: { input: { postId } } })
  }

  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-4 py-3">
      <div className="flex items-center gap-2">
        {status === "NEEDS_APPROVAL" ? (
          <Clock className="h-4 w-4 text-muted-foreground" />
        ) : (
          <CheckCircle
            className={cn("h-4 w-4", status === "DRAFT" ? "text-muted-foreground" : "text-primary")}
          />
        )}
        <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
      </div>

      <div className="flex items-center gap-2">
        {requestError && <GraphqlError error={requestError} />}
        {approveError && <GraphqlError error={approveError} />}
        {repurposeError && <GraphqlError error={repurposeError} />}

        {post.viewerCanRepurpose && (
          <Button variant="outline" size="sm" onClick={handleRepurpose} disabled={repurposing}>
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            {repurposing ? "Repurposing…" : "Repurpose with AI"}
          </Button>
        )}

        {post.viewerCanRequestApproval && (
          <Button variant="outline" size="sm" onClick={handleRequestApproval} disabled={requesting}>
            {requesting ? "Requesting…" : "Request Approval"}
          </Button>
        )}

        {post.viewerCanApprove && (
          <Button size="sm" onClick={handleApprove} disabled={approving}>
            {approving ? "Approving…" : "Approve"}
          </Button>
        )}
      </div>
    </div>
  )
}
