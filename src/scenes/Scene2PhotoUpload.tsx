import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useImageUpload } from '../hooks/useImageUpload'
import { scaleIn, fadeIn, zoomOut } from '../utils/animations'
import { Upload, Camera } from 'lucide-react'

export const Scene2PhotoUpload: React.FC = () => {
  const { setPhoto, setCurrentScene } = useApp()
  const { handleFileSelect, isUploading } = useImageUpload()
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    try {
      const imageUrl = await handleFileSelect(file)
      setPreview(imageUrl)
      
      // Wait for animation, then transition
      setTimeout(() => {
        setPhoto(imageUrl)
        setCurrentScene('frame')
      }, 1500)
    } catch (err) {
      console.error('Upload error:', err)
    }
  }, [handleFileSelect, setPhoto, setCurrentScene])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <motion.div
      className="relative h-full w-full flex items-center justify-center p-6"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={zoomOut}
    >
      {/* Background overlay */}
      <motion.div
        className="absolute inset-0 bg-warm-burgundy-DEFAULT"
        animate={{
          opacity: preview ? 0.7 : 1,
        }}
        transition={{ duration: 0.5 }}
      />

      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload-card"
            className="relative z-10 w-full max-w-md"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className={`
                relative border-2 border-dashed rounded-3xl p-12
                transition-all duration-300
                ${isDragging 
                  ? 'border-warm-gold-DEFAULT bg-warm-burgundy-light scale-105' 
                  : 'border-warm-brown-light bg-warm-burgundy-light/50'
                }
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleInputChange}
                className="hidden"
              />

              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Upload className="w-16 h-16 text-warm-gold-DEFAULT" />
                </motion.div>

                <div className="text-center">
                  <p className="text-xl font-semibold text-warm-gold-DEFAULT mb-2">
                    Drop your photo here
                  </p>
                  <p className="text-warm-brown-light">
                    or tap to upload
                  </p>
                </div>

                <motion.button
                  className="flex items-center gap-2 px-6 py-3 bg-warm-gold-DEFAULT text-warm-burgundy-DEFAULT rounded-full font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera className="w-5 h-5" />
                  Open Camera
                </motion.button>
              </div>
            </motion.div>

            {/* Privacy notice */}
            <motion.p
              className="text-sm text-warm-brown-light/80 mt-6 text-center max-w-md mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              🔒 Your privacy matters: Photos are processed entirely on your device and never uploaded to any server.
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            className="relative z-10 w-full max-w-2xl"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.8, borderRadius: 24 }}
              animate={{ scale: 1, borderRadius: 8 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto object-contain max-h-[80vh]"
              />

              {/* Grid overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isUploading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-warm-gold-DEFAULT text-xl">Processing...</div>
        </motion.div>
      )}
    </motion.div>
  )
}

