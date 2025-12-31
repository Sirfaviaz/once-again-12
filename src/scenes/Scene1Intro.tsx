import React from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { DustParticles } from '../components/DustParticles'
import { blurToFocus, slideUp, zoomOut } from '../utils/animations'

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
          className="relative px-12 py-5 bg-warm-gold-DEFAULT text-warm-burgundy-DEFAULT font-bold text-xl rounded-full shadow-2xl overflow-hidden group"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 10px 30px rgba(212, 175, 55, 0.4)',
              '0 15px 40px rgba(212, 175, 55, 0.7)',
              '0 10px 30px rgba(212, 175, 55, 0.4)',
            ],
          }}
          transition={{
            opacity: { delay: 0.8, duration: 0.6 },
            y: { delay: 0.8, duration: 0.6, ease: 'easeOut' },
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Create your memory"
        >
          {/* Animated background glow */}
          <motion.div
            className="absolute inset-0 bg-warm-gold-light rounded-full opacity-0 group-hover:opacity-50 blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 1.5,
            }}
          />
          
          {/* Pulsing ring effect */}
          <motion.div
            className="absolute inset-0 border-2 border-warm-gold-light rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Button text */}
          <span className="relative z-10">Create Your Memory</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

