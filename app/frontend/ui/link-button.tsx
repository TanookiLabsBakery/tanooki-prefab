import { VariantProps } from "class-variance-authority"
import { Link as RRLink, LinkProps as RRLinkProps } from "react-router-dom"
import { buttonVariants } from "./button"
import { cn } from "../common/cn"

type LinkButtonProps = VariantProps<typeof buttonVariants> & RRLinkProps

/**
 * Link that looks like a button
 */
export const LinkButton = ({ ...props }: LinkButtonProps) => {
  const className = buttonVariants({ variant: props.variant, size: props.size })
  return <RRLink {...props} className={cn(className, props.className)} />
}
