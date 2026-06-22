import { useQuery } from "@apollo/client/react"
import { useDroppable } from "@dnd-kit/core"
import {
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { gql } from "~/__generated__"
import type { PostStatus } from "~/__generated__/graphql"
import { cn } from "~/common/cn"
import { CalendarPostCard, type CalendarPost } from "~/components/Calendar/calendar-post-card"
import { WeekView } from "~/components/Calendar/week-view"
import { GraphqlError } from "~/ui/graphql-error"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/ui/tabs"

const CALENDAR_POSTS_QUERY = gql(/* GraphQL */ `
  query CalendarPosts($startDate: ISO8601Date!, $endDate: ISO8601Date!) {
    calendarPosts(startDate: $startDate, endDate: $endDate) {
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

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

type DroppableMonthCellProps = {
  day: Date
  dayKey: string
  isCurrentMonth: boolean
  isCurrentDay: boolean
  isLastRow: boolean
  isLastCol: boolean
  dayPosts: CalendarPost[]
  loading: boolean
  index: number
  onPostClick?: (postId: string, status: PostStatus) => void
}

const DroppableMonthCell = ({
  day,
  dayKey,
  isCurrentMonth,
  isCurrentDay,
  isLastRow,
  isLastCol,
  dayPosts,
  loading,
  index,
  onPostClick,
}: DroppableMonthCellProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `month-${dayKey}`,
    data: { date: dayKey },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-28 p-1.5 flex flex-col gap-1 transition-colors",
        !isLastRow && "border-b border-border",
        !isLastCol && "border-r border-border",
        !isCurrentMonth && "bg-muted/20",
        isOver && "bg-primary/5"
      )}
    >
      <span
        className={cn(
          "text-sm font-medium self-start flex size-6 items-center justify-center rounded-full",
          isCurrentDay
            ? "bg-primary text-primary-foreground"
            : isCurrentMonth
              ? "text-foreground"
              : "text-muted-foreground"
        )}
      >
        {format(day, "d")}
      </span>

      {loading && dayPosts.length === 0 && index < 7 && (
        <div className="h-5 rounded bg-muted/60 animate-pulse w-full" />
      )}

      {dayPosts.map((post) => (
        <CalendarPostCard
          key={post.id}
          post={post}
          onClick={() => onPostClick?.(post.id, post.status)}
        />
      ))}
    </div>
  )
}

type View = "month" | "week"

type Props = {
  onPostClick?: (postId: string, status: PostStatus) => void
}

export const Calendar = ({ onPostClick }: Props) => {
  const [view, setView] = useState<View>("month")
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()))
  const [currentWeek, setCurrentWeek] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 })

  const startDate = format(view === "month" ? monthStart : weekStart, "yyyy-MM-dd")
  const endDate = format(view === "month" ? monthEnd : weekEnd, "yyyy-MM-dd")

  const { data, loading, error } = useQuery(CALENDAR_POSTS_QUERY, {
    variables: { startDate, endDate },
  })

  const posts = data?.calendarPosts ?? []

  const goToPrev = () => {
    if (view === "month") {
      setCurrentMonth((m) => startOfMonth(subMonths(m, 1)))
    } else {
      setCurrentWeek((w) => subWeeks(w, 1))
    }
  }

  const goToNext = () => {
    if (view === "month") {
      setCurrentMonth((m) => startOfMonth(addMonths(m, 1)))
    } else {
      setCurrentWeek((w) => addWeeks(w, 1))
    }
  }

  const goToToday = () => {
    setCurrentMonth(startOfMonth(new Date()))
    setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 0 }))
  }

  const titleLabel =
    view === "month"
      ? format(currentMonth, "MMMM yyyy")
      : weekStart.getMonth() === weekEnd.getMonth()
        ? `${format(weekStart, "MMM d")} – ${format(weekEnd, "d, yyyy")}`
        : `${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d, yyyy")}`

  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  type PostItem = (typeof posts)[number]
  const postsByDay = posts.reduce<Record<string, PostItem[]>>((acc, post) => {
    if (!post.scheduledAt) return acc
    const dayKey = format(new Date(post.scheduledAt), "yyyy-MM-dd")
    if (!acc[dayKey]) acc[dayKey] = []
    acc[dayKey].push(post)
    return acc
  }, {})

  return (
    <Tabs value={view} onValueChange={(v) => setView(v as View)} className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">{titleLabel}</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrev}
              className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-muted transition-colors"
              aria-label={view === "month" ? "Previous month" : "Previous week"}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 h-8 text-sm rounded-md border border-border hover:bg-muted transition-colors"
            >
              Today
            </button>
            <button
              onClick={goToNext}
              className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-muted transition-colors"
              aria-label={view === "month" ? "Next month" : "Next week"}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <TabsList>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
        </TabsList>
      </div>

      {error && <GraphqlError error={error} />}

      <TabsContent value="month" className="mt-0">
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border bg-muted/40">
            {WEEKDAY_LABELS.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const dayKey = format(day, "yyyy-MM-dd")
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
              const isCurrentDay = isToday(day)
              const dayPosts = postsByDay[dayKey] ?? []
              const isLastRow = index >= days.length - 7
              const dayOfWeek = getDay(day)
              const isLastCol = dayOfWeek === 6

              return (
                <DroppableMonthCell
                  key={dayKey}
                  day={day}
                  dayKey={dayKey}
                  isCurrentMonth={isCurrentMonth}
                  isCurrentDay={isCurrentDay}
                  isLastRow={isLastRow}
                  isLastCol={isLastCol}
                  dayPosts={dayPosts}
                  loading={loading}
                  index={index}
                  onPostClick={onPostClick}
                />
              )
            })}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="week" className="mt-0">
        <WeekView
          weekStart={currentWeek}
          posts={posts}
          onPostClick={onPostClick}
          loading={loading}
        />
      </TabsContent>
    </Tabs>
  )
}
