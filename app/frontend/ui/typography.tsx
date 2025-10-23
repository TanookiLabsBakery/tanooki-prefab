import { cva, type VariantProps } from "class-variance-authority"
import React from "react"
import { cn } from "~/common/cn"

export const textVariants = cva("", {
  variants: {
    variant: {
      default: "",
      heading1: "text-5xl font-extrabold",
      heading2: "text-4xl font-bold",
      body: "text-sm font-medium",
    },
    wrapping: {
      default: "",
      wrap: "whitespace-pre-wrap wrap-break-word",
    },
  },
  defaultVariants: {
    variant: "default",
    wrapping: "default",
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof textVariants> {
  as?: React.ElementType
}

const Text = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, as: Comp = "span", variant, wrapping, ...props }, ref) => {
    return (
      <Comp className={cn(textVariants({ variant, wrapping, className }))} ref={ref} {...props} />
    )
  }
)
Text.displayName = "Text"

export default Text
