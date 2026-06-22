import { Check } from "lucide-react"
import { featuresPath, loginPath } from "~/common/paths"
import { useDocumentTitle } from "~/common/use-document-title"
import { Badge } from "~/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card"
import { LinkButton } from "~/ui/link-button"

const HeroSection = () => (
  <section className="relative overflow-hidden py-20 md:py-32">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
    <div className="container relative">
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="secondary" className="mb-4">
          Social publishing for agent-native organizations
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Schedule what the{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            agent wrote
          </span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          AllSpark Social distributes AI-drafted content across every connected network with
          channel-appropriate formatting. Humans review and approve without losing context or
          rebuilding work from scratch.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <LinkButton to={loginPath({})} size="lg">
            Get Started Free
          </LinkButton>
          <LinkButton to={featuresPath({})} variant="outline" size="lg">
            View Features
          </LinkButton>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" /> Bluesky, Threads & Mastodon
          </span>
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" /> Approval workflows built in
          </span>
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" /> Analytics per channel
          </span>
        </div>
      </div>
    </div>
  </section>
)

const features = [
  {
    title: "Multi-Channel Composer",
    description:
      "Write once, customize per channel. Publish to Bluesky, Threads, and Mastodon with platform-specific character limits and formatting.",
  },
  {
    title: "Approval Workflows",
    description:
      "Route posts through review before publishing. Approve, reject, or request changes — with full context on every decision.",
  },
  {
    title: "Post Analytics",
    description:
      "Track impressions, likes, comments, shares, and reposts per channel. See what's working across every platform in one view.",
  },
]

const FeaturesPreview = () => (
  <section className="py-20">
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary" className="mb-4">
          Features
        </Badge>
        <h2 className="text-3xl font-bold md:text-4xl">Built for the way AI teams work</h2>
        <p className="mt-4 text-muted-foreground">
          The AI drafts the content. You approve it. AllSpark Social handles everything in between.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
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
      <div className="mt-8 text-center">
        <LinkButton to={featuresPath({})} variant="outline">
          View All Features
        </LinkButton>
      </div>
    </div>
  </section>
)

const CTASection = () => (
  <section className="bg-primary py-20 text-primary-foreground">
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Ready to publish smarter?</h2>
        <p className="mt-4 text-primary-foreground/80">
          Connect your channels, let the agent draft content, and approve with confidence. Your
          social presence on autopilot.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <LinkButton
            to={loginPath({})}
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            Start Publishing Now
          </LinkButton>
          <LinkButton
            to={featuresPath({})}
            variant="outline"
            size="lg"
            className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            Learn More
          </LinkButton>
        </div>
      </div>
    </div>
  </section>
)

export const LandingPage = () => {
  useDocumentTitle("Home")

  return (
    <div data-testid="root-screen">
      <HeroSection />
      <FeaturesPreview />
      <CTASection />
    </div>
  )
}
