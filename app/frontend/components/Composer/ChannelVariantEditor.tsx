import { ChannelProvider } from "~/__generated__/graphql"
import { Label } from "~/ui/label"
import { Textarea } from "~/ui/textarea"

type Props = {
  channelId: string
  channelName: string
  provider: ChannelProvider
  body: string
  onChange: (channelId: string, body: string) => void
}

const PROVIDER_LABELS: Record<ChannelProvider, string> = {
  BLUESKY: "Bluesky",
  MASTODON: "Mastodon",
  THREADS: "Threads",
}

const CHARACTER_LIMITS: Record<ChannelProvider, number> = {
  BLUESKY: 300,
  MASTODON: 500,
  THREADS: 500,
}

export const ChannelVariantEditor = ({
  channelId,
  channelName,
  provider,
  body,
  onChange,
}: Props) => {
  const limit = CHARACTER_LIMITS[provider]
  const remaining = limit - body.length

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={`variant-${channelId}`}>
          {channelName}{" "}
          <span className="text-xs font-normal text-muted-foreground">
            ({PROVIDER_LABELS[provider]})
          </span>
        </Label>
        <span className={`text-xs ${remaining < 0 ? "text-destructive" : "text-muted-foreground"}`}>
          {remaining} remaining
        </span>
      </div>
      <Textarea
        id={`variant-${channelId}`}
        value={body}
        onChange={(e) => onChange(channelId, e.target.value)}
        placeholder={`Write your ${PROVIDER_LABELS[provider]} post…`}
        className="min-h-[120px] resize-none"
      />
    </div>
  )
}
