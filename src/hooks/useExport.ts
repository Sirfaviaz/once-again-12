import { useCallback } from 'react'
import html2canvas from 'html2canvas'

export const useExport = () => {
  const exportToImage = useCallback(async (elementId: string, type: 'image/png' | 'image/jpeg' = 'image/png'): Promise<string> => {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('Element not found')
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#F5F1E8',
      scale: 2,
      useCORS: true,
      logging: false,
      width: element.offsetWidth,
      height: element.offsetHeight,
      allowTaint: false,
      foreignObjectRendering: false,
      removeContainer: false,
      imageTimeout: 10000,
      onclone: (clonedDoc, clonedElement) => {
        // Ensure background color is set in cloned document
        const rootElement = clonedDoc.getElementById(element.id) || clonedDoc.body.firstElementChild || clonedElement
        if (rootElement) {
          const rootHtml = rootElement as HTMLElement
          // Use cssText to override everything
          rootHtml.style.cssText = `${rootHtml.style.cssText}; background-color: #F5F1E8 !important;`
          rootHtml.style.setProperty('background-color', '#F5F1E8', 'important')
          rootHtml.style.backgroundColor = '#F5F1E8'
          
          // Apply styles to ALL elements in cloned document
          const allElements = clonedDoc.querySelectorAll('*')
          allElements.forEach((clonedEl) => {
            const htmlEl = clonedEl as HTMLElement
            const computed = window.getComputedStyle(htmlEl)
            
            // Remove ALL filters from images AND all divs (including motion.div wrappers) to prevent whitish tint
            if (htmlEl.tagName === 'IMG' || htmlEl.tagName === 'DIV') {
              if (computed.filter && computed.filter !== 'none') {
                htmlEl.style.filter = 'none'
                htmlEl.style.removeProperty('filter')
              }
              // Also remove backdrop-filter
              if (computed.backdropFilter && computed.backdropFilter !== 'none') {
                htmlEl.style.backdropFilter = 'none'
                htmlEl.style.removeProperty('backdrop-filter')
              }
            }
            
            // Set background color for paper elements - use cssText for maximum override
            if (htmlEl.classList.contains('bg-paper-DEFAULT') || 
                htmlEl.classList.contains('paper-texture') ||
                htmlEl.id === 'memory-frame') {
              htmlEl.style.cssText = `${htmlEl.style.cssText}; background-color: #F5F1E8 !important;`
              htmlEl.style.setProperty('background-color', '#F5F1E8', 'important')
              htmlEl.style.backgroundColor = '#F5F1E8'
            }
            
            // Preserve text colors from Tailwind classes
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
          
          // Also add a style tag to the document to ensure background
          const styleTag = clonedDoc.createElement('style')
          styleTag.textContent = `
            #${element.id},
            #memory-frame,
            .bg-paper-DEFAULT,
            .paper-texture {
              background-color: #F5F1E8 !important;
            }
          `
          clonedDoc.head.appendChild(styleTag)
        }
      },
    })

    return canvas.toDataURL(type, type === 'image/jpeg' ? 1 : undefined)
  }, [])

  const downloadImage = useCallback((dataUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    link.click()
  }, [])

  return { exportToImage, downloadImage }
}


