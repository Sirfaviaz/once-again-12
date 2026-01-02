import { useCallback } from 'react'
import html2canvas from 'html2canvas'

export const useExport = () => {
  const exportToImage = useCallback(
    async (elementId: string, type: 'image/png' | 'image/jpeg' = 'image/png'): Promise<string> => {
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error('Element not found')
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#F5F1E8',
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      })

      return canvas.toDataURL(type, type === 'image/jpeg' ? 1 : undefined)
    },
    []
  )

  const downloadImage = useCallback((dataUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    link.click()
  }, [])

  return { exportToImage, downloadImage }
}


