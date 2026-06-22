import { useQuery } from "@apollo/client/react"
import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react"
import { useEffect, useState } from "react"
import { gql } from "~/__generated__"
import { GraphqlError } from "~/ui/graphql-error"

const LINT_POST_QUERY = gql(/* GraphQL */ `
  query LintPost($content: String!) {
    lintPost(content: $content) {
      compliant
      issues
      suggestions
    }
  }
`)

type Props = {
  content: string
  hasGuidelines: boolean
}

export const BrandVoiceLinter = ({ content, hasGuidelines }: Props) => {
  const [debouncedContent, setDebouncedContent] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content.trim().length < 20 || !hasGuidelines) {
        setDebouncedContent("")
      } else {
        setDebouncedContent(content)
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [content, hasGuidelines])

  const { data, loading, error } = useQuery(LINT_POST_QUERY, {
    variables: { content: debouncedContent },
    skip: !debouncedContent,
  })

  if (error) return <GraphqlError error={error} />
  if (!debouncedContent || !data) return null

  const result = data.lintPost

  if (result.compliant) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-500">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
        <span>Aligns with your brand voice</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-500">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        <span>Brand voice feedback</span>
        {loading && <span className="ml-auto text-muted-foreground font-normal">Checking…</span>}
      </div>

      {result.issues.length > 0 && (
        <ul className="flex flex-col gap-1">
          {result.issues.map((issue, i) => (
            <li key={i} className="text-xs text-amber-700 dark:text-amber-400">
              {issue}
            </li>
          ))}
        </ul>
      )}

      {result.suggestions.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Lightbulb className="h-3 w-3 shrink-0" />
            <span>Suggestions</span>
          </div>
          <ul className="flex flex-col gap-1">
            {result.suggestions.map((suggestion, i) => (
              <li key={i} className="text-xs text-foreground">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
