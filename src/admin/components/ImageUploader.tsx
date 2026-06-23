import React, { useState } from 'react'
import { api } from '@/lib/api'
import { UploadCloud, X, Loader2 } from 'lucide-react'

interface ImageUploaderProps {
  productId: string
  images: any[]
  onUploadComplete: () => void
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ productId, images, onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!productId || productId === 'new') {
      alert('Please save the product first before uploading images.')
      return
    }

    try {
      setIsUploading(true)
      const url = await api.products.uploadImage(file, productId)
      
      // We also need an api.ts method to link the image into `product_images` table.
      // Assuming a generic insert function is available or we do it here directly:
      const { supabase } = await import('@/lib/supabase')
      await supabase.from('product_images').insert({
        product_id: productId,
        url: url,
        is_primary: images.length === 0, // make primary if first image
        display_order: images.length
      })

      onUploadComplete()
    } catch (error: any) {
      console.error('Upload failed:', error)
      alert('Upload failed: ' + error.message)
    } finally {
      setIsUploading(false)
      if (e.target) e.target.value = '' // reset input
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm('Delete this image?')) return
    const { supabase } = await import('@/lib/supabase')
    await supabase.from('product_images').delete().eq('id', imageId)
    onUploadComplete()
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium leading-6 text-gray-900">Product Images</h3>
      
      {/* Existing Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img.id} className="relative group aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border bg-gray-50">
            <img src={img.url} alt="Product" className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                type="button"
                onClick={() => handleDelete(img.id)}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {img.is_primary && (
              <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">Primary</div>
            )}
          </div>
        ))}

        {/* Upload Button */}
        <label className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 cursor-pointer transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          ) : (
            <UploadCloud className="h-8 w-8 mb-2" />
          )}
          <span className="text-sm font-medium">{isUploading ? 'Uploading...' : 'Upload Image'}</span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
            disabled={isUploading || productId === 'new'} 
          />
        </label>
      </div>
      
      {productId === 'new' && (
        <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
          Please save the product first to enable image uploads.
        </p>
      )}
    </div>
  )
}
