import React, { useState, useEffect } from 'react'
import { Save, Sparkles } from 'lucide-react'
import { RichTextarea } from '@/admin/components/RichTextarea'

interface HeroSectionEditorProps {
  pageSlug: string
  sectionKey: string
  title: string
  initialContent: any
  onSave: (content: any) => Promise<void>
}

export const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({
  pageSlug,
  sectionKey,
  title,
  initialContent,
  onSave
}) => {
  const [content, setContent] = useState({
    badgeText: initialContent?.badgeText || 'Biodegradable & Plastic-Free',
    heading: initialContent?.heading || "Nature's Purest\nMasterpiece.",
    subheading: initialContent?.subheading || 'Discover export-quality, zero-waste essentials crafted from organic bamboo, neem wood, and natural gourd. Uncompromising durability meets everyday sustainability.',
    primaryBtnText: initialContent?.primaryBtnText || 'Explore Products',
    primaryBtnLink: initialContent?.primaryBtnLink || '/products',
    secondaryBtnText: initialContent?.secondaryBtnText || 'Our Mission',
    secondaryBtnLink: initialContent?.secondaryBtnLink || '/about',
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (initialContent) {
      setContent({
        badgeText: initialContent.badgeText || 'Biodegradable & Plastic-Free',
        heading: initialContent.heading || "Nature's Purest\nMasterpiece.",
        subheading: initialContent.subheading || 'Discover export-quality, zero-waste essentials crafted from organic bamboo, neem wood, and natural gourd. Uncompromising durability meets everyday sustainability.',
        primaryBtnText: initialContent.primaryBtnText || 'Explore Products',
        primaryBtnLink: initialContent.primaryBtnLink || '/products',
        secondaryBtnText: initialContent.secondaryBtnText || 'Our Mission',
        secondaryBtnLink: initialContent.secondaryBtnLink || '/about',
      })
    }
  }, [initialContent])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContent(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onSave(content)
      alert(`Saved ${title} successfully!`)
    } catch (err: any) {
      alert('Failed to save section: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> {title} (`{pageSlug}/{sectionKey}`)
          </h3>
          <p className="text-xs text-gray-500">Edit main headings, badges, and call-to-action buttons for the hero banner.</p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Section'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Pill Badge Text</label>
          <input
            type="text"
            name="badgeText"
            value={content.badgeText}
            onChange={handleChange}
            placeholder="e.g. Biodegradable & Plastic-Free"
            className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Main Heading (Use line breaks `\n` or Enter for new line)</label>
          <textarea
            name="heading"
            rows={2}
            value={content.heading}
            onChange={handleChange}
            placeholder="Pure Clean.&#10;Zero Waste."
            className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Subheading Paragraph</label>
          <RichTextarea
            name="subheading"
            rows={3}
            value={content.subheading}
            onChange={(val) => setContent(prev => ({ ...prev, subheading: val }))}
            placeholder="The premium eco-friendly oral care that respects your teeth and our planet."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Primary Button Text</label>
          <input
            type="text"
            name="primaryBtnText"
            value={content.primaryBtnText}
            onChange={handleChange}
            placeholder="Explore Products"
            className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Primary Button URL</label>
          <input
            type="text"
            name="primaryBtnLink"
            value={content.primaryBtnLink}
            onChange={handleChange}
            placeholder="/products"
            className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Secondary Button Text</label>
          <input
            type="text"
            name="secondaryBtnText"
            value={content.secondaryBtnText}
            onChange={handleChange}
            placeholder="Our Mission"
            className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Secondary Button URL</label>
          <input
            type="text"
            name="secondaryBtnLink"
            value={content.secondaryBtnLink}
            onChange={handleChange}
            placeholder="/about"
            className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
    </form>
  )
}
