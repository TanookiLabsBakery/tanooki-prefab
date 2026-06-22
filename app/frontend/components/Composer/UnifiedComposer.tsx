import { useMutation, useQuery } from "@apollo/client/react"
import { format } from "date-fns"
import { ImageIcon, Link, Loader2, Sparkles, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { gql } from "~/__generated__"
import { MediaAssetItem, MediaLibrary } from "~/components/MediaLibrary/MediaLibrary"
import { Button } from "~/ui/button"
import { GraphqlError } from "~/ui/graphql-error"
import { Input } from "~/ui/input"
import { Label } from "~/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/ui/tabs"
import { Textarea } from "~/ui/textarea"
import { ApprovalControls } from "./ApprovalControls"
import { BestTimeSuggestion } from "./BestTimeSuggestion"
import { BrandVoiceLinter } from "./BrandVoiceLinter"
import { ChannelVariantEditor } from "./ChannelVariantEditor"
import { HashtagResearchTool } from "./HashtagResearchTool"

const VIEWER_CHANNELS_QUERY = gql(/* GraphQL */ `
  query ViewerChannels {
    viewer {
      id
      organization {
        id
        brandVoiceGuidelines
      }
      channels {
        id
        name
        provider
      }
    }
  }
`)

const POST_CREATE_MUTATION = gql(/* GraphQL */ `
  mutation PostCreate($input: PostCreateInput!) {
    postCreate(input: $input) {
      post {
        id
        status
      }
    }
  }
`)

const POST_GENERATE_VARIANTS_MUTATION = gql(/* GraphQL */ `
  mutation PostGenerateVariants($input: PostGenerateVariantsInput!) {
    postGenerateVariants(input: $input) {
      variants {
        channelId
        body
      }
    }
  }
`)

const POST_REPURPOSE_FROM_URL_MUTATION = gql(/* GraphQL */ `
  mutation PostRepurposeFromUrl($input: PostRepurposeFromUrlInput!) {
    postRepurposeFromUrl(input: $input) {
      variants {
        channelId
        body
      }
    }
  }
`)

type VariantState = {
  body: string
  isCustomized: boolean
}

export const UnifiedComposer = () => {
  const { data, loading: channelsLoading, error: channelsError } = useQuery(VIEWER_CHANNELS_QUERY)
  const [postCreate, { loading: saving, error: saveError }] = useMutation(POST_CREATE_MUTATION, {
    onError: () => null,
  })
  const [postGenerateVariants, { loading: generatingVariants, error: generateVariantsError }] =
    useMutation(POST_GENERATE_VARIANTS_MUTATION, { onError: () => null })
  const [postRepurposeFromUrl, { loading: repurposing, error: repurposeError }] = useMutation(
    POST_REPURPOSE_FROM_URL_MUTATION,
    { onError: () => null }
  )

  const [sharedText, setSharedText] = useState("")
  const [repurposeUrl, setRepurposeUrl] = useState("")
  const [variants, setVariants] = useState<Record<string, VariantState>>({})
  const [selectedMedia, setSelectedMedia] = useState<MediaAssetItem | null>(null)
  const [createdPostId, setCreatedPostId] = useState<string | null>(null)
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null)

  const channels = data?.viewer?.channels ?? []
  const firstChannel = channels[0]

  const channelNames = channels.map((c) => c.name)
  const hasDuplicateChannelNames = channelNames.length !== new Set(channelNames).size
  const channelTabLabel = (channel: (typeof channels)[0]) =>
    hasDuplicateChannelNames
      ? `${channel.name} (${channel.provider.charAt(0) + channel.provider.slice(1).toLowerCase()})`
      : channel.name

  const getVariantBody = (channelId: string) => {
    return variants[channelId]?.body ?? sharedText
  }

  const handleSharedTextChange = (value: string) => {
    setSharedText(value)
    setVariants((prev) => {
      const updated: Record<string, VariantState> = {}
      for (const [id, state] of Object.entries(prev)) {
        updated[id] = state.isCustomized ? state : { body: value, isCustomized: false }
      }
      return updated
    })
  }

  const handleVariantChange = (channelId: string, body: string) => {
    setVariants((prev) => ({
      ...prev,
      [channelId]: { body, isCustomized: true },
    }))
  }

  const handleMediaSelect = (asset: MediaAssetItem) => {
    if (!asset.id) {
      setSelectedMedia(null)
    } else {
      setSelectedMedia(asset)
    }
  }

  const handleSaveDraft = async () => {
    if (channels.length === 0) {
      toast.error("No channels connected", {
        description: "Connect a social media channel before saving a post.",
      })
      return
    }

    const result = await postCreate({
      variables: {
        input: {
          postInput: {
            channelVariants: channels.map((channel) => ({
              channelId: channel.id,
              body: getVariantBody(channel.id),
            })),
            scheduledAt: scheduledAt?.toISOString() ?? null,
          },
        },
      },
    })

    if (result.error || !result.data) return

    const postId = result.data.postCreate.post.id
    setCreatedPostId(postId)

    const description = scheduledAt
      ? `Scheduled for ${format(scheduledAt, "EEE, MMM d 'at' h:mm a")}.`
      : "Your post has been saved as a draft."

    toast.success(scheduledAt ? "Post scheduled" : "Draft saved", { description })
  }

  const handleGenerateVariants = async () => {
    if (channels.length === 0 || !sharedText.trim()) return

    const result = await postGenerateVariants({
      variables: {
        input: {
          sharedText,
          channelIds: channels.map((c) => c.id),
        },
      },
    })

    if (result.error || !result.data) return

    const generatedVariants = result.data.postGenerateVariants.variants
    setVariants((prev) => {
      const updated: Record<string, VariantState> = { ...prev }
      for (const variant of generatedVariants) {
        updated[variant.channelId] = { body: variant.body, isCustomized: true }
      }
      return updated
    })
  }

  const handleRepurposeFromUrl = async () => {
    if (channels.length === 0 || !repurposeUrl.trim()) return

    const result = await postRepurposeFromUrl({
      variables: {
        input: {
          url: repurposeUrl.trim(),
          channelIds: channels.map((c) => c.id),
        },
      },
    })

    if (result.error || !result.data) return

    const generatedVariants = result.data.postRepurposeFromUrl.variants
    setVariants((prev) => {
      const updated: Record<string, VariantState> = { ...prev }
      for (const variant of generatedVariants) {
        updated[variant.channelId] = { body: variant.body, isCustomized: true }
      }
      return updated
    })
    toast.success("Content generated", {
      description: "Your channels have been populated with repurposed content from the URL.",
    })
  }

  const handleNewPost = () => {
    setCreatedPostId(null)
    setSharedText("")
    setVariants({})
    setSelectedMedia(null)
    setScheduledAt(null)
    setRepurposeUrl("")
  }

  if (channelsError) {
    return <GraphqlError error={channelsError} />
  }

  if (createdPostId) {
    return (
      <div className="flex flex-col gap-4">
        <ApprovalControls postId={createdPostId} />
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleNewPost}>
            Create another post
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="repurpose-url">Repurpose from URL</Label>
        <div className="flex gap-2">
          <Input
            id="repurpose-url"
            type="url"
            value={repurposeUrl}
            onChange={(e) => setRepurposeUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleRepurposeFromUrl}
            disabled={repurposing || !repurposeUrl.trim() || channels.length === 0}
          >
            {repurposing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Link className="mr-2 h-4 w-4" />
            )}
            {repurposing ? "Repurposing…" : "Repurpose"}
          </Button>
        </div>
        {repurposeError && <GraphqlError error={repurposeError} />}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="shared-content">Content</Label>
        <Textarea
          id="shared-content"
          value={sharedText}
          onChange={(e) => handleSharedTextChange(e.target.value)}
          placeholder="Write something to share across all your channels…"
          className="min-h-[140px] resize-none"
        />
        <p className="text-xs text-muted-foreground">
          This content will be used as the starting point for each channel. You can customise each
          channel below.
        </p>
        <HashtagResearchTool
          content={sharedText}
          onAddHashtag={(hashtag) => {
            const separator = sharedText && !sharedText.endsWith(" ") ? " " : ""
            handleSharedTextChange(sharedText + separator + hashtag)
          }}
        />
        <BrandVoiceLinter
          content={sharedText}
          hasGuidelines={!!data?.viewer?.organization?.brandVoiceGuidelines}
        />
        {channels.length > 0 && (
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={handleGenerateVariants}
              disabled={generatingVariants || !sharedText.trim()}
            >
              {generatingVariants ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {generatingVariants ? "Generating…" : "Generate Variants"}
            </Button>
            {generateVariantsError && <GraphqlError error={generateVariantsError} />}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Media</Label>
        {selectedMedia ? (
          <div className="relative inline-flex w-fit">
            {selectedMedia.url ? (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.filename}
                className="h-24 w-24 rounded-md object-cover border border-border"
              />
            ) : (
              <div className="h-24 w-24 rounded-md border border-border bg-muted flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <button
              type="button"
              className="absolute -right-2 -top-2 rounded-full bg-background border border-border p-0.5 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setSelectedMedia(null)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove media</span>
            </button>
          </div>
        ) : (
          <MediaLibrary onSelect={handleMediaSelect}>
            <Button variant="outline" size="sm" className="w-fit">
              <ImageIcon className="mr-2 h-4 w-4" />
              Add media
            </Button>
          </MediaLibrary>
        )}
        {selectedMedia && (
          <MediaLibrary selectedId={selectedMedia.id} onSelect={handleMediaSelect}>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 w-fit"
            >
              Change media
            </button>
          </MediaLibrary>
        )}
      </div>

      {channelsLoading && <p className="text-sm text-muted-foreground">Loading channels…</p>}

      {!channelsLoading && channels.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No channels connected. Connect a channel to enable per-channel customisation.
        </p>
      )}

      {channels.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Channel variations</p>
          <Tabs defaultValue={channels[0].id}>
            <TabsList>
              {channels.map((channel) => (
                <TabsTrigger key={channel.id} value={channel.id}>
                  {channelTabLabel(channel)}
                </TabsTrigger>
              ))}
            </TabsList>
            {channels.map((channel) => (
              <TabsContent key={channel.id} value={channel.id} className="mt-4">
                <ChannelVariantEditor
                  channelId={channel.id}
                  channelName={channel.name}
                  provider={channel.provider}
                  body={getVariantBody(channel.id)}
                  onChange={handleVariantChange}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}

      {firstChannel && (
        <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
          <BestTimeSuggestion channelId={firstChannel.id} onSelectTime={setScheduledAt} />
          {scheduledAt && (
            <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
              <span className="text-sm text-muted-foreground">
                Scheduled for{" "}
                <span className="font-medium text-foreground">
                  {format(scheduledAt, "EEE, MMM d 'at' h:mm a")}
                </span>
              </span>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setScheduledAt(null)}
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Clear scheduled time</span>
              </button>
            </div>
          )}
        </div>
      )}

      {saveError && <GraphqlError error={saveError} />}

      <div className="flex justify-end">
        <Button onClick={handleSaveDraft} disabled={saving || !sharedText.trim()}>
          {saving ? "Saving…" : scheduledAt ? "Schedule Post" : "Save Draft"}
        </Button>
      </div>
    </div>
  )
}
