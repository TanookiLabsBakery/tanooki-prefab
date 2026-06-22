import { useDocumentTitle } from "~/common/use-document-title"
import { Badge } from "~/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card"

const features = [
  {
    title: "Multi-Channel Publishing",
    description:
      "Publish to Bluesky, Threads, and Mastodon from a single composer. Write once, customize per channel.",
  },
  {
    title: "Content Calendar",
    description:
      "Visual monthly calendar showing all scheduled and published posts. Navigate by month and click any post to view details.",
  },
  {
    title: "Approval Workflows",
    description:
      "Route posts through an approval process before publishing. Approve, reject, or request changes with full audit trail.",
  },
  {
    title: "Post Analytics",
    description:
      "Track impressions, likes, comments, shares, and reposts per channel. Engagement charts break down performance by platform.",
  },
  {
    title: "Brand Voice Linter",
    description:
      "AI-powered content analysis checks your posts against your organization's brand voice guidelines before publishing.",
  },
  {
    title: "Hashtag Research",
    description:
      "Get AI-suggested hashtags based on your content. Add them with a single click to maximize reach.",
  },
  {
    title: "Best Time Suggestions",
    description:
      "Intelligent scheduling recommendations based on channel engagement patterns. Pick optimal times with one click.",
  },
  {
    title: "Media Library",
    description:
      "Upload and manage images and media assets. Attach media to posts across all channels simultaneously.",
  },
  {
    title: "Channel Variant Editor",
    description:
      "Customize post copy per channel with character count enforcement. Bluesky, Threads, and Mastodon each have their own limits and norms.",
  },
]

export const FeaturesPage = () => {
  useDocumentTitle("Features")

  return (
    <div className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Features
          </Badge>
          <h1 className="text-3xl font-bold md:text-4xl">Everything you need to publish smarter</h1>
          <p className="mt-4 text-muted-foreground">
            AllSpark Social is built for agent-native teams. Schedule what the AI wrote, repurposed
            for every channel, reviewed and approved by humans.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
