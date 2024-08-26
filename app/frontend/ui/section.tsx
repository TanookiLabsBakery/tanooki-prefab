import { cn } from "~/common/cn"
import Text from "~/ui/typography"
import { cva, type VariantProps } from "class-variance-authority"

const sectionVariants = cva("", {
  variants: {
    variant: {
      default: "",
      bordered: "flex flex-col rounded-lg mb-8 border border-gray-d0 p-6",
      grayBackground: "flex flex-col rounded-lg mb-8 bg-gray-f9 p-6",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export const Section: React.FC<{
  children?: React.ReactNode
  className?: string
  variant?: VariantProps<typeof sectionVariants>["variant"]
}> = ({ children, className, variant = "default", ...props }) => {
  return (
    <div className={cn(sectionVariants({ variant }), className)} {...props}>
      {children}
    </div>
  )
}

export const SectionLabel: React.FC<{
  children?: React.ReactNode
  underlined?: boolean
  className?: string
  variant?: "default" | "body"
}> = ({ children, underlined = false, variant = "default" }) => {
  return (
    <div className={cn("pb-3", { "border-gray-d0 border-b": underlined })}>
      <Text as="div" variant={variant}>
        {children}
      </Text>
    </div>
  )
}
