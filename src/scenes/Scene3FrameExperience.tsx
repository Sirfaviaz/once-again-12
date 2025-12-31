import React from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { Frame } from '../components/Frame'
import { PhotoEditor } from '../components/PhotoEditor'
import { TextEditor } from '../components/TextEditor'
import { FilmGrain } from '../components/FilmGrain'
import { WarmTone } from '../components/WarmTone'
import { LightLeak } from '../components/LightLeak'
import { fadeIn } from '../utils/animations'

export const Scene3FrameExperience: React.FC = () => {
  const { photo, magicToggles, setCurrentScene } = useApp()

  if (!photo) {
    return null
  }

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
          {/* Photo editor */}
          <PhotoEditor />

          {/* Text editor */}
          <TextEditor />

          {/* Magic effects - always enabled */}
          <FilmGrain active={magicToggles.filmGrain} />
          <WarmTone active={magicToggles.warmTone} />
          <LightLeak active={false} onComplete={() => {}} />
        </Frame>

        {/* Create Memory button */}
        <motion.button
          onClick={() => setCurrentScene('export')}
          className="mt-6 w-full md:w-auto md:mx-auto block px-12 py-4 bg-warm-gold-DEFAULT text-warm-burgundy-DEFAULT font-bold text-xl rounded-full shadow-lg min-h-[44px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Create your memory"
        >
          Create Memory
        </motion.button>
      </div>
    </motion.div>
  )
}

