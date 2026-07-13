"use client"

import { useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { COLORS, PARTICLE_COUNT } from "./constants"

interface SoilParticlesProps {
  readonly active: boolean
}

interface Particle {
  readonly id: number
  readonly x: number
  readonly y: number
  readonly size: number
  readonly delay: number
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, id) => {
    const angle = (Math.PI * (id + 1)) / (count + 1)
    const distance = 26 + (id % 4) * 8
    return {
      id,
      x: Math.cos(angle) * distance * (id % 2 === 0 ? 1 : -1) * 0.6,
      y: -Math.sin(angle) * distance - 6,
      size: 3 + (id % 3),
      delay: (id % 5) * 0.02,
    }
  })
}

export function SoilParticles({ active }: SoilParticlesProps) {
  const particles = useMemo(() => createParticles(PARTICLE_COUNT), [])

  return (
    <div aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <AnimatePresence>
        {active &&
          particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full"
              style={{ width: p.size, height: p.size, background: COLORS.earthBrown }}
              initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
              animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: p.delay, ease: "easeOut" }}
            />
          ))}
      </AnimatePresence>
    </div>
  )
}