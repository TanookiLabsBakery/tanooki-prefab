import { rootPath } from "~/common/paths"
import { useDocumentTitle } from "~/common/use-document-title"
import { LinkButton } from "~/ui/link-button"

export const NotFoundScreen = () => {
  useDocumentTitle("Page Not Found")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <LinkButton to={rootPath({})}>Go Home</LinkButton>
    </div>
  )
}
