import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

export const AudioToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume] = useState(0.3)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create ambient audio (using a data URL or external source)
    // For now, we'll create a silent audio element that can be replaced with actual audio
    const audio = new Audio()
    // You can replace this with an actual audio file URL
    // audio.src = '/ambient-sound.mp3'
    audio.loop = true
    audio.volume = volume
    audioRef.current = audio

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const toggleAudio = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Audio playback failed:', error)
      // Browser may block autoplay - that's okay
    }
  }

  return (
    <motion.button
      onClick={toggleAudio}
      className="fixed top-4 right-4 md:top-6 md:right-6 p-3 bg-warm-burgundy-light/80 backdrop-blur-sm rounded-full shadow-lg z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isPlaying ? 'Mute audio' : 'Play audio'}
    >
      {isPlaying ? (
        <Volume2 className="w-5 h-5 text-warm-gold-DEFAULT" />
      ) : (
        <VolumeX className="w-5 h-5 text-warm-brown-light" />
      )}
    </motion.button>
  )
}

