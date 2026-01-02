import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { Frame } from '../components/Frame'
import { PhotoEditor } from '../components/PhotoEditor'
import { TextEditor } from '../components/TextEditor'
import { fadeIn, checkmarkDraw, scaleIn } from '../utils/animations'
import { Confetti } from '../components/Confetti'

const nostalgicQuotes = [
  "Capturing moments, one memory at a time...",
  "Preserving the past, embracing the present...",
  "Where time stands still, memories live on...",
  "Creating your timeless keepsake...",
]

export const Scene5Export: React.FC = () => {
  const { photo, frameSettings, setCurrentScene, setPhoto } = useApp()
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

  const handleRetake = () => {
    setPhoto(null)
    setCurrentScene('upload')
  }

  const handleExport = async () => {
    if (!frameRef.current) {
      console.error('[export] frameRef missing')
      alert('Export failed: frame not ready')
      return
    }

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

    let prevStyle: { width: string; height: string; minHeight: string } | null = null

    try {
      // Debug info: capture state
      const frameRect = frameElement.getBoundingClientRect()
      console.warn('[export] frame rect', {
        width: frameRect.width,
        height: frameRect.height,
        bg: getComputedStyle(frameElement).backgroundColor,
      })

      // Ensure all images inside the frame are loaded
      const imgs = Array.from(frameElement.querySelectorAll('img'))
      if (imgs.length === 0) {
        console.error('[export] no images found inside memory-frame')
      } else {
        imgs.forEach((img, idx) => {
          console.warn('[export] img', idx, {
            complete: img.complete,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            srcPreview: img.src?.slice(0, 120),
          })
        })
      }
      await Promise.all(
        imgs.map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete && img.naturalWidth > 0) return resolve(null)
              img.onload = () => resolve(null)
              img.onerror = () => resolve(null)
            })
        )
      )

      // Guard against zero-sized captures by enforcing a temporary size if needed
      const rect = frameElement.getBoundingClientRect()
      const needsSize = rect.width < 10 || rect.height < 10
      prevStyle = needsSize
        ? {
            width: frameElement.style.width,
            height: frameElement.style.height,
            minHeight: frameElement.style.minHeight,
          }
        : null
      if (needsSize) {
        frameElement.style.width = '1200px'
        frameElement.style.height = '1600px'
        frameElement.style.minHeight = '1600px'
      }
      frameElement.style.backgroundColor = '#F5F1E8'

      setExportProgress(70)
      // Capture exactly as shown; no cloning or style rewriting
      const frameCanvas = document.createElement('canvas')
      const scale = 2
      const targetWidth = 1200
      const targetHeight = 1600
      frameCanvas.width = targetWidth * scale
      frameCanvas.height = targetHeight * scale
      const ctx = frameCanvas.getContext('2d')
      if (!ctx) throw new Error('Canvas 2D not supported')

      // Helper to set font
      const setFont = (sizePx: number, weight = 400, italic = false) => {
        ctx.font = `${italic ? 'italic ' : ''}${weight} ${sizePx * scale}px 'Playfair Display', serif`
      }

      const wrapAndDrawText = (
        context: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight = 24 * scale
      ) => {
        const words = text.split(' ')
        let line = ''
        let cursorY = y
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' '
          const metrics = context.measureText(testLine)
          if (metrics.width > maxWidth && n > 0) {
            context.fillText(line.trim(), x, cursorY)
            line = words[n] + ' '
            cursorY += lineHeight
          } else {
            line = testLine
          }
        }
        if (line.trim().length > 0) {
          context.fillText(line.trim(), x, cursorY)
        }
      }

      // Fill background
      ctx.fillStyle = '#F5F1E8'
      ctx.fillRect(0, 0, frameCanvas.width, frameCanvas.height)

      // Header (match preview dusty/gold tone)
      ctx.fillStyle = '#8B6F47'
      setFont(64, 700)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText("Once Again '12", (targetWidth * scale) / 2, 48 * scale)

      ctx.fillStyle = '#8B6F47'
      setFont(24, 400, true)
      ctx.fillText('Where memories meet the present', (targetWidth * scale) / 2, 118 * scale)

      // Image area
      const imageArea = {
        x: 80 * scale,
        y: 150 * scale,
        width: (targetWidth - 160) * scale,
        height: (targetHeight - 400) * scale,
      }

      const imgEl = imgs[0]
      if (imgEl) {
        const img = new Image()
        img.src = imgEl.src
        await new Promise((resolve) => {
          if (img.complete && img.naturalWidth > 0) return resolve(null)
          img.onload = () => resolve(null)
          img.onerror = () => resolve(null)
        })

        const iw = img.naturalWidth
        const ih = img.naturalHeight
        if (iw > 0 && ih > 0) {
          const scaleFit = Math.min(imageArea.width / iw, imageArea.height / ih)
          const drawW = iw * scaleFit
          const drawH = ih * scaleFit
          const dx = imageArea.x + (imageArea.width - drawW) / 2
          const dy = imageArea.y + (imageArea.height - drawH) / 2
          ctx.drawImage(img, dx, dy, drawW, drawH)
        }
      }

      // Footer
      const footerBaseY = (targetHeight - 240) * scale
      const footerLineGap = 30 * scale

      const footerText = frameSettings.text && frameSettings.text.trim().length > 0 ? frameSettings.text : ''
      if (footerText) {
        ctx.fillStyle = '#2D1B1E'
        setFont(18, 500, true)
        wrapAndDrawText(ctx, footerText, (targetWidth * scale) / 2, footerBaseY, targetWidth * 0.8 * scale, 28 * scale)
      }

      ctx.fillStyle = '#8B6F47'
      setFont(22, 700)
      ctx.fillText("Once Again '12", (targetWidth * scale) / 2, (footerBaseY + footerLineGap) )

      ctx.fillStyle = '#8B6F47'
      setFont(18, 500)
      ctx.fillText('ICS Ottapalam', (targetWidth * scale) / 2, (footerBaseY + footerLineGap + 32 * scale))

      ctx.fillStyle = '#8B6F47'
      setFont(18, 500, true)
      ctx.fillText('Meet up on 5th jan 2026', (targetWidth * scale) / 2, (footerBaseY + footerLineGap + 32 * scale + 30 * scale))

      const dataUrl = frameCanvas.toDataURL('image/jpeg', 1)
      console.warn('[export] dataUrl length', dataUrl.length, 'prefix', dataUrl.slice(0, 40))

      setExportProgress(100)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      const link = document.createElement('a')
      link.download = `once-again-12-${timestamp}.jpg`
      link.href = dataUrl
      link.click()
      
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
      // Restore any temporary sizing
      if (frameElement && prevStyle) {
        frameElement.style.width = prevStyle.width
        frameElement.style.height = prevStyle.height
        frameElement.style.minHeight = prevStyle.minHeight
      }
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
        <div className="flex justify-end mb-4">
          <button
            onClick={handleRetake}
            className="px-4 py-2 rounded-full bg-warm-brown-light/30 text-warm-gold-DEFAULT font-semibold shadow-md hover:bg-warm-brown-light/50 transition-colors export-hide"
          >
            Retake photo
          </button>
        </div>

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

