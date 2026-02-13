import { cn } from "~/common/cn"

export const ErrorBox = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={cn("shrink-0 overflow-auto", className)}>
    <div className="shrink-0 overflow-auto rounded border border-red-500 p-3 text-red-600">
      {children}
    </div>
  </div>
)
