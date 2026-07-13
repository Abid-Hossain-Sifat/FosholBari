"use client"

import { motion, type Variants } from "framer-motion"
import { COLORS } from "./constants"

interface SeedProps {
  readonly phase: string
}

const seedVariants: Variants = {
  hidden: { y: -180, opacity: 0, scaleY: 1, scaleX: 1 },
  falling: {
    y: [-180, -6, -18, -4],
    opacity: [0, 1, 1, 1],
    scaleY: [1, 1, 0.86, 1],
    scaleX: [1, 1, 1.12, 1],
    transition: {
      duration: 0.55,
      times: [0, 0.62, 0.82, 1],
      ease: ["easeIn", "easeOut", "easeInOut"],
    },
  },
  sink: {
    y: 8, opacity: 0, scaleY: 0.5, scaleX: 1.2,
    transition: { duration: 0.3, ease: "easeIn" },
  },
}

export function Seed({ phase }: SeedProps) {
  const state = phase === "field" ? "hidden" : phase === "seed" ? "falling" : "sink"

  return (
    <motion.div
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      variants={seedVariants}
      initial="hidden"
      animate={state}
      style={{ transformOrigin: "center bottom" }}
    >
      <div
        className="rounded-[50%]"
        style={{
          width: 12,
          height: 16,
          background: `linear-gradient(150deg, ${COLORS.earthBrown} 0%, ${COLORS.earthBrownDark} 100%)`,
          boxShadow: `inset -1px -1px 2px ${COLORS.earthBrownDark}, 0 2px 4px ${COLORS.earthBrownDark}66`,
        }}
      />
    </motion.div>
  )
}