import { useNavigate } from "react-router-dom"
import { rootPath } from "~/common/paths"

export const RETURN_TO_STORAGE_KEY = "returnTo"

export const useNavigateAfterAuth = () => {
  const navigate = useNavigate()

  const navigateAfterAuth = () => {
    const returnTo = localStorage.getItem(RETURN_TO_STORAGE_KEY)
    localStorage.removeItem(RETURN_TO_STORAGE_KEY)
    if (returnTo) {
      navigate(returnTo)
    } else {
      navigate(rootPath({}))
    }
  }

  return { navigateAfterAuth }
}
