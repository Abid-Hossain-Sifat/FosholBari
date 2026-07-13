"use client"

import { motion, type Variants } from "framer-motion"
import { BRAND_NAME, COLORS, EASE_ORGANIC, isPhaseReached, PULSE_DURATION, type LoaderPhase } from "./constants"

interface BrandTextProps {
  readonly phase: LoaderPhase
}

/** Soft, premium entrance — opacity, vertical drift, and blur. */
const entranceVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE_ORGANIC },
  },
}

/** Breathing scale — starts on the `idle` tick, matched to the sprout glow. */
const breatheVariants: Variants = {
  still: { scale: 1 },
  breathe: {
    scale: [1, 1.06, 1],
    transition: {
      duration: PULSE_DURATION,
      ease: "easeInOut",
      times: [0, 0.5, 1],
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
    },
  },
}

export function BrandText({ phase }: BrandTextProps) {
  const visible = isPhaseReached(phase, "brand")
  const idle = phase === "idle"

  return (
    <motion.div
      className="-mt-14"
      variants={entranceVariants}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
    >
      <motion.h1
        className="text-center text-3xl font-semibold tracking-wide sm:text-4xl"
        style={{ color: COLORS.darkGreen, fontFamily: "var(--font-bengali), sans-serif" }}
        variants={breatheVariants}
        animate={idle ? "breathe" : "still"}
      >
        {BRAND_NAME}
      </motion.h1>
    </motion.div>
  )
}