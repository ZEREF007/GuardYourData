import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Props {
  value: string          // e.g. "US$4.45M", "277 days", "83%", "€20M"
  className?: string
  duration?: number      // ms
}

/** Parses a value string into { prefix, number, suffix }
 *  e.g. "US$4.45M" → { prefix: "US$", number: 4.45, suffix: "M" }
 *       "277 days"  → { prefix: "",    number: 277,   suffix: " days" }
 *       "83%"       → { prefix: "",    number: 83,    suffix: "%" }
 */
function parse(raw: string) {
  const m = raw.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/)
  if (!m) return { prefix: '', number: 0, suffix: raw }
  return { prefix: m[1], number: parseFloat(m[2]), suffix: m[3] }
}

export default function CountUp({ value, className = '', duration = 1800 }: Props) {
  const { prefix, number, suffix } = parse(value)
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const startedRef = useRef(false)

  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true

    // Ease-out cubic
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const current = number * ease(progress)
      // Keep same decimal places as original
      const decimals = (value.match(/\.(\d+)/) ?? ['', ''])[1].length
      setDisplay(parseFloat(current.toFixed(decimals)))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, number, duration, value])

  const decimals = (value.match(/\.(\d+)/) ?? ['', ''])[1].length
  const formatted = display.toFixed(decimals)

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
