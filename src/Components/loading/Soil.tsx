"use client"

import { useEffect } from "react"
import { motion, useAnimationControls, useReducedMotion } from "framer-motion"
import { COLORS, EASE_ORGANIC, isPhaseReached, type LoaderPhase } from "./constants"

interface SoilProps {
  readonly phase: LoaderPhase
}

export function Soil({ phase }: SoilProps) {
  const controls = useAnimationControls()
  const reduceMotion = useReducedMotion()
  const visible = isPhaseReached(phase, "field")

  useEffect(() => {
    if (phase === "react" && !reduceMotion) {
      void controls.start({
        x: [0, -3, 3, -2, 2, 0],
        transition: { duration: 0.3, ease: "easeInOut" },
      })
    }
  }, [phase, controls, reduceMotion])

  return (
    <motion.div
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 -translate-x-1/2"
      animate={controls}
    >
      <motion.div
        className="rounded-full"
        style={{
          width: 240,
          height: 6,
          background: `linear-gradient(90deg, transparent 0%, ${COLORS.earthBrown} 18%, ${COLORS.earthBrownDark} 50%, ${COLORS.earthBrown} 82%, transparent 100%)`,
          boxShadow: `0 6px 14px ${COLORS.earthBrownDark}55`,
        }}
        initial={{ opacity: 0, scaleX: 0.4 }}
        animate={visible ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.4 }}
        transition={{ duration: 0.45, ease: EASE_ORGANIC }}
      />
    </motion.div>
  )
}