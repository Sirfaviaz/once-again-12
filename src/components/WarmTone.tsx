import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeIn, fadeOut } from '../utils/animations'

interface WarmToneProps {
  active: boolean
}

export const WarmTone: React.FC<WarmToneProps> = ({ active }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(139, 111, 71, 0.1) 100%)',
            mixBlendMode: 'overlay',
          }}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
        />
      )}
    </AnimatePresence>
  )
}

WarmTone.displayName = 'WarmTone'

