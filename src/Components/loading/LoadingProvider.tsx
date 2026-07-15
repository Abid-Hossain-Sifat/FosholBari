"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { HarvestLoader } from "./HarvestLoader"

interface LoadingContextType {
  readonly isInitialized: boolean
  readonly setGlobalLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({
  children,
}: {
  readonly children: React.ReactNode
}) {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [showInitial, setShowInitial] = useState<boolean>(true)
  const [globalLoading, setGlobalLoadingState] = useState(false)

  // ── Initial brand loader (3 s, only once per session) ──────────────────
  useEffect(() => {
    try {
      const hasLoaded = sessionStorage.getItem("fosholbari_initial_loaded")
      if (hasLoaded === "true") {
        setIsInitialized(true)
        setShowInitial(false)
      } else {
        const timer = setTimeout(() => {
          try {
            sessionStorage.setItem("fosholbari_initial_loaded", "true")
          } catch (e) {
            console.warn("sessionStorage is not accessible:", e)
          }
          setIsInitialized(true)
          setShowInitial(false)
        }, 3000)
        return () => clearTimeout(timer)
      }
    } catch (e) {
      console.warn("sessionStorage is not accessible:", e)
      setIsInitialized(true)
      setShowInitial(false)
    }
  }, [])

  const setGlobalLoading = useCallback((loading: boolean) => {
    setGlobalLoadingState(loading)
  }, [])

  // ── Initial full-screen brand loader ──────────────────────────────────
  if (showInitial) {
    return <HarvestLoader variant="initial" />
  }

  return (
    <LoadingContext.Provider value={{ isInitialized, setGlobalLoading }}>
      {children}
      {/* Global overlay — no background, loader only */}
      {globalLoading && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          aria-live="polite"
        >
          <HarvestLoader variant="fallback" />
        </div>
      )}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}

/** Hook to manually show / hide the global full-screen loader */
export function useGlobalLoading() {
  const { setGlobalLoading } = useLoading()
  return setGlobalLoading
}
