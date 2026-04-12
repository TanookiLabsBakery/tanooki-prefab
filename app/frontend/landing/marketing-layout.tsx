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
        <Link to={rootPath({})} className="mr-6 flex items-center space-x-2">
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-xl font-bold text-transparent">
            Prefab
          </span>
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
          <Link to={rootPath({})} className="text-lg font-bold">
            Prefab
          </Link>
          <nav className="flex gap-6">
            <NavLink to={featuresPath({})}>Features</NavLink>
            <NavLink to={loginPath({})}>Sign In</NavLink>
          </nav>
        </div>
        <div className="mt-6 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Prefab. All rights reserved.</p>
          <p className="mt-1">Built with Rails, React, GraphQL, and shadcn/ui</p>
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
