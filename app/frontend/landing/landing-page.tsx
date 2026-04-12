import { Check, X } from "lucide-react"
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
          Production-Ready Rails + React Template
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Build Your Next Great{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Product
          </span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Skip the boilerplate. Start with a modern Rails 8 + React foundation that includes
          authentication, Shadcn/ui components, GraphQL API, and everything you need to ship faster.
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
            <Check className="h-4 w-4 text-primary" /> No credit card required
          </span>
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" /> Setup in 5 minutes
          </span>
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" /> Full source code included
          </span>
        </div>
      </div>
    </div>
  </section>
)

const ProblemSolutionSection = () => (
  <section className="bg-muted/30 py-20">
    <div className="container">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <Badge variant="outline" className="mb-4 border-destructive/50 text-destructive">
            The Problem
          </Badge>
          <h2 className="text-2xl font-bold md:text-3xl">
            Starting from scratch is time-consuming
          </h2>
          <p className="mt-4 text-muted-foreground">
            Building a production-ready application requires setting up authentication, UI
            components, API architecture, email systems, background jobs, and so much more.
          </p>
          <ul className="mt-6 space-y-3">
            <li className="flex items-start gap-3">
              <X className="h-4 w-4 text-destructive" />
              <span className="text-sm">Weeks spent on authentication and user management</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-4 w-4 text-destructive" />
              <span className="text-sm">Constant reinvention of common patterns</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-4 w-4 text-destructive" />
              <span className="text-sm">Delayed time-to-market for your unique features</span>
            </li>
          </ul>
        </div>
        <div>
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
            The Solution
          </Badge>
          <h2 className="text-2xl font-bold md:text-3xl">
            A complete starter template that just works
          </h2>
          <p className="mt-4 text-muted-foreground">
            This isn&apos;t just another boilerplate. It&apos;s a fully-featured, production-tested
            Rails + React application that you can customize and deploy immediately.
          </p>
          <ul className="mt-6 space-y-3">
            <li className="flex items-start gap-3">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Ship your MVP in days, not months</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">
                Built with Rails 8, React 19, and modern best practices
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Production-ready from day one</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
)

const features = [
  {
    title: "Authentication & Authorization",
    description:
      "Token-based authentication with role-based access control (RBAC). User management, email verification, and session handling all configured.",
  },
  {
    title: "Shadcn/ui Components",
    description:
      "Built with Shadcn/ui and Tailwind CSS. Responsive, accessible components including modals, forms, tables, and navigation.",
  },
  {
    title: "GraphQL API",
    description:
      "Type-safe GraphQL API with automatic TypeScript code generation. Query and mutate your data with full type safety.",
  },
]

const FeaturesPreview = () => (
  <section className="py-20">
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary" className="mb-4">
          Features
        </Badge>
        <h2 className="text-3xl font-bold md:text-4xl">Everything you need, out of the box</h2>
        <p className="mt-4 text-muted-foreground">
          Stop configuring. Start building. This template includes all the essential features that
          modern applications need.
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
        <h2 className="text-3xl font-bold md:text-4xl">Ready to ship faster?</h2>
        <p className="mt-4 text-primary-foreground/80">
          Join hundreds of developers who are building amazing products with this template. Start
          your project today.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <LinkButton
            to={loginPath({})}
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            Start Building Now
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
        <p className="mt-6 text-sm text-primary-foreground/60">
          No credit card required &bull; Setup in 5 minutes &bull; Full source code included
        </p>
      </div>
    </div>
  </section>
)

export const LandingPage = () => {
  useDocumentTitle("Home")

  return (
    <div data-testid="root-screen">
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesPreview />
      <CTASection />
    </div>
  )
}
