import { useQuery } from "@apollo/client/react"
import { Hash } from "lucide-react"
import { useEffect, useState } from "react"
import { gql } from "~/__generated__"
import { GraphqlError } from "~/ui/graphql-error"

const HASHTAG_SUGGESTION_QUERY = gql(/* GraphQL */ `
  query HashtagSuggestion($content: String!) {
    hashtagSuggestion(content: $content)
  }
`)

type Props = {
  content: string
  onAddHashtag: (hashtag: string) => void
}

export const HashtagResearchTool = ({ content, onAddHashtag }: Props) => {
  const [debouncedContent, setDebouncedContent] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedContent(content.trim().length >= 10 ? content : "")
    }, 600)
    return () => clearTimeout(timer)
  }, [content])

  const { data, error } = useQuery(HASHTAG_SUGGESTION_QUERY, {
    variables: { content: debouncedContent },
    skip: !debouncedContent,
  })

  const suggestions = data?.hashtagSuggestion ?? []

  if (error) return <GraphqlError error={error} />
  if (!suggestions.length) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Hash className="h-3.5 w-3.5" />
        <span>Suggested hashtags</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((hashtag) => (
          <button
            key={hashtag}
            type="button"
            className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground hover:bg-muted transition-colors"
            onClick={() => onAddHashtag(hashtag)}
          >
            {hashtag}
          </button>
        ))}
      </div>
    </div>
  )
}
