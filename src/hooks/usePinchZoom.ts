import { useState, useRef, useCallback } from 'react'

interface PinchZoomState {
  scale: number
  x: number
  y: number
}

export const usePinchZoom = (initialScale = 1) => {
  const [state, setState] = useState<PinchZoomState>({
    scale: initialScale,
    x: 0,
    y: 0,
  })

  const lastTouchDistance = useRef<number | null>(null)
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      lastTouchDistance.current = distance
      
      const centerX = (touch1.clientX + touch2.clientX) / 2
      const centerY = (touch1.clientY + touch2.clientY) / 2
      lastTouchCenter.current = { x: centerX, y: centerY }
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current && lastTouchCenter.current) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )

      const scaleChange = distance / lastTouchDistance.current
      const newScale = Math.max(0.5, Math.min(3, state.scale * scaleChange))

      const centerX = (touch1.clientX + touch2.clientX) / 2
      const centerY = (touch1.clientY + touch2.clientY) / 2
      const deltaX = centerX - lastTouchCenter.current.x
      const deltaY = centerY - lastTouchCenter.current.y

      setState((prev) => ({
        scale: newScale,
        x: prev.x + deltaX / prev.scale,
        y: prev.y + deltaY / prev.scale,
      }))

      lastTouchDistance.current = distance
      lastTouchCenter.current = { x: centerX, y: centerY }
    }
  }, [state.scale])

  const handleTouchEnd = useCallback(() => {
    lastTouchDistance.current = null
    lastTouchCenter.current = null
  }, [])

  const setScale = useCallback((scale: number) => {
    setState((prev) => ({ ...prev, scale: Math.max(0.5, Math.min(3, scale)) }))
  }, [])

  const setPosition = useCallback((x: number, y: number) => {
    setState((prev) => ({ ...prev, x, y }))
  }, [])

  const reset = useCallback(() => {
    setState({ scale: initialScale, x: 0, y: 0 })
  }, [initialScale])

  return {
    ...state,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    setScale,
    setPosition,
    reset,
  }
}



