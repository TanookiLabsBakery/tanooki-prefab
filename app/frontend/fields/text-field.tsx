import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/ui/form"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { InputHTMLAttributes } from "react"
import { cn } from "~/common/cn"
import { Input } from "../ui/input"

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
}: {
  label: string
  labelClassName?: string
  control: Control<TFieldValues> | undefined
  name: TName
  type?: string
  placeholder?: string
} & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn(labelClassName)}>{label}</FormLabel>
          <FormControl>
            <Input {...field} type={type} placeholder={placeholder} />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  )
}
