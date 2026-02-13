import { useEffect } from "react"
import { AppConfig } from "./app-config"

const defaultSuffix = ` · ${AppConfig.app_name}`

export const useDocumentTitle = (title: string | null, suffix = defaultSuffix) => {
  useEffect(() => {
    if (title != null) {
      document.title = `${title}${suffix}`
    }
  }, [title, suffix])
}
