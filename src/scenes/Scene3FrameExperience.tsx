import React from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { Frame } from '../components/Frame'
import { PhotoEditor } from '../components/PhotoEditor'
import { TextEditor } from '../components/TextEditor'
import { fadeIn } from '../utils/animations'

export const Scene3FrameExperience: React.FC = () => {
  const { photo, setCurrentScene } = useApp()

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

          {/* Magic effects - disabled */}
        </Frame>

        {/* Create Memory button */}
        <motion.div
          className="mt-6 w-full md:w-auto md:mx-auto flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
        <motion.button
            onClick={() => setCurrentScene('export')}
            className="relative px-12 py-4 bg-warm-gold-DEFAULT text-warm-burgundy-DEFAULT font-bold text-xl rounded-full shadow-2xl min-h-[44px] overflow-hidden group"
            whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
            initial={{ scale: 0.9 }}
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 10px 30px rgba(212, 175, 55, 0.4)',
                '0 15px 40px rgba(212, 175, 55, 0.6)',
                '0 10px 30px rgba(212, 175, 55, 0.4)',
              ],
            }}
            transition={{
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
            aria-label="Create your memory"
        >
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 bg-warm-gold-light rounded-full opacity-0 group-hover:opacity-50 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 1,
              }}
            />
            
            {/* Button text */}
            <span className="relative z-10">Create Memory</span>
        </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

