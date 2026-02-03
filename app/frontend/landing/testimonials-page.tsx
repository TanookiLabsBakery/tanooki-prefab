import { useDocumentTitle } from "~/common/use-document-title"
import { Badge } from "~/ui/badge"
import { Card, CardContent } from "~/ui/card"

const testimonials = [
  {
    initials: "SK",
    name: "Sarah Kim",
    role: "Founder, TechStartup Inc.",
    quote:
      "This template saved us 6 weeks of development time. We shipped our MVP in record time and our investors were impressed with the polish.",
  },
  {
    initials: "MP",
    name: "Michael Peters",
    role: "Senior Developer, SaaS Co.",
    quote:
      "The code quality is exceptional. Clean architecture, proper tests, and modern Rails + React patterns. This is how full-stack apps should be built.",
  },
  {
    initials: "JL",
    name: "Jessica Lee",
    role: "CTO, HealthTech Startup",
    quote:
      "Perfect for healthcare compliance. The security features and audit trails made HIPAA compliance straightforward. Highly recommended!",
  },
  {
    initials: "DR",
    name: "David Rodriguez",
    role: "Lead Developer, FinTech Corp",
    quote:
      "The GraphQL API with TypeScript codegen is a game-changer. Full type safety from database to frontend. No more runtime surprises.",
  },
  {
    initials: "AT",
    name: "Anna Thompson",
    role: "Solo Founder",
    quote:
      "As a solo founder, this template let me focus on my unique value proposition instead of boilerplate. Launched in 2 weeks instead of 2 months.",
  },
  {
    initials: "KW",
    name: "Kevin Wang",
    role: "Engineering Manager, Scale Inc.",
    quote:
      "We use this as our starting point for all new projects. Consistent patterns, great DX, and production-ready from day one.",
  },
]

const StarRating = () => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="h-4 w-4 fill-yellow-400" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

export const TestimonialsPage = () => {
  useDocumentTitle("Testimonials")

  return (
    <div className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Testimonials
          </Badge>
          <h1 className="text-3xl font-bold md:text-4xl">Loved by developers worldwide</h1>
          <p className="mt-4 text-muted-foreground">
            Don&apos;t just take our word for it. Here&apos;s what developers are saying about using
            this template for their projects.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <StarRating />
                </div>
                <p className="mt-4 text-muted-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
