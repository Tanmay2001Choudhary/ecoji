import React, { useState, useEffect } from 'react'
import { Save, FileText } from 'lucide-react'
import { RichTextarea } from '@/admin/components/RichTextarea'

interface RichTextEditorProps {
  pageSlug: string
  sectionKey: string
  title: string
  subtitle?: string
  initialTitle?: string
  initialParagraphs?: string[]
  initialQuote?: string
  onSave: (content: any) => Promise<void>
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  pageSlug,
  sectionKey,
  title,
  subtitle,
  initialTitle,
  initialParagraphs,
  initialQuote,
  onSave
}) => {
  const [heading, setHeading] = useState(initialTitle || 'Our Story')
  const [paragraphs, setParagraphs] = useState<string[]>(initialParagraphs || [
    'Founded with a simple yet powerful mission: to eliminate single-use plastics from daily personal care routines without compromising on quality or aesthetics.',
    'Every toothbrush we design, every bristle we source, and every package we fold is crafted with deep respect for natural ecosystems and circular design principles.'
  ])
  const [quote, setQuote] = useState(initialQuote || 'Sustainability is not just a choice; it is our fundamental design constraint.')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (initialTitle !== undefined) setHeading(initialTitle)
    if (initialParagraphs !== undefined) setParagraphs(initialParagraphs)
    if (initialQuote !== undefined) setQuote(initialQuote)
  }, [initialTitle, initialParagraphs, initialQuote])

  const handleParagraphChange = (index: number, value: string) => {
    const updated = [...paragraphs]
    updated[index] = value
    setParagraphs(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onSave({
        title: heading,
        paragraphs: paragraphs.filter(p => p.trim()),
        quote: quote.trim()
      })
      alert(`Saved ${title} successfully!`)
    } catch (err: any) {
      alert('Failed to save rich text section: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> {title} (`{pageSlug}/{sectionKey}`)
          </h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
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

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Section Heading (`title`)</label>
          <input
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="e.g. Our Story"
            className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm font-bold text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">Paragraphs (`paragraphs`)</label>
            <button
              type="button"
              onClick={() => setParagraphs([...paragraphs, ''])}
              className="text-xs text-primary font-semibold hover:underline"
            >
              + Add Paragraph
            </button>
          </div>

          {paragraphs.map((p, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold shrink-0 mt-2">{idx + 1}</span>
              <RichTextarea
                rows={3}
                value={p}
                onChange={(val) => handleParagraphChange(idx, val)}
                className="flex-1"
                placeholder="Paragraph content..."
              />
              <button
                type="button"
                onClick={() => setParagraphs(paragraphs.filter((_, i) => i !== idx))}
                className="p-2 text-gray-400 hover:text-red-500 self-start mt-1"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Highlighted Quote Callout (`quote`)</label>
          <input
            type="text"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="e.g. Sustainability is not just a choice; it is our fundamental design constraint."
            className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm italic focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
    </form>
  )
}
