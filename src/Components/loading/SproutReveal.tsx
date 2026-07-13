"use client"

import { Sprout } from "lucide-react"
import { motion, type Transition, type Variants } from "framer-motion"
import { COLORS, isPhaseReached, type LoaderPhase } from "./constants"

interface SproutRevealProps {
  readonly phase: LoaderPhase
  readonly reduceMotion: boolean
}

const growTransition: Transition = { type: "spring", stiffness: 180, damping: 12, mass: 0.8 }

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0 },
  grow: {
    opacity: 1, y: 0, scale: [0, 1.15, 1],
    transition: { ...growTransition, scale: { duration: 0.45, times: [0, 0.6, 1] } },
  },
}

const swayVariants: Variants = {
  still: { rotate: 0, scale: 1 },
  sway: {
    rotate: [-3, 3, -3],
    scale: [1, 1.04, 1],
    transition: { duration: 3.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
  },
}

export function SproutReveal({ phase, reduceMotion }: SproutRevealProps) {
  const visible = isPhaseReached(phase, "sprout")
  const idle = phase === "idle" && !reduceMotion

  if (!visible) return null

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2"
      style={{ transformOrigin: "bottom center", bottom: 0 }}
      variants={containerVariants}
      initial="hidden"
      animate="grow"
    >
      <div className="relative flex -translate-y-[calc(100%-2px)] items-center justify-center">
        <motion.div variants={swayVariants} animate={idle ? "sway" : "still"} style={{ transformOrigin: "bottom center" }}>
          <Sprout size={56} strokeWidth={2} color={COLORS.primaryGreen} aria-label="FosholBari" className="relative drop-shadow-sm" />
        </motion.div>
      </div>
    </motion.div>
  )
}