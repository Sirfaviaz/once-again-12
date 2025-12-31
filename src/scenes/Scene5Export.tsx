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

    try {
      // Get the frame element immediately
      setExportProgress(15)
      const frameElement = frameRef.current.querySelector('#memory-frame') as HTMLElement
      if (!frameElement) {
        throw new Error('Frame element not found')
      }

      // Hide export buttons before cloning
      const exportHideElements = frameElement.querySelectorAll('.export-hide')
      exportHideElements.forEach((el) => {
        (el as HTMLElement).style.display = 'none'
      })

      // Create export container with proper styling (completely hidden)
      const exportContainer = document.createElement('div')
      exportContainer.id = 'export-container'
      exportContainer.style.position = 'fixed'
      exportContainer.style.left = '0'
      exportContainer.style.top = '0'
      exportContainer.style.zIndex = '-1'
      exportContainer.style.visibility = 'hidden' // Hidden but still rendered for html2canvas
      exportContainer.style.pointerEvents = 'none'
      exportContainer.style.width = `${frameElement.offsetWidth}px`
      exportContainer.style.height = `${frameElement.offsetHeight}px`
      exportContainer.style.backgroundColor = '#F5F1E8'
      exportContainer.style.overflow = 'hidden'
      
      // Clone the frame with all styles and content
      const clonedFrame = frameElement.cloneNode(true) as HTMLElement
      
      // Function to copy all computed styles to inline styles
      const copyAllStyles = (source: HTMLElement, target: HTMLElement) => {
        const computed = window.getComputedStyle(source)
        const styleProps = [
          'width', 'height', 'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
          'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
          'border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
          'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 
          'borderBottomLeftRadius', 'borderBottomRightRadius',
          'boxShadow', 'backgroundColor', 'backgroundImage', 'backgroundSize', 
          'backgroundRepeat', 'backgroundPosition', 'backgroundBlendMode',
          'color', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'textAlign',
          'display', 'flexDirection', 'justifyContent', 'alignItems', 'flex',
          'position', 'top', 'left', 'right', 'bottom', 'zIndex', 'opacity',
          'transform', 'overflow', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight'
        ]
        
        styleProps.forEach(prop => {
          const value = computed.getPropertyValue(prop) || (computed as any)[prop]
          if (value && value !== 'none' && value !== 'normal' && value !== 'auto') {
            ;(target.style as any)[prop] = value
          }
        })
        
        // ALWAYS explicitly set background color if it's paper (override everything)
        if (source.classList.contains('bg-paper-DEFAULT') || source.classList.contains('paper-texture')) {
          target.style.backgroundColor = '#F5F1E8'
          target.style.setProperty('background-color', '#F5F1E8', 'important')
        }
        
        // Copy background image for paper texture
        if (source.classList.contains('paper-texture')) {
          const bgImage = computed.backgroundImage
          if (bgImage && bgImage !== 'none') {
            target.style.backgroundImage = bgImage
            target.style.backgroundSize = computed.backgroundSize || '4px 4px'
            target.style.backgroundRepeat = computed.backgroundRepeat || 'repeat'
          }
        }
      }
      
      // Copy styles for the main frame
      copyAllStyles(frameElement, clonedFrame)
      
      // CRITICAL: Force background color on the frame - override everything
      const existingStyle = clonedFrame.getAttribute('style') || ''
      clonedFrame.setAttribute('style', `${existingStyle}; background-color: #F5F1E8 !important; margin: 0;`)
      clonedFrame.style.cssText = `${clonedFrame.style.cssText}; background-color: #F5F1E8 !important;`
      clonedFrame.style.backgroundColor = '#F5F1E8'
      clonedFrame.style.margin = '0'
      
      // Also set as data attribute for fallback
      clonedFrame.setAttribute('data-bg-color', '#F5F1E8')
      
      // Copy styles for all child elements
      const sourceElements = frameElement.querySelectorAll('*')
      const clonedElements = clonedFrame.querySelectorAll('*')
      
      sourceElements.forEach((sourceEl, index) => {
        const clonedEl = clonedElements[index] as HTMLElement
        if (clonedEl && sourceEl instanceof HTMLElement) {
          copyAllStyles(sourceEl, clonedEl)
        }
      })
      
      // Ensure background color is set on the container too
      exportContainer.style.backgroundColor = '#F5F1E8'
      
      // Hide any export-hide elements in the clone
      const clonedHideElements = clonedFrame.querySelectorAll('.export-hide')
      clonedHideElements.forEach((el) => {
        (el as HTMLElement).style.display = 'none'
      })
      
      // Handle textareas - hide empty ones and remove placeholders
      const textareas = clonedFrame.querySelectorAll('textarea')
      textareas.forEach((textarea) => {
        // Remove placeholder attribute completely
        textarea.removeAttribute('placeholder')
        
        if (!textarea.value || textarea.value.trim() === '') {
          // Hide empty textareas - they show placeholder text in export
          textarea.style.display = 'none'
          textarea.style.visibility = 'hidden'
          textarea.style.opacity = '0'
          textarea.style.height = '0'
          textarea.style.padding = '0'
          textarea.style.margin = '0'
        } else {
          // For textareas with content, ensure placeholder doesn't show
          textarea.removeAttribute('placeholder')
        }
      })
      
      // Ensure fonts are loaded before export (non-blocking)
      setExportProgress(50)
      // Don't wait for fonts if they're already loading, proceed in parallel
      const fontPromise = document.fonts.ready.catch(() => {})
      
      // Additional style fixes for specific elements
      setExportProgress(60)
      const allElements = clonedFrame.querySelectorAll('*')
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement
        const computed = window.getComputedStyle(htmlEl)
        
        // Remove ALL filters from images to prevent whitish tint
        if (htmlEl.tagName === 'IMG') {
          htmlEl.style.filter = 'none'
          htmlEl.style.removeProperty('filter')
        }
        
        // CRITICAL: Remove any white/light overlays that might be on top of the image
        // Check if element is positioned absolutely/fixed and might be an overlay
        const position = computed.position
        const bgColor = computed.backgroundColor
        const opacity = parseFloat(computed.opacity)
        
        // If element is absolutely/fixed positioned and has white/light background, make it transparent
        if ((position === 'absolute' || position === 'fixed') && 
            htmlEl.tagName !== 'IMG' && 
            !htmlEl.id.includes('memory-frame')) {
          // Check if background is white or very light
          const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
          if (rgbMatch) {
            const r = parseInt(rgbMatch[1])
            const g = parseInt(rgbMatch[2])
            const b = parseInt(rgbMatch[3])
            // If it's white/very light (RGB > 240) and has opacity, it might be an overlay
            if (r > 240 && g > 240 && b > 240 && opacity > 0.1) {
              // Check if it's positioned over the image area (has inset or covers image)
              const top = computed.top
              const left = computed.left
              const right = computed.right
              const bottom = computed.bottom
              if ((top === '0px' || left === '0px' || right === '0px' || bottom === '0px') ||
                  htmlEl.classList.contains('inset-0') ||
                  htmlEl.style.top === '0px' || htmlEl.style.left === '0px') {
                // This is likely an overlay - hide it
                htmlEl.style.display = 'none'
                htmlEl.style.visibility = 'hidden'
                htmlEl.style.opacity = '0'
              }
            }
          }
        }
        
        // Remove backdrop-blur which can create whitish appearance
        if (computed.backdropFilter !== 'none' || htmlEl.classList.contains('backdrop-blur')) {
          htmlEl.style.backdropFilter = 'none'
          htmlEl.style.removeProperty('backdrop-filter')
        }
        
        // Remove any high z-index overlays that might be on top (except the frame itself)
        const zIndex = computed.zIndex
        if (zIndex !== 'auto' && parseInt(zIndex) > 10 && htmlEl.id !== 'memory-frame') {
          // Check if it's positioned and might be an overlay
          if (position === 'absolute' || position === 'fixed' || position === 'relative') {
            // If it has a light/white background, it's likely an unwanted overlay
            const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
            if (rgbMatch) {
              const r = parseInt(rgbMatch[1])
              const g = parseInt(rgbMatch[2])
              const b = parseInt(rgbMatch[3])
              if (r > 200 && g > 200 && b > 200) {
                // Hide light overlays with high z-index
                htmlEl.style.display = 'none'
                htmlEl.style.visibility = 'hidden'
              }
            }
          }
        }
        
        // Remove any motion.div wrappers that framer-motion might have added
        if (htmlEl.classList.contains('framer-motion') || 
            htmlEl.getAttribute('data-framer-name') ||
            (htmlEl.tagName === 'DIV' && htmlEl.children.length === 1 && htmlEl.querySelector('img'))) {
          // Check if this wrapper has a background that might show
          const wrapperBg = computed.backgroundColor
          const wrapperRgbMatch = wrapperBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
          if (wrapperRgbMatch) {
            const r = parseInt(wrapperRgbMatch[1])
            const g = parseInt(wrapperRgbMatch[2])
            const b = parseInt(wrapperRgbMatch[3])
            if (r > 240 && g > 240 && b > 240) {
              htmlEl.style.backgroundColor = 'transparent'
            }
          }
        }
        
        // If element has paper-DEFAULT background class, ensure color is set
        if (htmlEl.classList.contains('bg-paper-DEFAULT') || 
            htmlEl.classList.contains('paper-texture')) {
          htmlEl.style.backgroundColor = '#F5F1E8'
        }
        
        // Ensure photo container divs have transparent background (not white)
        if (htmlEl.tagName === 'DIV' && 
            (htmlEl.classList.contains('flex-1') || 
             htmlEl.classList.contains('relative') && htmlEl.querySelector('img'))) {
          // Check if this is a photo container (has img child or is the photo area)
          const hasImage = htmlEl.querySelector('img')
          if (hasImage || htmlEl.id === 'memory-frame') {
            // Only set transparent if it's not the main frame
            if (htmlEl.id !== 'memory-frame') {
              htmlEl.style.backgroundColor = 'transparent'
            }
          }
        }
        
        // Ensure text colors are preserved
        if (htmlEl.classList.contains('text-warm-burgundy-DEFAULT')) {
          htmlEl.style.color = '#2D1B1E'
        }
        if (htmlEl.classList.contains('text-warm-brown-DEFAULT')) {
          htmlEl.style.color = '#8B6F47'
        }
        if (htmlEl.classList.contains('text-warm-brown-light')) {
          htmlEl.style.color = '#A0826D'
        }
      })
      
      // Copy all images and ensure they're loaded
      setExportProgress(70)
      const images = clonedFrame.querySelectorAll('img')
      
      // CRITICAL: Ensure all parent containers of images have transparent backgrounds
      images.forEach((img) => {
        let parent = img.parentElement
        while (parent && parent !== clonedFrame) {
          const parentComputed = window.getComputedStyle(parent)
          const parentBg = parentComputed.backgroundColor
          const parentRgbMatch = parentBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
          
          if (parentRgbMatch) {
            const r = parseInt(parentRgbMatch[1])
            const g = parseInt(parentRgbMatch[2])
            const b = parseInt(parentRgbMatch[3])
            // If parent has white/very light background, make it transparent
            if (r > 240 && g > 240 && b > 240) {
              (parent as HTMLElement).style.backgroundColor = 'transparent'
            }
          }
          
          // Also check inline styles
          const inlineBg = (parent as HTMLElement).style.backgroundColor
          if (inlineBg && (inlineBg.includes('255') || inlineBg.includes('white') || inlineBg.includes('#fff'))) {
            (parent as HTMLElement).style.backgroundColor = 'transparent'
          }
          
          parent = parent.parentElement
        }
      })
      
      await Promise.all(
        Array.from(images).map((img) => {
          return new Promise<void>((resolve) => {
            if (img.complete) {
              resolve()
            } else {
              img.onload = () => resolve()
              img.onerror = () => resolve()
            }
          })
        })
      )
      
      exportContainer.appendChild(clonedFrame)
      document.body.appendChild(exportContainer)

      // Wait for fonts to be ready and rendering to complete
      setExportProgress(75)
      await Promise.all([
        fontPromise,
        new Promise((resolve) => setTimeout(resolve, 200))
      ])
      
      setExportProgress(80)
      
      // Force multiple reflows to ensure all styles are computed
      void exportContainer.offsetHeight
      void clonedFrame.offsetHeight
      void clonedFrame.offsetWidth
      
      // FINAL background color enforcement - use cssText for maximum override
      clonedFrame.style.cssText = `${clonedFrame.style.cssText}; background-color: #F5F1E8 !important;`
      clonedFrame.style.setProperty('background-color', '#F5F1E8', 'important')
      clonedFrame.style.backgroundColor = '#F5F1E8'
      
      exportContainer.style.cssText = `${exportContainer.style.cssText}; background-color: #F5F1E8 !important;`
      exportContainer.style.setProperty('background-color', '#F5F1E8', 'important')
      exportContainer.style.backgroundColor = '#F5F1E8'
      
      // Force background on ALL elements that should have paper color
      const paperElements = clonedFrame.querySelectorAll('.bg-paper-DEFAULT, .paper-texture, #memory-frame')
      paperElements.forEach((el) => {
        const htmlEl = el as HTMLElement
        htmlEl.style.cssText = `${htmlEl.style.cssText}; background-color: #F5F1E8 !important;`
        htmlEl.style.setProperty('background-color', '#F5F1E8', 'important')
        htmlEl.style.backgroundColor = '#F5F1E8'
      })
      
      // Also check all divs and set background if they have paper classes
      const allDivs = clonedFrame.querySelectorAll('div')
      allDivs.forEach((div) => {
        if (div.classList.contains('bg-paper-DEFAULT') || 
            div.classList.contains('paper-texture') ||
            div.id === 'memory-frame') {
          div.style.cssText = `${div.style.cssText}; background-color: #F5F1E8 !important;`
          div.style.backgroundColor = '#F5F1E8'
        }
      })

      // One final check - verify background is visible
      const finalCheck = window.getComputedStyle(clonedFrame)
      if (!finalCheck.backgroundColor || finalCheck.backgroundColor === 'rgba(0, 0, 0, 0)' || finalCheck.backgroundColor === 'transparent') {
        // Force it one more time
        clonedFrame.style.backgroundColor = '#F5F1E8'
        clonedFrame.style.setProperty('background-color', '#F5F1E8', 'important')
      }
      
      // Make container visible to html2canvas (it's behind everything with z-index -1)
      exportContainer.style.visibility = 'visible'
      
      // Export with proper options
      setExportProgress(85)
      const dataUrl = await exportToImage('export-container')
      
      // Hide it again immediately after capture
      exportContainer.style.visibility = 'hidden'
      
      // Download
      setExportProgress(100)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      downloadImage(dataUrl, `once-again-12-${timestamp}.png`)
      
      // Small delay to show 100% before hiding
      await new Promise((resolve) => setTimeout(resolve, 200))

      // Restore export buttons visibility
      exportHideElements.forEach((el) => {
        (el as HTMLElement).style.display = ''
      })

      // Cleanup
      document.body.removeChild(exportContainer)

      setIsExporting(false)
      setIsSuccess(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    } catch (error) {
      console.error('Export failed:', error)
      setIsExporting(false)
      setExportProgress(0)
      alert('Failed to export image. Please try again.')
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
              className="absolute inset-0 bg-warm-burgundy-DEFAULT/80 backdrop-blur-sm rounded-sm flex items-center justify-center z-50"
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

