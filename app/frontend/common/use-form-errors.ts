import { MutationResult, isApolloError } from "@apollo/client"
import { useEffect } from "react"
import { FieldValues, UseFormSetError } from "react-hook-form"
import { useToast } from "~/ui/use-toast"
import { ValidationErrorPayload, getGraphqlErrors } from "./validations"

export function useFormErrors<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  mutationResult: MutationResult
) {
  const { toast } = useToast()

  useEffect(() => {
    const rawError = mutationResult.error

    if (!rawError) return
    const graphqlErrors = getGraphqlErrors(rawError)

    const isValidationError = graphqlErrors?.find(
      (error) => error.extensions?.code === "VALIDATION_ERROR"
    )

    if (isValidationError) {
      const typedValidationErrors = isValidationError as unknown as ValidationErrorPayload

      toast({
        title: "Validation error",
        variant: "destructive",
      })

      for (const ve of typedValidationErrors.extensions.validationErrors) {
        setError(ve.field as any, { message: ve.fullMessage })
      }
    } else if (isApolloError(rawError)) {
      let message = rawError.message || "An error occurred, please try again"
      toast({ title: message, variant: "destructive" })
    }

    // unstable identities
  }, [mutationResult.error, setError, toast])
}
