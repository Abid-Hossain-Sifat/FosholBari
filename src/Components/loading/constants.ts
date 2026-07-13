/**
 * Shared constants, types, and animation tokens for the FosholBari
 * "Harvest" loading experience.
 */

/** Discrete stages of the loading story, in order. */
export type LoaderPhase =
  | "field" // 1. Empty field, soil fades in
  | "seed" // 2. Seed falls and hits the soil
  | "react" // 3. Soil cracks and lifts
  | "sprout" // 4. Sprout grows from the crack
  | "brand" // 5. Brand name is revealed
  | "idle" // 6. Gentle infinite loading animation

/** Ordered list of phases used to drive the state machine. */
export const PHASE_ORDER: readonly LoaderPhase[] = [
  "field", "seed", "react", "sprout", "brand", "idle",
] as const

/** Delay (ms) before advancing FROM the given phase to the next one. */
export const PHASE_DURATIONS: Record<Exclude<LoaderPhase, "idle">, number> = {
  field: 400, seed: 750, react: 450, sprout: 600, brand: 500,
}

/** Brand color palette (kept minimal: green, earth, neutrals). */
export const COLORS = {
  primaryGreen: "#3f9d54",
  darkGreen: "#1f5130",
  leafGlow: "#7ed492",
  earthBrown: "#6b4a2b",
  earthBrownDark: "#4d3520",
  neutralGray: "#6b7280",
} as const

export const BRAND_NAME = "ফসলবাড়ি"
export const LOADING_MESSAGE = "Preparing your harvest"
export const PARTICLE_COUNT = 10
export const EASE_ORGANIC: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Duration (s) of the idle breathing pulse — shared by glow + brand zoom. */
export const PULSE_DURATION = 3.4

export function isPhaseReached(current: LoaderPhase, target: LoaderPhase): boolean {
  return PHASE_ORDER.indexOf(current) >= PHASE_ORDER.indexOf(target)
}