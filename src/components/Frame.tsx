import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface FrameProps {
  children: ReactNode
  className?: string
}

export const Frame: React.FC<FrameProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      id="memory-frame"
      className={`
        relative bg-paper-DEFAULT paper-texture
        border border-warm-brown-light/30
        rounded-sm shadow-2xl
        p-4 sm:p-6 md:p-8 lg:p-12
        flex flex-col
        w-full
        max-h-[95vh] sm:max-h-[90vh] md:max-h-[85vh] lg:max-h-[80vh]
        overflow-hidden
        ${className}
      `}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        backgroundColor: '#F5F1E8', // Explicit inline style for export
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '100%',
        minHeight: '400px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div 
        className="text-center mb-3 sm:mb-4 md:mb-6 flex-shrink-0 w-full"
        style={{
          width: '100%',
          maxWidth: '100%',
          display: 'block',
          boxSizing: 'border-box',
        }}
      >
        <h1 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-warm-burgundy-DEFAULT mb-1 sm:mb-2 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Once Again '12
        </h1>
        <p 
          className="text-sm sm:text-base md:text-lg lg:text-xl text-warm-brown-DEFAULT italic"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Where memories meet the present
        </p>
      </div>

      {/* Main content area (photo) - takes remaining space */}
      <div 
        className="flex-1 flex items-center justify-center relative overflow-hidden w-full"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          height: 'auto',
          width: '100%',
          maxWidth: '100%',
          flex: '1 1 auto',
          overflow: 'hidden',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null
          
          const componentName = (child.type as any)?.displayName || (child.type as any)?.name || ''
          
          // Only render PhotoEditor here - filter out everything else
          if (componentName === 'PhotoEditor') {
            return child
          }
          
          return null
        })}
      </div>

      {/* Footer area for TextEditor */}
      <div 
        className="flex-shrink-0 w-full"
        style={{
          flexShrink: 0,
          width: '100%',
          maxWidth: '100%',
          clear: 'both',
          display: 'block',
        }}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null
          
          const componentName = (child.type as any)?.displayName || (child.type as any)?.name || ''
          
          // Only render TextEditor in the footer
          if (componentName === 'TextEditor') {
            return child
          }
          
          return null
        })}
      </div>

      {/* Magic effects - rendered at frame level to cover entire frame */}
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null
        
        const componentName = (child.type as any)?.displayName || (child.type as any)?.name || ''
        
        // Only render magic effects here
        if (componentName === 'FilmGrain' || 
            componentName === 'WarmTone' || 
            componentName === 'LightLeak') {
          return child
        }
        
        return null
      })}
    </motion.div>
  )
}

