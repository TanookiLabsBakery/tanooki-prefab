import { useEffect } from "react"
import { getMetaContent } from "./get-meta-content"

const defaultSuffix = ` · ${getMetaContent("APP_NAME")}`

export const useDocumentTitle = (
  title: string | null,
  suffix = defaultSuffix,
) => {
  useEffect(() => {
    if (title != null) {
      document.title = `${title}${suffix}`
    }
  }, [title, suffix])
}
