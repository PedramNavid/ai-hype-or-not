"use client"

import { useEffect, useCallback } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  // Handle escape key press
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            className="absolute right-4 top-4 z-10 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* Modal content */}
          <div className="max-h-[85vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}