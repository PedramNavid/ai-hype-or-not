"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface Screenshot {
  image_url: string
  caption?: string
}

interface ScreenshotGalleryProps {
  screenshots: Screenshot[]
  productName: string
}

export function ScreenshotGallery({ screenshots, productName }: ScreenshotGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<Screenshot | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {screenshots.map((screenshot, index) => (
          <div
            key={index}
            className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 cursor-pointer group"
            onClick={() => setSelectedImage(screenshot)}
          >
            <Image
              src={screenshot.image_url || "/screenshots/placeholder.svg"}
              alt={screenshot.caption || `${productName} screenshot ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-8 h-8" />
            </button>
            <Image
              src={selectedImage.image_url || "/screenshots/placeholder.svg"}
              alt={selectedImage.caption || `${productName} screenshot`}
              className="w-full h-full object-contain rounded-lg"
              fill
              sizes="90vw"
            />
            {selectedImage.caption && (
              <p className="text-white text-center mt-4 text-lg">{selectedImage.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}