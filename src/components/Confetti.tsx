import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface ConfettiParticle {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  duration: number
}

const colors = ['#D4AF37', '#8B6F47', '#A0826D', '#E8D5A3', '#F5F1E8']

export const Confetti: React.FC<{ trigger: boolean }> = ({ trigger }) => {
  const particlesRef = useRef<ConfettiParticle[]>([])

  useEffect(() => {
    if (trigger) {
      // Generate particles
      particlesRef.current = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        duration: Math.random() * 2 + 2,
      }))
    }
  }, [trigger])

  if (!trigger) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particlesRef.current.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
          initial={{
            y: -10,
            x: 0,
            rotate: particle.rotation,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 100,
            x: (Math.random() - 0.5) * 200,
            rotate: particle.rotation + 360,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            ease: 'easeOut',
            times: [0, 0.7, 1],
          }}
        />
      ))}
    </div>
  )
}

