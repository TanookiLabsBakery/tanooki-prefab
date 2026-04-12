import { InputHTMLAttributes } from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { cn } from "~/common/cn"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/ui/form"
import { Input } from "~/ui/input"

export const TextField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  labelClassName,
  type = "text",
  placeholder,
  disabled,
  required,
}: {
  label: string
  labelClassName?: string
  control: Control<TFieldValues> | undefined
  name: TName
  type?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
} & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel
            className={cn(
              "text-muted-foreground",
              fieldState.error && "text-destructive",
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <Input {...field} type={type} placeholder={placeholder} disabled={disabled} />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  )
}
