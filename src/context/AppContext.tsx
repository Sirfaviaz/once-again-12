import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { FontFamily } from '../utils/fonts'

export type Scene = 'intro' | 'upload' | 'frame' | 'magic' | 'export'

export interface FrameSettings {
  photoX: number
  photoY: number
  photoScale: number
  text: string
  fontFamily: FontFamily
}

export interface MagicToggles {
  filmGrain: boolean
  warmTone: boolean
  lightLeak: boolean
}

interface AppContextType {
  currentScene: Scene
  photo: string | null
  frameSettings: FrameSettings
  magicToggles: MagicToggles
  setCurrentScene: (scene: Scene) => void
  setPhoto: (photo: string | null) => void
  updateFrameSettings: (settings: Partial<FrameSettings>) => void
  toggleMagic: (key: keyof MagicToggles) => void
  reset: () => void
}

const defaultFrameSettings: FrameSettings = {
  photoX: 0,
  photoY: 0,
  photoScale: 1,
  text: '',
  fontFamily: 'serif',
}

const defaultMagicToggles: MagicToggles = {
  filmGrain: true,
  warmTone: true,
  lightLeak: false, // Light leak is one-time effect, keep false
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScene, setCurrentScene] = useState<Scene>('intro')
  const [photo, setPhoto] = useState<string | null>(null)
  const [frameSettings, setFrameSettings] = useState<FrameSettings>(defaultFrameSettings)
  const [magicToggles, setMagicToggles] = useState<MagicToggles>(defaultMagicToggles)

  const updateFrameSettings = useCallback((settings: Partial<FrameSettings>) => {
    setFrameSettings((prev) => ({ ...prev, ...settings }))
  }, [])

  const toggleMagic = useCallback((key: keyof MagicToggles) => {
    setMagicToggles((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const reset = useCallback(() => {
    setCurrentScene('intro')
    setPhoto(null)
    setFrameSettings(defaultFrameSettings)
    // Keep effects enabled by default
    setMagicToggles({
      filmGrain: true,
      warmTone: true,
      lightLeak: false,
    })
  }, [])

  return (
    <AppContext.Provider
      value={{
        currentScene,
        photo,
        frameSettings,
        magicToggles,
        setCurrentScene,
        setPhoto,
        updateFrameSettings,
        toggleMagic,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}


