import { Loader2, RefreshCw } from "lucide-react"
import { ReactNode, useEffect, useRef, useState } from "react"
import Text from "~/ui/typography"

const messageHeight = 63

const easeOut = (t: number) => 1 - Math.pow(1 - t, 2)

type UseOverscrollProps = {
  onOverscroll: () => void
  messageHeight: number
}

const useOverscroll = ({ onOverscroll, messageHeight }: UseOverscrollProps) => {
  const [startWindowScrollY, setStartWindowScrollY] = useState(0)
  const [current, setCurrent] = useState(0)
  const [isOverscrolling, setIsOverscrolling] = useState(false)
  const [hasOverscrolled, setHasOverscrolled] = useState(false)

  const onStart = (e: TouchEvent) => {
    if (e.targetTouches.length !== 1) return
    setHasOverscrolled(false)
    setIsOverscrolling(false)
    setStartWindowScrollY(window.scrollY)
  }

  const onDrag = (e: TouchEvent) => {
    if (e.targetTouches.length !== 1) return
    if (startWindowScrollY > window.screen.height / 3) return

    setIsOverscrolling(window.scrollY < 0)
    if (window.scrollY < 0) {
      setCurrent(Math.abs(window.scrollY))
    } else {
      setCurrent(0)
    }
  }

  const onEnd = () => {
    setStartWindowScrollY(0)
    setCurrent(0)
    setIsOverscrolling(false)

    if (current >= messageHeight / 2) {
      setHasOverscrolled(true)
      setTimeout(async () => {
        await onOverscroll()
      }, 500)
    }
  }

  useEffect(() => {
    window.addEventListener("touchstart", onStart)
    window.addEventListener("touchmove", onDrag)
    window.addEventListener("touchend", onEnd)

    return () => {
      window.removeEventListener("touchstart", onStart)
      window.removeEventListener("touchmove", onDrag)
      window.removeEventListener("touchend", onEnd)
    }
  })

  return { isOverscrolling, hasOverscrolled, current }
}

type PwaPullToRefreshProps = {
  children: ReactNode
}

export const PwaPullToRefresh = ({ children }: PwaPullToRefreshProps) => {
  const overscrollMessageRef = useRef<HTMLDivElement>(null)
  const [isStandalone] = useState(window.matchMedia("(display-mode: standalone)").matches)

  const { isOverscrolling, hasOverscrolled, current } = useOverscroll({
    onOverscroll: async () => {
      if (isStandalone) {
        window.location.reload()
      }
    },
    messageHeight,
  })

  useEffect(() => {
    if (!overscrollMessageRef.current) return

    const overscroller = overscrollMessageRef.current
    if (hasOverscrolled || isOverscrolling) {
      overscroller.classList.remove("hidden")
    }

    if (hasOverscrolled) {
      overscroller.style.transition = "opacity 0.2s, height 0.2s"
      overscroller.style.height = messageHeight + "px"
      overscroller.style.opacity = "1"
    } else if (isOverscrolling) {
      overscroller.style.transition = ""
      overscroller.style.height = Math.min(messageHeight, current) + "px"
      overscroller.style.opacity = easeOut(Math.min(1, current / messageHeight)).toFixed(2)
    } else {
      overscroller.style.transition = "opacity 0.2s, height 0.2s"
      overscroller.style.height = "0"
      overscroller.style.opacity = "0"
    }
  }, [current, hasOverscrolled, isOverscrolling])

  if (!isStandalone) {
    return <>{children}</>
  }

  return (
    <>
      <div
        ref={overscrollMessageRef}
        className="hidden flex items-center justify-center gap-2 overflow-hidden border-b"
      >
        {hasOverscrolled && <Loader2 className="h-4 w-4 animate-spin" />}
        {!hasOverscrolled && (
          <>
            <RefreshCw className="h-4 w-4" />
            <Text>Release to refresh</Text>
          </>
        )}
      </div>
      {children}
    </>
  )
}
