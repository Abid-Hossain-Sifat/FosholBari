"use client"

import { motion } from "framer-motion"
import { COLORS, EASE_ORGANIC, isPhaseReached, type LoaderPhase } from "./constants"

interface SoilCrackProps {
  readonly phase: LoaderPhase
}

export function SoilCrack({ phase }: SoilCrackProps) {
  const open = isPhaseReached(phase, "react")

  return (
    <div
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
      style={{ height: 10 }}
    >
      <motion.div
        className="rounded-full"
        style={{ height: 8, background: COLORS.earthBrownDark }}
        initial={{ width: 0, opacity: 0 }}
        animate={open ? { width: 16, opacity: 1 } : { width: 0, opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE_ORGANIC }}
      />
      <motion.div
        className="absolute right-1/2 rounded-full"
        style={{ width: 30, height: 7, background: COLORS.earthBrown }}
        initial={{ x: 0, y: 0, rotate: 0 }}
        animate={open ? { x: -12, y: -2, rotate: -8 } : { x: 0, y: 0, rotate: 0 }}
        transition={{ duration: 0.4, ease: EASE_ORGANIC }}
      />
      <motion.div
        className="absolute left-1/2 rounded-full"
        style={{ width: 30, height: 7, background: COLORS.earthBrown }}
        initial={{ x: 0, y: 0, rotate: 0 }}
        animate={open ? { x: 12, y: -2, rotate: 8 } : { x: 0, y: 0, rotate: 0 }}
        transition={{ duration: 0.4, ease: EASE_ORGANIC }}
      />
    </div>
  )
}