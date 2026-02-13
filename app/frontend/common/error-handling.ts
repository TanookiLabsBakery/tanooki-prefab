import { CombinedGraphQLErrors, ErrorLike } from "@apollo/client"
import { UseFormReturn } from "react-hook-form"

/** based on app/graphql/validation_error.rb */
type ValidationError = {
  field: string
  resource: string
  fullMessage: string
  message: string
  type: string
}

type ValidationErrorPayload = {
  extensions: {
    code: "VALIDATION_ERROR"
    validationErrors: Array<ValidationError>
  }
  message: string
}

export type FormGeneralError = {
  fullMessage: string
}

export const getErrorMessage = (error: ErrorLike) => {
  const title = CombinedGraphQLErrors.is(error) ? "Query failed" : "Network error"
  const message = CombinedGraphQLErrors.is(error) ? error.errors[0].message : error.message
  return { title, message, fullMessage: `${title}: ${message}` }
}

export function useFormErrorHandling(form: UseFormReturn<any>) {
  const onError = (error: ErrorLike) => {
    const formFields = Object.keys(form.getValues())
    const generalErrors: FormGeneralError[] = []

    if (CombinedGraphQLErrors.is(error)) {
      error.errors.forEach((e) => {
        if (e.extensions?.code === "VALIDATION_ERROR") {
          const validationError = e as ValidationErrorPayload
          for (const ve of validationError.extensions.validationErrors) {
            if (formFields.includes(ve.field)) {
              form.setError(ve.field as any, { message: ve.fullMessage })
            } else {
              generalErrors.push({ fullMessage: ve.fullMessage })
            }
          }
        } else {
          const { fullMessage } = getErrorMessage(error)
          generalErrors.push({ fullMessage })
        }
      })
    } else {
      const { fullMessage } = getErrorMessage(error)
      generalErrors.push({ fullMessage })
    }

    generalErrors.forEach(({ fullMessage }, index) => {
      form.setError(`base.${index}`, {
        message: fullMessage,
      })
    })
  }

  return { onError }
}
