import { useQuery } from "@apollo/client/react"
import { format } from "date-fns"
import { Clock } from "lucide-react"
import { gql } from "~/__generated__"
import { Button } from "~/ui/button"
import { GraphqlError } from "~/ui/graphql-error"

const BEST_TIME_SUGGESTION_QUERY = gql(/* GraphQL */ `
  query BestTimeSuggestion($channelId: ID!) {
    bestTimeSuggestion(channelId: $channelId)
  }
`)

type Props = {
  channelId: string
  onSelectTime: (time: Date) => void
}

export const BestTimeSuggestion = ({ channelId, onSelectTime }: Props) => {
  const { data, loading, error } = useQuery(BEST_TIME_SUGGESTION_QUERY, {
    variables: { channelId },
  })

  if (error) return <GraphqlError error={error} />
  if (loading || !data?.bestTimeSuggestion?.length) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>Best times to post</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.bestTimeSuggestion.map((time) => (
          <Button
            key={time}
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onSelectTime(new Date(time))}
          >
            {format(new Date(time), "EEE, MMM d 'at' h:mm a")}
          </Button>
        ))}
      </div>
    </div>
  )
}
