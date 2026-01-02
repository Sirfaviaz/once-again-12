import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { Frame } from '../components/Frame'
import { PhotoEditor } from '../components/PhotoEditor'
import { TextEditor } from '../components/TextEditor'
import { useExport } from '../hooks/useExport'
import { fadeIn, checkmarkDraw, scaleIn } from '../utils/animations'
import { Confetti } from '../components/Confetti'

const nostalgicQuotes = [
  "Capturing moments, one memory at a time...",
  "Preserving the past, embracing the present...",
  "Where time stands still, memories live on...",
  "Creating your timeless keepsake...",
]

export const Scene5Export: React.FC = () => {
  const { photo } = useApp()
  const { exportToImage, downloadImage } = useExport()
  const [isExporting, setIsExporting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [exportProgress, setExportProgress] = useState(0)
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isExporting) {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % nostalgicQuotes.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isExporting])

  // Auto-start export when component mounts
  useEffect(() => {
    if (frameRef.current && !isExporting && !isSuccess) {
      // Small delay to ensure frame is rendered
      const timer = setTimeout(() => {
        handleExport()
      }, 300)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  const handleExport = async () => {
    if (!frameRef.current) return

    setIsExporting(true)
    setExportProgress(0)

    // Use the live frame element directly to capture exactly what the user sees
    const frameElement = frameRef.current.querySelector('#memory-frame') as HTMLElement
    if (!frameElement) {
      setIsExporting(false)
      return
    }

    // Hide export-only UI
    const exportHideElements = frameElement.querySelectorAll('.export-hide')
    exportHideElements.forEach((el) => ((el as HTMLElement).style.display = 'none'))

    try {
      setExportProgress(70)
      // Capture exactly as shown; no cloning or style rewriting
      const dataUrl = await exportToImage('memory-frame', 'image/jpeg')

      setExportProgress(100)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      downloadImage(dataUrl, `once-again-12-${timestamp}.jpg`)

      // Small delay to show 100% before hiding
      await new Promise((resolve) => setTimeout(resolve, 150))

      setIsExporting(false)
      setIsSuccess(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    } catch (error) {
      console.error('Export failed:', error)
      setIsExporting(false)
      setExportProgress(0)
      alert('Failed to export image. Please try again.')
    } finally {
      // Restore export-only UI
      exportHideElements.forEach((el) => ((el as HTMLElement).style.display = ''))
    }
  }

  const handleStartOver = () => {
    // Full page reload to ensure clean state and return to landing page
    window.location.reload()
  }

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

      {/* Confetti */}
      <Confetti trigger={showConfetti} />

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Frame */}
        <motion.div
          ref={frameRef}
          className="relative"
          animate={{
            scale: isExporting ? 0.95 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Frame>
            <PhotoEditor />
            <TextEditor />

            {/* Magic effects - disabled */}
          </Frame>

          {/* Loading overlay on frame */}
          {isExporting && (
            <motion.div
              className="absolute inset-0 bg-warm-burgundy-DEFAULT/80 backdrop-blur-sm rounded-sm flex items-center justify-center z-50 export-hide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                {/* Spinner */}
                <motion.div
                  className="w-16 h-16 border-4 border-warm-gold-DEFAULT border-t-transparent rounded-full mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <motion.p
                  className="text-warm-gold-DEFAULT text-lg font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Creating your memory...
                </motion.p>
              </div>
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {isExporting && (
            <motion.div
              key="loading"
              className="mt-6 text-center w-full max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-warm-burgundy-light/30 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-warm-gold-DEFAULT rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${exportProgress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
                <motion.p
                  className="text-warm-gold-DEFAULT text-sm mt-2 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {exportProgress}%
                </motion.p>
              </div>

              {/* Loading Quote */}
              <motion.p
                key={currentQuote}
                className="text-warm-gold-DEFAULT text-lg md:text-xl font-light"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                {nostalgicQuotes[currentQuote]}
              </motion.p>
            </motion.div>
          )}

          {isSuccess && (
            <motion.div
              key="success"
              className="mt-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Checkmark */}
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warm-gold-DEFAULT mb-4"
                variants={scaleIn}
                initial="hidden"
                animate="visible"
              >
                <motion.svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-warm-burgundy-DEFAULT"
                >
                  <motion.path
                    d="M20 6L9 17l-5-5"
                    variants={checkmarkDraw}
                    initial="hidden"
                    animate="visible"
                  />
                </motion.svg>
              </motion.div>

              <motion.p
                className="text-warm-gold-DEFAULT text-xl font-semibold mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Memory saved.
              </motion.p>

              <motion.button
                onClick={handleStartOver}
                className="relative px-12 py-4 bg-warm-burgundy-light text-warm-gold-DEFAULT font-bold text-lg rounded-full shadow-2xl min-h-[44px] overflow-hidden group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 10px 30px rgba(74, 47, 47, 0.4)',
                    '0 15px 40px rgba(74, 47, 47, 0.6)',
                    '0 10px 30px rgba(74, 47, 47, 0.4)',
                  ],
                }}
                transition={{ 
                  opacity: { delay: 0.7, duration: 0.4 },
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
                aria-label="Create another memory"
              >
                {/* Animated background glow */}
                <motion.div
                  className="absolute inset-0 bg-warm-gold-DEFAULT/30 rounded-full opacity-0 group-hover:opacity-50 blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 2.5,
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
                    repeatDelay: 1.5,
                  }}
                />
                
                {/* Button text */}
                <span className="relative z-10">Create Another Memory</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

