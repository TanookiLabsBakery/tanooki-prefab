import { ErrorLike } from "@apollo/client"
import { getErrorMessage } from "~/common/error-handling"
import { ErrorBox } from "./error-box"

export const GraphqlError = ({ error }: { error: ErrorLike }) => {
  const { title, message } = getErrorMessage(error)

  return (
    <ErrorBox>
      <div className="text">{title}</div>
      <div className="text-sm">{message}</div>
    </ErrorBox>
  )
}
