import { useState, useCallback } from 'react'

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select an image file'))
        return
      }

      setIsUploading(true)
      setError(null)

      const reader = new FileReader()
      
      reader.onload = (e) => {
        const result = e.target?.result as string
        setIsUploading(false)
        resolve(result)
      }

      reader.onerror = () => {
        setIsUploading(false)
        setError('Failed to read image file')
        reject(new Error('Failed to read image file'))
      }

      reader.readAsDataURL(file)
    })
  }, [])

  return { handleFileSelect, isUploading, error }
}






