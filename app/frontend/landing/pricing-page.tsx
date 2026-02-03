import { loginPath } from "~/common/paths"
import { useDocumentTitle } from "~/common/use-document-title"
import { Badge } from "~/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card"
import { LinkButton } from "~/ui/link-button"

const CheckIcon = () => (
  <svg
    className="h-4 w-4 text-primary"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/one-time",
    description: "Perfect for side projects and experiments",
    features: ["Full source code", "Use on 1 project", "6 months of updates", "Community support"],
    popular: false,
  },
  {
    name: "Professional",
    price: "$149",
    period: "/one-time",
    description: "For serious developers and small teams",
    features: [
      "Full source code",
      "Use on 5 projects",
      "Lifetime updates",
      "Priority email support",
      "Customization assistance",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$499",
    period: "/one-time",
    description: "For agencies and large organizations",
    features: [
      "Full source code",
      "Unlimited projects",
      "Lifetime updates",
      "24/7 priority support",
      "Custom feature development",
      "Architecture consultation",
    ],
    popular: false,
  },
]

export const PricingPage = () => {
  useDocumentTitle("Pricing")

  return (
    <div className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Pricing
          </Badge>
          <h1 className="text-3xl font-bold md:text-4xl">Simple, transparent pricing</h1>
          <p className="mt-4 text-muted-foreground">
            Choose the plan that fits your needs. All plans include full source code access.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.popular ? "border-primary shadow-lg scale-105" : ""}
            >
              <CardHeader>
                {plan.popular && <Badge className="w-fit mb-2">POPULAR</Badge>}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <LinkButton
                  to={loginPath({})}
                  className="w-full mt-6"
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </LinkButton>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          All plans include a 30-day money-back guarantee. No questions asked.
        </p>
      </div>
    </div>
  )
}
