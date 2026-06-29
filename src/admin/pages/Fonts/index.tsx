import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Plus, Trash2, Pen } from 'lucide-react'
import { ConfirmDialog } from '@/components/ConfirmDialog'

export const FontsList: React.FC = () => {
  const [fonts, setFonts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Confirm dialog state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const [fontFamily, setFontFamily] = useState('')
  const [provider, setProvider] = useState('GOOGLE_FONTS')
  const [weights, setWeights] = useState('300, 400, 500, 700')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadFonts()
  }, [])

  const loadFonts = async () => {
    try {
      setIsLoading(true)
      const data = await api.fonts.list()
      setFonts(data || [])
    } catch (error) {
      console.error('Failed to load fonts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (font: any) => {
    try {
      await api.fonts.update(font.id, { is_active: !font.is_active })
      loadFonts()
    } catch (error) {
      console.error('Failed to toggle font status:', error)
      alert('Error updating font status')
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirmId) return
    try {
      await api.fonts.delete(deleteConfirmId)
      setDeleteConfirmId(null)
      loadFonts()
    } catch (error) {
      console.error('Failed to delete font:', error)
      alert('Error deleting font')
    }
  }

  const handleOpenAdd = () => {
    setEditingId(null)
    setFontFamily('')
    setProvider('GOOGLE_FONTS')
    setWeights('300, 400, 500, 700')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (f: any) => {
    setEditingId(f.id)
    setFontFamily(f.font_family)
    setProvider(f.provider || 'GOOGLE_FONTS')
    setWeights(Array.isArray(f.available_weights) ? f.available_weights.join(', ') : '300, 400, 500, 700')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload = {
        font_family: fontFamily,
        provider,
        available_weights: weights.split(',').map(w => w.trim()).filter(Boolean)
      }
      if (editingId) {
        await api.fonts.update(editingId, payload)
      } else {
        await api.fonts.create({ ...payload, is_active: true })
      }
      setIsModalOpen(false)
      loadFonts()
    } catch (error) {
      console.error('Failed to save font:', error)
      alert('Error saving font')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fonts</h1>
          <p className="text-sm text-gray-500">Manage available typography for the site.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Font
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weights</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : fonts.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No fonts found in database.</td></tr>
            ) : fonts.map(font => (
              <tr key={font.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{font.font_family}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{font.provider}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{font.available_weights?.join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleActive(font)}
                    className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${font.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {font.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleOpenEdit(font)}
                      className="text-gray-400 hover:text-primary transition-colors p-1"
                      title="Edit Font"
                    >
                      <Pen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(font.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      title="Delete Font"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Font Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Font' : 'Add New Font'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Font Family Name</label>
                <input
                  type="text"
                  required
                  value={fontFamily}
                  onChange={e => setFontFamily(e.target.value)}
                  placeholder="e.g. Montserrat"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Provider</label>
                <select
                  value={provider}
                  onChange={e => setProvider(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                >
                  <option value="GOOGLE_FONTS">Google Fonts</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Available Weights (comma separated)</label>
                <input
                  type="text"
                  value={weights}
                  onChange={e => setWeights(e.target.value)}
                  placeholder="300, 400, 500, 700"
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
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update Font' : 'Add Font')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        title="Delete Font"
        message="Are you sure you want to delete this typography option? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  )
}
