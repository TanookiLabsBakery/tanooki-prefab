import { Menu } from "lucide-react"
import { useState } from "react"
import { Link, Outlet } from "react-router-dom"
import { cn } from "~/common/cn"
import { featuresPath, loginPath, rootPath } from "~/common/paths"
import { Button } from "~/ui/button"
import { LinkButton } from "~/ui/link-button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "~/ui/sheet"

const NavLink = ({
  to,
  children,
  className,
  onClick,
}: {
  to: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
      className
    )}
  >
    {children}
  </Link>
)

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to={rootPath({})} className="mr-6 flex items-center space-x-2 gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-xl font-bold">AllSpark Social</span>
        </Link>
        <nav className="hidden flex-1 items-center space-x-6 text-sm font-medium md:flex">
          <NavLink to={featuresPath({})}>Features</NavLink>
        </nav>
        <div className="hidden flex-1 items-center justify-end space-x-4 md:flex">
          <NavLink to={loginPath({})}>Sign In</NavLink>
          <LinkButton to={loginPath({})} size="sm">
            Get Started
          </LinkButton>
        </div>
        <div className="flex flex-1 justify-end md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </Button>
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-4">
              <NavLink to={featuresPath({})} onClick={() => setMobileOpen(false)}>
                Features
              </NavLink>
              <NavLink to={loginPath({})} onClick={() => setMobileOpen(false)}>
                Sign In
              </NavLink>
              <LinkButton to={loginPath({})} onClick={() => setMobileOpen(false)}>
                Get Started
              </LinkButton>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

const Footer = () => {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link to={rootPath({})} className="flex items-center gap-2 text-lg font-bold">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5"
                aria-hidden="true"
              >
                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            AllSpark Social
          </Link>
          <nav className="flex gap-6">
            <NavLink to={featuresPath({})}>Features</NavLink>
            <NavLink to={loginPath({})}>Sign In</NavLink>
          </nav>
        </div>
        <div className="mt-6 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AllSpark Social. All rights reserved.</p>
          <p className="mt-1">Social publishing for agent-native organizations.</p>
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
