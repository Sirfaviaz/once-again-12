/**
 * QR Code helper - gracefully handles qrcode import
 * If qrcode is not available, functions will return null
 */

export const generateQRCode = async (data: string): Promise<string | null> => {
  try {
    // Try to import qrcode - this may fail in some build configurations
    const qrcodeModule = await import('qrcode').catch(() => null)
    
    if (!qrcodeModule) {
      return null
    }

    const QRCode = qrcodeModule.default || qrcodeModule
    
    if (!QRCode || typeof QRCode.toDataURL !== 'function') {
      return null
    }

    const qrDataUrl = await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
    })

    return qrDataUrl
  } catch (error) {
    // Silently fail - QR code is optional
    console.debug('QR code generation skipped:', error)
    return null
  }
}





