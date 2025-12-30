import React, { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { bottomSheet } from '../utils/animations'
import { X } from 'lucide-react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-paper-DEFAULT rounded-t-3xl shadow-2xl z-50 md:hidden max-h-[80vh] overflow-y-auto"
            variants={bottomSheet}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-warm-brown-light/30 rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 pb-4">
                <h3 className="text-lg font-semibold text-warm-burgundy-DEFAULT">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-warm-brown-light/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-warm-burgundy-DEFAULT" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

