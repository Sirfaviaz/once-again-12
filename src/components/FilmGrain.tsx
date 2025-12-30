import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeIn } from '../utils/animations'

interface FilmGrainProps {
  active: boolean
}

export const FilmGrain: React.FC<FilmGrainProps> = ({ active }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute inset-0 pointer-events-none film-grain z-10"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
        />
      )}
    </AnimatePresence>
  )
}

FilmGrain.displayName = 'FilmGrain'

