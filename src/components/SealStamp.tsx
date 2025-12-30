import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { stampDrop } from '../utils/animations'

interface SealStampProps {
  active: boolean
}

export const SealStamp: React.FC<SealStampProps> = ({ active }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute top-8 right-8 pointer-events-none z-20"
          variants={stampDrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="relative">
            <div
              className="px-4 py-2 rounded-md border-2 border-warm-burgundy-DEFAULT bg-paper-DEFAULT"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '14px',
                fontWeight: 600,
                color: '#2D1B1E',
                transform: 'rotate(-5deg)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              Once Again '12
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

