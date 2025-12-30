import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { fonts } from '../utils/fonts'
import { typewriter, fadeIn } from '../utils/animations'
import { Type } from 'lucide-react'

export const TextEditor: React.FC = () => {
  const { frameSettings, updateFrameSettings } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!hasAnimated && frameSettings.text === '') {
      const timer = setTimeout(() => setHasAnimated(true), 500)
      return () => clearTimeout(timer)
    }
  }, [hasAnimated, frameSettings.text])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFrameSettings({ text: e.target.value })
  }

  const handleFocus = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  const toggleFont = () => {
    updateFrameSettings({
      fontFamily: frameSettings.fontFamily === 'serif' ? 'sans' : 'serif',
    })
  }

  return (
    <div 
      className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t border-warm-brown-light/20 flex-shrink-0 w-full"
      style={{
        width: '100%',
        maxWidth: '100%',
        display: 'block',
        clear: 'both',
        boxSizing: 'border-box',
      }}
    >
      <motion.div
        className="relative"
        variants={hasAnimated && !frameSettings.text ? typewriter : fadeIn}
        initial="hidden"
        animate="visible"
      >
        {/* User text input */}
        <textarea
          ref={inputRef}
          value={frameSettings.text}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Add your name or message..."
          aria-label="Memory text input"
          className={`
            w-full bg-transparent border-none outline-none resize-none
            text-center text-warm-burgundy-DEFAULT placeholder-warm-brown-light/50
            text-sm sm:text-base md:text-lg
            transition-all duration-300
            ${isEditing ? 'opacity-100' : 'opacity-80'}
            mb-2 sm:mb-3 md:mb-4
          `}
          style={{
            fontFamily: fonts[frameSettings.fontFamily],
            minHeight: '40px',
            lineHeight: '1.5',
          }}
          rows={Math.min(frameSettings.text.split('\n').length || 1, 3)}
        />

        {/* Font toggle button */}
        <motion.button
          onClick={toggleFont}
          className="absolute top-0 right-0 p-1.5 sm:p-2 rounded-full hover:bg-warm-brown-light/10 transition-colors touch-manipulation export-hide"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle font"
        >
          <Type className="w-4 h-4 sm:w-5 sm:h-5 text-warm-brown-DEFAULT" />
        </motion.button>

        {/* Fixed footer text */}
        <div className="text-center space-y-0.5 sm:space-y-1">
          <p 
            className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-warm-burgundy-DEFAULT"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Once Again '12
          </p>
          <p 
            className="text-xs sm:text-sm md:text-base text-warm-brown-DEFAULT"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ICS Ottapalam
          </p>
          <p 
            className="text-xs sm:text-sm md:text-base text-warm-brown-DEFAULT italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Meet up on 5th jan 2026
          </p>
        </div>
      </motion.div>
    </div>
  )
}

