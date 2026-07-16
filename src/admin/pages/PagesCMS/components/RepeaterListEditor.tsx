import React, { useState, useEffect } from 'react'
import { Save, Plus, Trash2, Layers } from 'lucide-react'
import { RichTextarea } from '@/admin/components/RichTextarea'

interface RepeaterItem {
  id?: string
  title?: string
  description?: string
  badge?: string
  question?: string
  answer?: string
  value?: string | number
  suffix?: string
  label?: string
  [key: string]: any
}

interface RepeaterListEditorProps {
  pageSlug: string
  sectionKey: string
  title: string
  subtitle?: string
  itemType: 'cards' | 'stats' | 'faqs' | 'strings' | 'links'
  initialItems: RepeaterItem[] | string[]
  onSave: (items: any) => Promise<void>
}

export const RepeaterListEditor: React.FC<RepeaterListEditorProps> = ({
  pageSlug,
  sectionKey,
  title,
  subtitle,
  itemType,
  initialItems,
  onSave
}) => {
  const [items, setItems] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (initialItems && Array.isArray(initialItems)) {
      setItems(initialItems)
    }
  }, [initialItems])

  const handleAddItem = () => {
    if (itemType === 'cards') {
      setItems([...items, { title: 'New Item', description: 'Item description...', badge: '' }])
    } else if (itemType === 'stats') {
      setItems([...items, { value: 100, suffix: '+', label: 'Impact Counter Label' }])
    } else if (itemType === 'faqs') {
      setItems([...items, { question: 'New Question?', answer: 'Answer here...' }])
    } else if (itemType === 'links') {
      setItems([...items, { name: 'New Link', path: '/' }])
    } else {
      setItems([...items, 'New Point'])
    }
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleFieldChange = (index: number, field: string, value: any) => {
    const updated = [...items]
    if (typeof updated[index] === 'object' && updated[index] !== null) {
      updated[index][field] = value
    } else {
      updated[index] = value
    }
    setItems(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onSave(items)
      alert(`Saved ${title} successfully!`)
    } catch (err: any) {
      alert('Failed to save repeater section: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> {title} (`{pageSlug}/{sectionKey}`)
          </h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save List'}
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-10 text-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
          No items yet. Click "+ Add Item" above.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="p-5 border border-gray-200 rounded-xl bg-gray-50/60 relative space-y-3 transition-all hover:border-primary/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Item #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-gray-400 hover:text-red-500 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>

              {itemType === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm bg-white"
                      placeholder="Card Title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Badge (Optional)</label>
                    <input
                      type="text"
                      value={item.badge || ''}
                      onChange={(e) => handleFieldChange(index, 'badge', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm bg-white"
                      placeholder="e.g. Eco-Friendly"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <RichTextarea
                      rows={2}
                      value={item.description || ''}
                      onChange={(val) => handleFieldChange(index, 'description', val)}
                      placeholder="Card Description..."
                    />
                  </div>
                </div>
              )}

              {itemType === 'stats' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Counter Number (`value`)</label>
                    <input
                      type="number"
                      value={item.value || 0}
                      onChange={(e) => handleFieldChange(index, 'value', Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Suffix (e.g. `+` or `%` or `K+`)</label>
                    <input
                      type="text"
                      value={item.suffix || ''}
                      onChange={(e) => handleFieldChange(index, 'suffix', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm bg-white"
                      placeholder="+"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                    <input
                      type="text"
                      value={item.label || ''}
                      onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm bg-white"
                      placeholder="Plastic Brushes Replaced"
                    />
                  </div>
                </div>
              )}

              {itemType === 'faqs' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Question</label>
                    <input
                      type="text"
                      value={item.question || ''}
                      onChange={(e) => handleFieldChange(index, 'question', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm font-semibold bg-white"
                      placeholder="Question..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Answer</label>
                    <RichTextarea
                      rows={2}
                      value={item.answer || ''}
                      onChange={(val) => handleFieldChange(index, 'answer', val)}
                      placeholder="Answer text..."
                    />
                  </div>
                </div>
              )}

              {itemType === 'strings' && (
                <div>
                  <input
                    type="text"
                    value={typeof item === 'string' ? item : (item.text || '')}
                    onChange={(e) => handleFieldChange(index, 'text', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm bg-white"
                  />
                </div>
              )}

              {itemType === 'links' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Link Name / Label</label>
                    <input
                      type="text"
                      value={item.name || ''}
                      onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm font-semibold bg-white"
                      placeholder="e.g. Products"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">URL Path (`path` or `url`)</label>
                    <input
                      type="text"
                      value={item.path || item.url || ''}
                      onChange={(e) => {
                        handleFieldChange(index, 'path', e.target.value)
                        handleFieldChange(index, 'url', e.target.value)
                      }}
                      className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm bg-white font-mono"
                      placeholder="e.g. /products or https://..."
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </form>
  )
}
