import { useCallback, useEffect, useRef, useState } from 'react'

interface useTimerOptions {
  duration: number
  initialRemainingTime: number
  interval: number
  onTick: (remainingTime: number) => void
  onComplete: () => void
  autoStart?: boolean
}

function useTimer({
  duration,
  initialRemainingTime,
  interval,
  onTick,
  onComplete,
  autoStart = false
}: useTimerOptions) {
  const [remainingTime, setRemainingTime] = useState(initialRemainingTime)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const tick = useCallback(() => {
    setRemainingTime((prev) => {
      const next = prev - interval / 1000
      onTick(next)
      if (next <= 0) {
        clear()
        onComplete()
        return 0
      }
      return next
    })
  }, [interval, onTick, onComplete])

  const start = useCallback(() => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(tick, interval)
    }
  }, [tick, interval])

  const stop = useCallback(() => {
    clear()
  }, [])

  const reset = useCallback(() => {
    clear()
    setRemainingTime(duration)
  }, [duration])

  useEffect(() => {
    if (autoStart) {
      start()
    }
    return clear
  }, [start, autoStart])

  return { start, tick, stop, clear, reset, remainingTime, isPlaying: intervalRef.current !== null }
}

export { useTimer }
