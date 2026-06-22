import { useMutation } from "@apollo/client/react"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { gql } from "~/__generated__"
import type { PostStatus } from "~/__generated__/graphql"
import { composerPath, postAnalyticsPath } from "~/common/paths"
import { useDocumentTitle } from "~/common/use-document-title"
import { Calendar } from "~/components/Calendar/Calendar"

const POST_RESCHEDULE_MUTATION = gql(/* GraphQL */ `
  mutation PostReschedule($input: PostRescheduleInput!) {
    postReschedule(input: $input) {
      post {
        id
        scheduledAt
      }
    }
  }
`)

export const CalendarScreen = () => {
  useDocumentTitle("Content Calendar")
  const navigate = useNavigate()
  const [reschedule] = useMutation(POST_RESCHEDULE_MUTATION, { onError: () => null })

  const handlePostClick = (postId: string, status: PostStatus) => {
    if (status === "PUBLISHED") {
      navigate(postAnalyticsPath({ postId }))
    } else {
      navigate(composerPath({}), { state: { postId } })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const postId = active.data.current?.postId as string | undefined
    const originalScheduledAt = active.data.current?.scheduledAt as string | null | undefined
    const overData = over.data.current as
      | { date: string; hour?: number; minute?: number }
      | undefined

    if (!postId || !overData) return

    const year = Number(overData.date.slice(0, 4))
    const month = Number(overData.date.slice(5, 7))
    const day = Number(overData.date.slice(8, 10))

    let newScheduledAt: string

    if (overData.hour !== undefined && overData.minute !== undefined) {
      newScheduledAt = new Date(
        year,
        month - 1,
        day,
        overData.hour,
        overData.minute,
        0,
        0
      ).toISOString()
    } else if (originalScheduledAt) {
      const orig = new Date(originalScheduledAt)
      newScheduledAt = new Date(
        year,
        month - 1,
        day,
        orig.getHours(),
        orig.getMinutes(),
        0,
        0
      ).toISOString()
    } else {
      newScheduledAt = new Date(year, month - 1, day, 12, 0, 0, 0).toISOString()
    }

    void reschedule({
      variables: { input: { postId, scheduledAt: newScheduledAt } },
      optimisticResponse: {
        postReschedule: {
          __typename: "PostReschedulePayload",
          post: {
            __typename: "Post",
            id: postId,
            scheduledAt: newScheduledAt,
          },
        },
      },
      onError: (error) => {
        toast.error("Failed to reschedule post", { description: error.message })
      },
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Content Calendar</h1>
        <p className="text-muted-foreground">View and manage your scheduled and published posts.</p>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <Calendar onPostClick={handlePostClick} />
      </DndContext>
    </div>
  )
}
