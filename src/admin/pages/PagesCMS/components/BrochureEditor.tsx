import React, { useState } from 'react'
import { BookOpen, Upload, Plus, Trash2, Save, MoveUp, MoveDown, FileText, Check } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'

interface BrochurePageItem {
  title: string
  imageUrl: string
  description: string
}

interface BrochureContent {
  badgeText?: string
  heading?: string
  subheading?: string
  pdfUrl?: string
  pages?: BrochurePageItem[]
}

interface BrochureEditorProps {
  pageSlug: string
  sectionKey: string
  title: string
  initialContent: BrochureContent
  onSave: (content: BrochureContent) => Promise<void>
}

export const BrochureEditor: React.FC<BrochureEditorProps> = ({
  pageSlug,
  sectionKey,
  title,
  initialContent,
  onSave
}) => {
  const [badgeText, setBadgeText] = useState(initialContent.badgeText || 'Interactive Flipbook Catalog')
  const [heading, setHeading] = useState(initialContent.heading || 'Explore Our 2026 Export Brochure')
  const [subheading, setSubheading] = useState(initialContent.subheading || 'Experience our complete product specs, export tiers, and zero-waste manufacturing lifecycle directly in your browser.')
  const [pdfUrl, setPdfUrl] = useState(initialContent.pdfUrl || '')
  const [pages, setPages] = useState<BrochurePageItem[]>(initialContent.pages || [])

  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setIsUploadingPdf(true)
      const url = await api.pagesContent.uploadImage(file, pageSlug, sectionKey)
      setPdfUrl(url)
    } catch (err) {
      console.error('Failed to upload PDF:', err)
      alert('Error uploading PDF file. Please verify file permissions or try again.')
    } finally {
      setIsUploadingPdf(false)
    }
  }

  const handlePageImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingImageIndex(index)
      const url = await api.pagesContent.uploadImage(file, pageSlug, sectionKey)
      const updated = [...pages]
      updated[index] = { ...updated[index], imageUrl: url }
      setPages(updated)
    } catch (err) {
      console.error('Failed to upload page image:', err)
      alert('Error uploading page image.')
    } finally {
      setUploadingImageIndex(null)
    }
  }

  const addPage = () => {
    setPages([...pages, { title: `Brochure Page ${pages.length + 1}`, imageUrl: '', description: '' }])
  }

  const removePage = (index: number) => {
    setPages(pages.filter((_, i) => i !== index))
  }

  const movePage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= pages.length) return
    const updated = [...pages]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    setPages(updated)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      await onSave({
        badgeText,
        heading,
        subheading,
        pdfUrl,
        pages
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save brochure section:', err)
      alert('Failed to save brochure section.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 font-mono">ID: `{pageSlug}/{sectionKey}` — 3D Flipbook & PDF Download</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className={cn(buttonVariants({ variant: 'default' }), "gap-2 shadow-md")}
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Brochure Section'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Brochure section saved successfully! Changes are instantly live across the website.</span>
        </div>
      )}

      {/* Section Typography & PDF File */}
      <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-200/60">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Section Badge Text</label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="Interactive Flipbook Catalog"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Main Heading</label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="Explore Our 2026 Export Brochure"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subheading / Description</label>
            <textarea
              rows={3}
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
              placeholder="Experience our complete product specs, export tiers, and zero-waste manufacturing lifecycle directly in your browser."
            />
          </div>
        </div>

        {/* PDF File Uploader Box */}
        <div className="flex flex-col justify-between p-6 rounded-xl border-2 border-dashed border-gray-300 bg-white">
          <div className="space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Full Catalog Download File (.PDF)</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Upload your complete multi-page PDF brochure file here. When users click "Download Full Catalog", this file will be downloaded directly to their device.
            </p>
          </div>

          <div className="space-y-3 mt-4">
            {pdfUrl && (
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between text-xs font-mono text-gray-600 truncate">
                <span className="truncate">{pdfUrl}</span>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-bold ml-2 hover:underline">
                  Preview
                </a>
              </div>
            )}

            <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold cursor-pointer hover:bg-gray-800 transition-colors shadow-sm">
              <Upload className="w-4 h-4" />
              <span>{isUploadingPdf ? 'Uploading PDF...' : pdfUrl ? 'Replace PDF Brochure File' : 'Upload PDF Brochure File'}</span>
              <input type="file" accept=".pdf" onChange={handlePdfUpload} disabled={isUploadingPdf} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Brochure Flipbook Pages Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-gray-900">3D Flipbook Page Snapshots ({pages.length})</h4>
            <p className="text-xs text-gray-500">
              Add individual page images (WebP/JPEG recommended) for lightning-fast 60fps 3D flipping. The first and last items automatically render as covers.
            </p>
          </div>

          <button
            type="button"
            onClick={addPage}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Page</span>
          </button>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm">
            No flipbook pages added yet. Click "Add New Page" above to start building your interactive brochure.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col justify-between space-y-3 relative group">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200 text-xs font-mono text-gray-500">
                  <span className="font-bold text-gray-900">
                    {idx === 0 ? 'COVER (Page 1)' : idx === pages.length - 1 ? `BACK COVER (Page ${idx + 1})` : `Page ${idx + 1}`}
                  </span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => movePage(idx, 'up')} disabled={idx === 0} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30">
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => movePage(idx, 'down')} disabled={idx === pages.length - 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30">
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => removePage(idx)} className="p-1 rounded text-red-500 hover:bg-red-50 ml-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Image Preview Box */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 border border-gray-300 flex items-center justify-center">
                  {page.imageUrl ? (
                    <img src={page.imageUrl} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">No Image Uploaded</span>
                  )}
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                    <Upload className="w-4 h-4 mr-1.5" />
                    <span>{uploadingImageIndex === idx ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={(e) => handlePageImageUpload(idx, e)} className="hidden" />
                  </label>
                </div>

                <input
                  type="text"
                  value={page.title}
                  onChange={(e) => {
                    const updated = [...pages]
                    updated[idx] = { ...updated[idx], title: e.target.value }
                    setPages(updated)
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold outline-none focus:border-primary bg-white"
                  placeholder="Page Title / Header"
                />

                <textarea
                  rows={2}
                  value={page.description}
                  onChange={(e) => {
                    const updated = [...pages]
                    updated[idx] = { ...updated[idx], description: e.target.value }
                    setPages(updated)
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 outline-none focus:border-primary bg-white resize-none"
                  placeholder="Short page description / caption..."
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  )
}
