import { Outlet, ScrollRestoration } from "react-router-dom"
import { getMetaContent } from "~/common/get-meta-content"
import { useDocumentTitle } from "~/common/use-document-title"

export const RootLayout = () => {
  useDocumentTitle(getMetaContent("APP_NAME"))
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}
