import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Plus, Trash2, Check, X, Pen } from 'lucide-react'
import { ConfirmDialog } from '@/components/ConfirmDialog'

export const ThemesList: React.FC = () => {
  const [themes, setThemes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Confirm dialog state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [bgColor, setBgColor] = useState('42 41.7% 95.3%')
  const [primaryColor, setPrimaryColor] = useState('123 46.2% 33.5%')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadThemes()
  }, [])

  const loadThemes = async () => {
    try {
      setIsLoading(true)
      const data = await api.themes.list()
      setThemes(data || [])
    } catch (error) {
      console.error('Failed to load themes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatColor = (val: string) => {
    if (!val) return '#ffffff'
    if (val.startsWith('#') || val.startsWith('rgb') || val.startsWith('hsl')) return val
    return `hsl(${val})`
  }

  const handleToggleActive = async (theme: any) => {
    try {
      await api.themes.update(theme.id, { is_active: !theme.is_active })
      loadThemes()
    } catch (error) {
      console.error('Failed to update theme status:', error)
      alert('Error updating theme status')
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirmId) return
    try {
      await api.themes.delete(deleteConfirmId)
      setDeleteConfirmId(null)
      loadThemes()
    } catch (error) {
      console.error('Failed to delete theme:', error)
      alert('Error deleting theme')
    }
  }

  const handleOpenAdd = () => {
    setEditingId(null)
    setName('')
    setSlug('')
    setBgColor('42 41.7% 95.3%')
    setPrimaryColor('123 46.2% 33.5%')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (t: any) => {
    setEditingId(t.id)
    setName(t.name)
    setSlug(t.slug)
    setBgColor(t.colors?.background || '42 41.7% 95.3%')
    setPrimaryColor(t.colors?.primary || '123 46.2% 33.5%')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        colors: { background: bgColor, primary: primaryColor }
      }
      if (editingId) {
        await api.themes.update(editingId, payload)
      } else {
        await api.themes.create({ ...payload, is_active: true })
      }
      setIsModalOpen(false)
      loadThemes()
    } catch (error) {
      console.error('Failed to save theme:', error)
      alert('Error saving theme')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Themes</h1>
          <p className="text-sm text-gray-500">Manage site color schemes and styling options.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Theme
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 p-6">
        {isLoading ? (
          <p>Loading themes...</p>
        ) : themes.length === 0 ? (
          <p className="text-gray-500">No themes found in database.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {themes.map(theme => (
              <div key={theme.id} className="border rounded-xl p-5 space-y-4 relative flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-900">{theme.name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(theme)}
                        className="text-gray-400 hover:text-primary p-1 rounded transition-colors"
                        title="Edit Theme"
                      >
                        <Pen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(theme.id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                        title="Delete Theme"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block">slug: {theme.slug}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Color Palette</span>
                  <div className="flex items-center gap-3">
                    {Object.entries(theme.colors || {}).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-1.5">
                        <div 
                          className="w-8 h-8 rounded-lg shadow-inner border border-gray-300" 
                          style={{ backgroundColor: formatColor(v as string) }} 
                          title={`${k}: ${v}`}
                        />
                        <span className="text-xs text-gray-600 capitalize">{k}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${theme.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {theme.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {theme.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleToggleActive(theme)}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Theme Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Theme' : 'Add New Theme'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Theme Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Forest Green"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug (optional)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="theme-forest-green"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Background Color (HSL)</label>
                <input
                  type="text"
                  required
                  value={bgColor}
                  onChange={e => setBgColor(e.target.value)}
                  placeholder="42 41.7% 95.3%"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Color (HSL)</label>
                <input
                  type="text"
                  required
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  placeholder="123 46.2% 33.5%"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update Theme' : 'Create Theme')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        title="Delete Theme"
        message="Are you sure you want to delete this theme? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  )
}
