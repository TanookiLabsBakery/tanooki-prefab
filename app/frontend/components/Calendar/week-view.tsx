import { useDroppable } from "@dnd-kit/core"
import { eachDayOfInterval, endOfWeek, format, getDay, isToday, startOfWeek } from "date-fns"
import type { PostStatus } from "~/__generated__/graphql"
import { cn } from "~/common/cn"
import { CalendarPostCard, type CalendarPost } from "~/components/Calendar/calendar-post-card"

const START_HOUR = 6
const END_HOUR = 22
const TOTAL_SLOTS = (END_HOUR - START_HOUR) * 2

const getSlotIndex = (scheduledAt: string): number | null => {
  const date = new Date(scheduledAt)
  const hour = date.getHours()
  const minute = date.getMinutes()
  if (hour < START_HOUR || hour >= END_HOUR) return null
  return (hour - START_HOUR) * 2 + (minute >= 30 ? 1 : 0)
}

const formatSlotLabel = (slotIndex: number): string => {
  const hour = START_HOUR + Math.floor(slotIndex / 2)
  const isHalfHour = slotIndex % 2 === 1
  if (isHalfHour) return ":30"
  if (hour === 12) return "12pm"
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`
}

const formatTimeLabel = (scheduledAt: string): string => {
  const date = new Date(scheduledAt)
  const hour = date.getHours()
  const minute = date.getMinutes()
  const period = hour < 12 ? "am" : "pm"
  const displayHour = hour % 12 || 12
  return minute === 0
    ? `${displayHour}${period}`
    : `${displayHour}:${String(minute).padStart(2, "0")}${period}`
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

type DroppableWeekSlotProps = {
  day: Date
  dayKey: string
  dayIndex: number
  slotIndex: number
  slotPosts: CalendarPost[]
  loading?: boolean
  onPostClick?: (postId: string, status: PostStatus) => void
}

const DroppableWeekSlot = ({
  dayKey,
  dayIndex,
  slotIndex,
  slotPosts,
  loading,
  onPostClick,
}: DroppableWeekSlotProps) => {
  const hour = START_HOUR + Math.floor(slotIndex / 2)
  const minute = slotIndex % 2 === 1 ? 30 : 0

  const { setNodeRef, isOver } = useDroppable({
    id: `week-${dayKey}-slot-${slotIndex}`,
    data: { date: dayKey, slotIndex, hour, minute },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 p-0.5 flex flex-col gap-0.5 transition-colors",
        dayIndex < 6 && "border-r border-border",
        isOver && "bg-primary/5"
      )}
    >
      {loading && slotIndex === 0 && dayIndex === 0 && (
        <div className="h-4 rounded bg-muted/60 animate-pulse w-full" />
      )}
      {slotPosts.map((post) => (
        <CalendarPostCard
          key={post.id}
          post={post}
          onClick={() => onPostClick?.(post.id, post.status)}
          timeLabel={post.scheduledAt ? formatTimeLabel(post.scheduledAt) : undefined}
        />
      ))}
    </div>
  )
}

type Props = {
  weekStart: Date
  posts: CalendarPost[]
  onPostClick?: (postId: string, status: PostStatus) => void
  loading?: boolean
}

export const WeekView = ({ weekStart, posts, onPostClick, loading }: Props) => {
  const days = eachDayOfInterval({
    start: startOfWeek(weekStart, { weekStartsOn: 0 }),
    end: endOfWeek(weekStart, { weekStartsOn: 0 }),
  })

  const postSlotMap: Record<string, Record<number, CalendarPost[]>> = {}

  for (const post of posts) {
    if (!post.scheduledAt) continue
    const dayKey = format(new Date(post.scheduledAt), "yyyy-MM-dd")
    const slotIndex = getSlotIndex(post.scheduledAt)
    if (slotIndex === null) continue
    if (!postSlotMap[dayKey]) postSlotMap[dayKey] = {}
    if (!postSlotMap[dayKey][slotIndex]) postSlotMap[dayKey][slotIndex] = []
    postSlotMap[dayKey][slotIndex].push(post)
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="flex border-b border-border bg-muted/40 sticky top-0 z-10">
        <div className="w-14 shrink-0" />
        {days.map((day, i) => {
          const isCurrentDay = isToday(day)
          return (
            <div
              key={i}
              className={cn("flex-1 py-2 text-center", i < 6 && "border-r border-border")}
            >
              <div
                className={cn(
                  "text-xs font-medium uppercase tracking-wide",
                  isCurrentDay ? "text-primary" : "text-muted-foreground"
                )}
              >
                {WEEKDAY_LABELS[getDay(day)]}
              </div>
              <div
                className={cn(
                  "mx-auto mt-0.5 flex size-6 items-center justify-center rounded-full text-sm font-semibold",
                  isCurrentDay ? "bg-primary text-primary-foreground" : "text-foreground"
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          )
        })}
      </div>

      <div className="overflow-y-auto max-h-[600px]">
        {Array.from({ length: TOTAL_SLOTS }, (_, slotIndex) => {
          const label = formatSlotLabel(slotIndex)
          const isHalfHour = slotIndex % 2 === 1

          return (
            <div
              key={slotIndex}
              className={cn(
                "flex min-h-12",
                isHalfHour ? "border-b border-dashed border-border/50" : "border-b border-border"
              )}
            >
              <div
                className={cn(
                  "w-14 shrink-0 border-r border-border text-right pr-2 text-xs",
                  "text-muted-foreground flex items-start justify-end pt-1"
                )}
              >
                {label}
              </div>
              {days.map((day, dayIndex) => {
                const dayKey = format(day, "yyyy-MM-dd")
                const slotPosts = postSlotMap[dayKey]?.[slotIndex] ?? []

                return (
                  <DroppableWeekSlot
                    key={dayIndex}
                    day={day}
                    dayKey={dayKey}
                    dayIndex={dayIndex}
                    slotIndex={slotIndex}
                    slotPosts={slotPosts}
                    loading={loading}
                    onPostClick={onPostClick}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
