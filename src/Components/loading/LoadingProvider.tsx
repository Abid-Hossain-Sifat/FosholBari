"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { HarvestLoader } from "./HarvestLoader"

interface LoadingContextType {
  readonly isInitialized: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { readonly children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [showLoader, setShowLoader] = useState<boolean>(true)

  useEffect(() => {
    try {
      const hasLoaded = sessionStorage.getItem("fosholbari_initial_loaded")
      if (hasLoaded === "true") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsInitialized(true)
        setShowLoader(false)
      } else {
        const timer = setTimeout(() => {
          try {
            sessionStorage.setItem("fosholbari_initial_loaded", "true")
          } catch (e) {
            console.warn("sessionStorage is not accessible:", e)
          }
          setIsInitialized(true)
          setShowLoader(false)
        }, 3000)
        return () => clearTimeout(timer)
      }
    } catch (e) {
      console.warn("sessionStorage is not accessible:", e)
      // Fallback: immediately mount if storage fails (e.g. private browsing restriction)
      setIsInitialized(true)
      setShowLoader(false)
    }
  }, [])

  if (showLoader) {
    return <HarvestLoader variant="initial" />
  }

  return (
    <LoadingContext.Provider value={{ isInitialized }}>
      {children}
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
