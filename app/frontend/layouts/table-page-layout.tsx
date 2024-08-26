import { cn } from "~/common/cn"

export const TablePageLayout: React.FC<{
  children?: React.ReactNode
  rightSideSlot?: React.ReactNode
  padding?: boolean
}> = ({ rightSideSlot, padding = true, children }) => (
  <div className="flex max-w-full flex-1 overflow-hidden">
    <div
      className={cn("w-full flex-1 grow overflow-x-auto", {
        "px-4 py-8": padding,
      })}
    >
      <div className={cn("space-y-8", { "px-4": padding })}>{children}</div>
    </div>
    {rightSideSlot ? <>{rightSideSlot}</> : null}
  </div>
)
