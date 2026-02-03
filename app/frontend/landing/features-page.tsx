import { useDocumentTitle } from "~/common/use-document-title"
import { Badge } from "~/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card"

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
      "Type-safe GraphQL API with automatic TypeScript code generation. Query and mutate your data with full type safety on both ends.",
  },
  {
    title: "PostgreSQL Database",
    description:
      "Production-ready database setup with UUID primary keys, proper indexes, and migrations. Ready to scale from day one.",
  },
  {
    title: "Email System",
    description:
      "Action Mailer configured with beautiful email templates. Preview emails in development with Letter Opener.",
  },
  {
    title: "Background Jobs",
    description:
      "Sidekiq for async processing with Redis. Handle long-running tasks, scheduled jobs, and email delivery efficiently.",
  },
  {
    title: "Security Best Practices",
    description:
      "CSRF protection, secure headers, environment-based configuration. Built with security in mind from the ground up.",
  },
  {
    title: "Developer Experience",
    description:
      "Hot module replacement, TypeScript throughout, modern React patterns. Development tools that make you productive.",
  },
  {
    title: "Testing Framework",
    description:
      "RSpec configured with factories and helpers. Write tests that give you confidence in your code.",
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
          <h1 className="text-3xl font-bold md:text-4xl">Everything you need, out of the box</h1>
          <p className="mt-4 text-muted-foreground">
            Stop configuring. Start building. This template includes all the essential features that
            modern applications need.
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
