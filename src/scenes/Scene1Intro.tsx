import React from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { DustParticles } from '../components/DustParticles'
import { blurToFocus, slideUp, ripple, zoomOut } from '../utils/animations'

export const Scene1Intro: React.FC = () => {
  const { setCurrentScene } = useApp()

  const handleCreateMemory = () => {
    setCurrentScene('upload')
  }

  return (
    <motion.div
      className="relative h-full w-full flex items-center justify-center"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={zoomOut}
    >
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-warm-burgundy-dark via-warm-burgundy-DEFAULT to-warm-brown-dark" />
      
      {/* Dust particles */}
      <DustParticles />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Main title */}
        <motion.h1
          className="text-6xl md:text-8xl font-serif font-bold text-warm-gold-DEFAULT mb-4"
          variants={blurToFocus}
        >
          Once Again '12
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-xl md:text-2xl text-warm-brown-light mb-12 font-light"
          variants={slideUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          Where memories meet the present
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={handleCreateMemory}
          className="relative px-8 py-4 bg-warm-gold-DEFAULT text-warm-burgundy-DEFAULT font-semibold text-lg rounded-full overflow-hidden group"
          variants={ripple}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          aria-label="Create your memory"
        >
          <span className="relative z-10">Create Your Memory</span>
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-warm-gold-light rounded-full opacity-0 group-hover:opacity-50 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.button>
      </div>
    </motion.div>
  )
}

