import { useDraggable } from "@dnd-kit/core"
import { AlertCircle, CheckCircle2, Clock, Clock3, FileText } from "lucide-react"
import type { PostStatus } from "~/__generated__/graphql"
import { cn } from "~/common/cn"

const PROVIDER_BORDER_COLORS: Record<string, string> = {
  bluesky: "border-l-sky-500",
  twitter: "border-l-slate-400",
  x: "border-l-slate-400",
  instagram: "border-l-pink-500",
  facebook: "border-l-blue-600",
  linkedin: "border-l-blue-700",
  threads: "border-l-neutral-500",
}

const STATUS_BG: Record<PostStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  SCHEDULED: "bg-primary/15 text-primary",
  PUBLISHED: "bg-secondary text-secondary-foreground",
  ERROR: "bg-destructive/15 text-destructive",
  NEEDS_APPROVAL: "bg-accent text-accent-foreground",
}

const STATUS_ICONS: Record<PostStatus, React.ReactElement> = {
  DRAFT: <FileText className="size-2.5 shrink-0" />,
  SCHEDULED: <Clock className="size-2.5 shrink-0" />,
  PUBLISHED: <CheckCircle2 className="size-2.5 shrink-0" />,
  ERROR: <AlertCircle className="size-2.5 shrink-0" />,
  NEEDS_APPROVAL: <Clock3 className="size-2.5 shrink-0" />,
}

export const STATUS_LABELS: Record<PostStatus, string> = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  ERROR: "Error",
  NEEDS_APPROVAL: "Needs Approval",
}

export type CalendarPost = {
  id: string
  status: PostStatus
  scheduledAt?: string | null
  channelVariants: Array<{
    id: string
    body?: string | null
    channel: {
      id: string
      name: string
      provider: string
    }
  }>
}

type Props = {
  post: CalendarPost
  onClick?: () => void
  timeLabel?: string
}

export const CalendarPostCard = ({ post, onClick, timeLabel }: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: post.id,
    data: { postId: post.id, scheduledAt: post.scheduledAt },
  })

  const provider = (post.channelVariants[0]?.channel?.provider ?? "").toLowerCase()
  const providerBorder = PROVIDER_BORDER_COLORS[provider] ?? "border-l-border"
  const bodyText = post.channelVariants[0]?.body
  const preview = bodyText
    ? bodyText.slice(0, 40) + (bodyText.length > 40 ? "…" : "")
    : STATUS_LABELS[post.status]

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <button
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      {...listeners}
      {...attributes}
      className={cn(
        "w-full text-left text-xs rounded px-1.5 py-0.5",
        "border-l-2 flex items-center gap-1",
        "hover:opacity-80 transition-opacity cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 z-50 relative",
        STATUS_BG[post.status],
        providerBorder
      )}
      title={`${STATUS_LABELS[post.status]}: ${preview}`}
    >
      {STATUS_ICONS[post.status]}
      {timeLabel && <span className="shrink-0 opacity-70">{timeLabel}</span>}
      <span className="truncate">{preview}</span>
    </button>
  )
}
