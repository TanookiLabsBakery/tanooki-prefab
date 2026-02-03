import { Link, Outlet } from "react-router-dom"
import { cn } from "~/common/cn"
import {
  contactPath,
  featuresPath,
  loginPath,
  pricingPath,
  rootPath,
  testimonialsPath,
} from "~/common/paths"
import { LinkButton } from "~/ui/link-button"

const NavLink = ({
  to,
  children,
  className,
}: {
  to: string
  children: React.ReactNode
  className?: string
}) => (
  <Link
    to={to}
    className={cn(
      "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
      className
    )}
  >
    {children}
  </Link>
)

const Navigation = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to={rootPath({})} className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AllSpark
          </span>
        </Link>
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          <NavLink to={featuresPath({})}>Features</NavLink>
          <NavLink to={pricingPath({})}>Pricing</NavLink>
          <NavLink to={testimonialsPath({})}>Testimonials</NavLink>
          <NavLink to={contactPath({})}>Contact</NavLink>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <NavLink to={loginPath({})}>Sign In</NavLink>
          <LinkButton to={loginPath({})} size="sm">
            Get Started
          </LinkButton>
        </div>
      </div>
    </header>
  )
}

const Footer = () => {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to={rootPath({})} className="flex items-center space-x-2">
              <span className="text-xl font-bold">AllSpark</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              A modern, production-ready Rails + React application template built with best
              practices and powerful features.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <NavLink to={featuresPath({})}>Features</NavLink>
              </li>
              <li>
                <NavLink to={pricingPath({})}>Pricing</NavLink>
              </li>
              <li>
                <span className="text-muted-foreground/60">Documentation</span>
              </li>
              <li>
                <span className="text-muted-foreground/60">Changelog</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="text-muted-foreground/60">About Us</span>
              </li>
              <li>
                <span className="text-muted-foreground/60">Blog</span>
              </li>
              <li>
                <NavLink to={contactPath({})}>Contact</NavLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="text-muted-foreground/60">Privacy Policy</span>
              </li>
              <li>
                <span className="text-muted-foreground/60">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AllSpark. All rights reserved.</p>
          <p className="mt-2">Built with Ruby on Rails, React, Shadcn/ui, and Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}

export const MarketingLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
