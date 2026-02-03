import { useState } from "react"
import { useDocumentTitle } from "~/common/use-document-title"
import { Badge } from "~/ui/badge"
import { Button } from "~/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card"
import { Textarea } from "~/ui/textarea"

const inputClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

const labelClassName = "text-sm font-medium leading-none"

const contactMethods = [
  {
    icon: "📧",
    title: "Email",
    description: "support@example.com",
  },
  {
    icon: "💬",
    title: "Live Chat",
    description: "Available 24/7",
  },
  {
    icon: "📞",
    title: "Phone",
    description: "+1 (555) 123-4567",
  },
]

export const ContactPage = () => {
  useDocumentTitle("Contact")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Contact Us
          </Badge>
          <h1 className="text-3xl font-bold md:text-4xl">Let&apos;s build something amazing</h1>
          <p className="mt-4 text-muted-foreground">
            Have questions? Need customization? Want to discuss enterprise options? We&apos;re here
            to help.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                This is an example form and does not submit data.
              </div>
              {submitted ? (
                <div className="rounded-md border border-green-200 bg-green-50 p-4 text-center text-green-800">
                  <p className="font-medium">Message sent!</p>
                  <p className="mt-1 text-sm">This is a demo - no message was actually sent.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className={labelClassName}>
                      Your Name
                    </label>
                    <input id="name" className={inputClassName} placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className={labelClassName}>
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={inputClassName}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company" className={labelClassName}>
                      Company (Optional)
                    </label>
                    <input id="company" className={inputClassName} placeholder="Acme Inc." />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className={labelClassName}>
                      How can we help you?
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project..."
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Other ways to reach us</h3>
            {contactMethods.map((method) => (
              <Card key={method.title}>
                <CardContent className="flex items-center gap-4 pt-6">
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <h4 className="font-semibold">{method.title}</h4>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
