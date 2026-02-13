import { Outlet, ScrollRestoration } from "react-router-dom"
import { AppConfig } from "~/common/app-config"
import { useDocumentTitle } from "~/common/use-document-title"

export const RootLayout = () => {
  useDocumentTitle(AppConfig.app_name)
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}
