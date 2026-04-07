import { useEffect, useRef, useState } from 'react'
import { computeRemainingMs } from '../domain/timer'

const TICK_INTERVAL_MS = 200

export function useQuestionTimer(
  deadlineAtMs: number | null,
  token: string | null,
  onExpire: (token: string) => void,
): number {
  // Used only to trigger re-renders on each tick; actual remaining time is derived fresh.
  const [, forceUpdate] = useState(0)
  const onExpireRef = useRef(onExpire)
  const firedRef = useRef<string | null>(null)

  useEffect(() => {
    onExpireRef.current = onExpire
  })

  useEffect(() => {
    if (deadlineAtMs === null || token === null) return

    firedRef.current = null

    const id = setInterval(() => {
      forceUpdate(n => n + 1)
      const remaining = computeRemainingMs(deadlineAtMs)
      if (remaining === 0 && firedRef.current !== token) {
        firedRef.current = token
        onExpireRef.current(token)
      }
    }, TICK_INTERVAL_MS)

    return () => clearInterval(id)
  }, [deadlineAtMs, token])

  return deadlineAtMs !== null && token !== null ? computeRemainingMs(deadlineAtMs) : 0
}
