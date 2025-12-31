import React, { useState, useRef, useEffect } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { RotateCcw } from 'lucide-react'

export const PhotoEditor: React.FC = () => {
  const { photo, frameSettings, updateFrameSettings } = useApp()
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 })

  // Calculate drag constraints based on container and image size
  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current && imageRef.current) {
        const container = containerRef.current
        const image = imageRef.current
        
        const containerRect = container.getBoundingClientRect()
        const imageRect = image.getBoundingClientRect()
        
        // Calculate the bounds - image should stay within container
        const scale = frameSettings.photoScale
        const imageWidth = imageRect.width * scale
        const imageHeight = imageRect.height * scale
        
        // Only constrain if image is larger than container
        const maxX = imageWidth > containerRect.width 
          ? Math.max(0, (imageWidth - containerRect.width) / 2)
          : 0
        const maxY = imageHeight > containerRect.height
          ? Math.max(0, (imageHeight - containerRect.height) / 2)
          : 0
        
        const newConstraints = {
          left: -maxX,
          right: maxX,
          top: -maxY,
          bottom: maxY,
        }
        
        setDragConstraints(newConstraints)

        // Constrain current position if it's out of bounds
        const constrainedX = Math.max(
          -maxX,
          Math.min(maxX, frameSettings.photoX)
        )
        const constrainedY = Math.max(
          -maxY,
          Math.min(maxY, frameSettings.photoY)
        )
        
        if (Math.abs(constrainedX - frameSettings.photoX) > 1 || 
            Math.abs(constrainedY - frameSettings.photoY) > 1) {
          updateFrameSettings({
            photoX: constrainedX,
            photoY: constrainedY,
          })
        }
      }
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(updateConstraints, 100)
    return () => clearTimeout(timeoutId)
  }, [frameSettings.photoScale, photo, updateFrameSettings]) // Only recalculate when scale or photo changes

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const newX = frameSettings.photoX + info.delta.x
    const newY = frameSettings.photoY + info.delta.y
    
    // Constrain the position
    const constrainedX = Math.max(
      dragConstraints.left,
      Math.min(dragConstraints.right, newX)
    )
    const constrainedY = Math.max(
      dragConstraints.top,
      Math.min(dragConstraints.bottom, newY)
    )
    
    updateFrameSettings({
      photoX: constrainedX,
      photoY: constrainedY,
    })
  }

  const handleReset = () => {
    updateFrameSettings({
      photoX: 0,
      photoY: 0,
      photoScale: 1,
    })
  }

  const handleDragStart = () => {
    // Drag started
  }

  const handleDragEnd = () => {
    // Drag ended
  }


  const handlePinchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      ;(e.currentTarget as HTMLElement).dataset.initialDistance = distance.toString()
      ;(e.currentTarget as HTMLElement).dataset.initialScale = frameSettings.photoScale.toString()
    }
  }

  const handlePinchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      
      const initialDistance = parseFloat(
        (e.currentTarget as HTMLElement).dataset.initialDistance || '0'
      )
      const initialScale = parseFloat(
        (e.currentTarget as HTMLElement).dataset.initialScale || '1'
      )

      if (initialDistance > 0) {
        const scaleChange = distance / initialDistance
        const newScale = Math.max(0.5, Math.min(3, initialScale * scaleChange))
        updateFrameSettings({ photoScale: newScale })
      }
    }
  }

  if (!photo) return null

  return (
    <div 
      ref={containerRef}
      className="relative w-full flex items-center justify-center"
      style={{
        width: '100%',
        maxWidth: '100%',
        minHeight: '300px',
        height: '100%',
        flex: '1 1 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        backgroundColor: 'transparent',
      }}
    >
      <motion.div
        className="relative cursor-move select-none"
        drag
        dragMomentum={false}
        dragElastic={0.2}
        dragConstraints={dragConstraints}
        onDrag={handleDrag}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTouchStart={handlePinchStart}
        onTouchMove={handlePinchMove}
        style={{
          x: frameSettings.photoX,
          y: frameSettings.photoY,
          touchAction: 'none',
          maxWidth: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animate={{
          x: frameSettings.photoX,
          y: frameSettings.photoY,
          scale: frameSettings.photoScale,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        <img
          ref={imageRef}
          src={photo}
          alt="Memory"
          className="w-auto h-auto object-contain"
          draggable={false}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
            boxSizing: 'border-box',
          }}
          onLoad={() => {
            // Auto-fit image to fill frame horizontally when first loaded
            if (containerRef.current && imageRef.current && frameSettings.photoScale === 1 && frameSettings.photoX === 0 && frameSettings.photoY === 0) {
              // Wait a bit for image to fully load and render
              setTimeout(() => {
                if (!containerRef.current || !imageRef.current) return
                
                const container = containerRef.current
                const image = imageRef.current
                
                // Get container dimensions
                const containerRect = container.getBoundingClientRect()
                
                // Get the current displayed image size (after CSS constraints)
                const imageRect = image.getBoundingClientRect()
                const currentDisplayWidth = imageRect.width
                const currentDisplayHeight = imageRect.height
                
                if (currentDisplayWidth === 0 || currentDisplayHeight === 0) return
                
                // Calculate scale to fill width (with minimal side padding - 2% on each side)
                const targetWidth = containerRect.width * 0.96 // 96% of container width
                const scaleX = targetWidth / currentDisplayWidth
                
                // Also check if height fits (don't exceed container height)
                const scaledHeight = currentDisplayHeight * scaleX
                const maxHeight = containerRect.height * 0.95
                const scaleY = scaledHeight > maxHeight ? maxHeight / currentDisplayHeight : scaleX
                
                // Use the scale that fills width but doesn't exceed height
                // This ensures image fills horizontally with minimal side space
                const newScale = Math.min(scaleX, scaleY)
                
                // Update scale and position (always apply, even if < 1, to ensure proper fit)
                updateFrameSettings({
                  photoScale: newScale,
                  photoX: 0,
                  photoY: 0,
                })
                
                // Recalculate constraints after scale update
                setTimeout(() => {
                  if (containerRef.current && imageRef.current) {
                    const updatedContainer = containerRef.current
                    const updatedImage = imageRef.current
                    
                    const containerRect = updatedContainer.getBoundingClientRect()
                    const imageRect = updatedImage.getBoundingClientRect()
                    const scaledWidth = imageRect.width * newScale
                    const scaledHeight = imageRect.height * newScale
                    
                    const maxX = Math.max(0, (scaledWidth - containerRect.width) / 2)
                    const maxY = Math.max(0, (scaledHeight - containerRect.height) / 2)
                    
                    setDragConstraints({
                      left: -maxX,
                      right: maxX,
                      top: -maxY,
                      bottom: maxY,
                    })
                  }
                }, 100)
              }, 100)
            } else {
              // Just recalculate constraints for existing image
              if (containerRef.current && imageRef.current) {
                const container = containerRef.current
                const image = imageRef.current
                
                const containerRect = container.getBoundingClientRect()
                const imageRect = image.getBoundingClientRect()
                
                const scale = frameSettings.photoScale
                const imageWidth = imageRect.width * scale
                const imageHeight = imageRect.height * scale
                
                const maxX = Math.max(0, (imageWidth - containerRect.width) / 2)
                const maxY = Math.max(0, (imageHeight - containerRect.height) / 2)
                
                setDragConstraints({
                  left: -maxX,
                  right: maxX,
                  top: -maxY,
                  bottom: maxY,
                })
              }
            }
          }}
        />
      </motion.div>

      {/* Reset button */}
      <motion.button
        onClick={handleReset}
        className="absolute bottom-2 right-2 p-2 bg-warm-burgundy-DEFAULT/80 hover:bg-warm-burgundy-DEFAULT text-warm-gold-DEFAULT rounded-full shadow-lg backdrop-blur-sm z-10 touch-manipulation export-hide"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Reset photo position and scale"
        title="Reset position"
      >
        <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
      </motion.button>
    </div>
  )
}

PhotoEditor.displayName = 'PhotoEditor'

