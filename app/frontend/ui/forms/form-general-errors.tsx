import { useFormState } from "react-hook-form"
import { ErrorBox } from "../error-box"

export const FormGeneralErrors = ({ control, className }: { control: any; className?: string }) => {
  const { errors } = useFormState({ control, name: "base" })
  const generalErrors = Object.values(errors.base || {})

  if (generalErrors.length === 0) return null

  return (
    <ErrorBox className={className}>
      <div className="text-sm">Errors</div>
      <ul>
        {generalErrors.map((error, index) => (
          <li key={index} className="text-xs">
            {error.message}
          </li>
        ))}
      </ul>
    </ErrorBox>
  )
}
