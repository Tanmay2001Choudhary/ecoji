import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6 relative w-full h-full">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-28 shrink-0 no-scrollbar pb-2 md:pb-0 gallery-thumbnails">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "relative aspect-[4/5] w-24 md:w-full rounded-[1rem] overflow-hidden border-2 transition-all shrink-0",
              activeIndex === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-50 hover:opacity-100"
            )}
          >
            <img src={img} alt={`${productName} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 aspect-[4/5] md:aspect-auto md:h-full min-h-[500px] bg-secondary/10 rounded-[2rem] overflow-hidden group gallery-main">
        <img 
          src={images[activeIndex]} 
          alt={productName} 
          className="w-full h-full object-cover absolute inset-0"
        />
      </div>
    </div>
  )
}
