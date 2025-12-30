import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { lightLeakSweep } from '../utils/animations'

interface LightLeakProps {
  active: boolean
  onComplete?: () => void
}

export const LightLeak: React.FC<LightLeakProps> = ({ active, onComplete }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    if (active && !shouldAnimate) {
      setShouldAnimate(true)
      const timer = setTimeout(() => {
        setShouldAnimate(false)
        onComplete?.()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [active, shouldAnimate, onComplete])

  return (
    <AnimatePresence>
      {shouldAnimate && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-30"
          variants={lightLeakSweep}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(212, 175, 55, 0.4) 50%, transparent 70%)',
              transform: 'skewX(-20deg)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

LightLeak.displayName = 'LightLeak'

