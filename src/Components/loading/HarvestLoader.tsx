"use client"

import { useEffect, useState } from "react"
import { MotionConfig, useReducedMotion } from "framer-motion"
import { PHASE_DURATIONS, PHASE_ORDER, type LoaderPhase } from "./constants"
import { Soil } from "./Soil"
import { Seed } from "./Seed"
import { SoilParticles } from "./SoilParticles"
import { SoilCrack } from "./SoilCrack"
import { SproutReveal } from "./SproutReveal"
import { BrandText } from "./BrandText"

interface HarvestLoaderProps {
  readonly onReady?: () => void
  readonly className?: string
  readonly variant?: "initial" | "fallback"
}

export function HarvestLoader({ onReady, className, variant = "initial" }: HarvestLoaderProps) {
  const reduceMotion = useReducedMotion() ?? false
  const isFallback = variant === "fallback"
  const [phase, setPhase] = useState<LoaderPhase>((reduceMotion || isFallback) ? "idle" : "field")

  useEffect(() => {
    if (reduceMotion || isFallback) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("idle")
      onReady?.()
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []
    let elapsed = 0

    PHASE_ORDER.forEach((current, index) => {
      const next = PHASE_ORDER[index + 1]
      if (!next || current === "idle") return
      elapsed += PHASE_DURATIONS[current as keyof typeof PHASE_DURATIONS]
      timers.push(setTimeout(() => setPhase(next), elapsed))
    })

    timers.push(setTimeout(() => onReady?.(), elapsed))
    return () => timers.forEach(clearTimeout)
  }, [reduceMotion, isFallback, onReady])

  return (
    <MotionConfig reducedMotion="user">
      <div
        role="status"
        aria-label="Loading FosholBari"
        className={`relative flex w-full items-center justify-center overflow-hidden ${
          className?.includes("min-h-") || className?.includes("h-")
            ? ""
            : "min-h-screen"
        } ${className ?? ""}`}
      >
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative h-44 w-72">
            <Soil phase={phase} />
            <SoilCrack phase={phase} />
            <SoilParticles active={phase === "react"} />
            <Seed phase={phase} />
            <SproutReveal phase={phase} reduceMotion={reduceMotion} />
          </div>

          <BrandText phase={phase} />
        </div>

        <span className="sr-only">Preparing your harvest, please wait.</span>
      </div>
    </MotionConfig>
  )
}