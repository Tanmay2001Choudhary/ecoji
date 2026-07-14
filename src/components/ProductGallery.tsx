import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6 relative w-full items-start">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 shrink-0 no-scrollbar pb-2 md:pb-0 gallery-thumbnails">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "relative rounded-[1rem] overflow-hidden border-2 transition-all shrink-0 bg-secondary/10 flex items-center justify-center w-20 md:w-24 max-h-24",
              activeIndex === idx ? "border-primary ring-2 ring-primary/20 shadow-sm" : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <img src={img} alt={`${productName} thumbnail ${idx + 1}`} className="w-full h-auto max-h-24 object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 bg-secondary/10 rounded-[2rem] overflow-hidden group gallery-main flex items-center justify-center border border-border/10 w-fit max-w-full">
        <img 
          src={images[activeIndex]} 
          alt={productName} 
          className="w-full h-auto max-h-[650px] object-cover transition-all duration-500"
        />
      </div>
    </div>
  )
}
