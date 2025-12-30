import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { FilmGrain } from '../components/FilmGrain'
import { WarmTone } from '../components/WarmTone'
import { LightLeak } from '../components/LightLeak'
import { Frame } from '../components/Frame'
import { PhotoEditor } from '../components/PhotoEditor'
import { TextEditor } from '../components/TextEditor'
import { BottomSheet } from '../components/BottomSheet'
import { fadeIn } from '../utils/animations'
import { Film, Sun, Sparkles } from 'lucide-react'

export const Scene4MagicTouches: React.FC = () => {
  const { photo, magicToggles, toggleMagic, setCurrentScene } = useApp()
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)

  if (!photo) {
    return null
  }

  const toggles = [
    {
      key: 'filmGrain' as const,
      label: 'Film Grain',
      icon: Film,
      description: 'Add nostalgic film texture',
    },
    {
      key: 'warmTone' as const,
      label: 'Warm Tone',
      icon: Sun,
      description: 'Apply warm color overlay',
    },
    {
      key: 'lightLeak' as const,
      label: 'Light Leak',
      icon: Sparkles,
      description: 'One-time light sweep effect',
    },
  ]

  return (
    <motion.div
      className="relative h-full w-full flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 overflow-auto"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-warm-burgundy-dark via-warm-burgundy-DEFAULT to-warm-brown-dark" />

      {/* Frame container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <Frame>
          <PhotoEditor />
          <TextEditor />

          {/* Magic effects */}
          <FilmGrain active={magicToggles.filmGrain} />
          <WarmTone active={magicToggles.warmTone} />
          <LightLeak 
            active={magicToggles.lightLeak} 
            onComplete={() => {
              // Reset light leak toggle after animation
              if (magicToggles.lightLeak) {
                toggleMagic('lightLeak')
              }
            }}
          />
        </Frame>

        {/* Controls */}
        <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-center">
          {/* Mobile: Open bottom sheet */}
          <button
            onClick={() => setBottomSheetOpen(true)}
            className="md:hidden w-full px-8 py-3 bg-warm-gold-DEFAULT text-warm-burgundy-DEFAULT font-semibold rounded-full min-h-[44px]"
            aria-label="Open magic touches menu"
          >
            Magic Touches
          </button>

          {/* Desktop: Sidebar */}
          <div className="hidden md:flex gap-2">
            {toggles.map((toggle) => {
              const Icon = toggle.icon
              const isActive = magicToggles[toggle.key]
              return (
                <motion.button
                  key={toggle.key}
                  onClick={() => toggleMagic(toggle.key)}
                  className={`
                    px-4 py-2 rounded-full flex items-center gap-2
                    transition-colors
                    ${isActive 
                      ? 'bg-warm-gold-DEFAULT text-warm-burgundy-DEFAULT' 
                      : 'bg-warm-burgundy-light text-warm-brown-light hover:bg-warm-burgundy-light/80'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={toggle.description}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{toggle.label}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Continue button */}
          <motion.button
            onClick={() => setCurrentScene('export')}
            className="w-full md:w-auto px-8 py-3 bg-warm-gold-DEFAULT text-warm-burgundy-DEFAULT font-semibold rounded-full min-h-[44px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Create and export your memory"
          >
            Create Memory
          </motion.button>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <BottomSheet
        isOpen={bottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
        title="Magic Touches"
      >
        <div className="space-y-3">
          {toggles.map((toggle) => {
            const Icon = toggle.icon
            const isActive = magicToggles[toggle.key]
            return (
              <motion.button
                key={toggle.key}
                onClick={() => {
                  toggleMagic(toggle.key)
                  if (toggle.key === 'lightLeak') {
                    // Light leak is one-time, close sheet after triggering
                    setTimeout(() => setBottomSheetOpen(false), 500)
                  }
                }}
                className={`
                  w-full px-4 py-3 rounded-xl flex items-center justify-between
                  transition-colors
                  ${isActive 
                    ? 'bg-warm-gold-DEFAULT text-warm-burgundy-DEFAULT' 
                    : 'bg-warm-burgundy-light/50 text-warm-brown-light'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">{toggle.label}</div>
                    <div className="text-xs opacity-75">{toggle.description}</div>
                  </div>
                </div>
                {isActive && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-warm-burgundy-DEFAULT"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </BottomSheet>
    </motion.div>
  )
}

