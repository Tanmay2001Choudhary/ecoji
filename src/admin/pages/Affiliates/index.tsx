import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Plus, Trash2 } from 'lucide-react'

export const AffiliatesList: React.FC = () => {
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ product_id: '', platform: '', url: '', is_active: true })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [affData, prodData] = await Promise.all([
        api.affiliates.list(),
        api.products.list()
      ])
      setAffiliates(affData || [])
      setProducts(prodData || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this affiliate link?')) return
    try {
      await api.affiliates.delete(id)
      setAffiliates(affiliates.filter(a => a.id !== id))
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await api.affiliates.create(formData)
      setShowModal(false)
      loadData()
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Affiliate Links</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
          <Plus className="w-5 h-5 mr-2" /> Add Link
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border">
        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : affiliates.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No affiliate links found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {affiliates.map(aff => (
                <tr key={aff.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{aff.products?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aff.platform}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <a href={aff.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-[200px] block">
                      {aff.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${aff.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {aff.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(aff.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5 inline" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Affiliate Link</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product</label>
                <select required className="mt-1 block w-full rounded-md border p-2" value={formData.product_id} onChange={e => setFormData({...formData, product_id: e.target.value})}>
                  <option value="">Select Product...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Platform</label>
                <input required type="text" placeholder="e.g. Amazon, Flipkart" className="mt-1 block w-full rounded-md border p-2" value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input required type="url" placeholder="https://" className="mt-1 block w-full rounded-md border p-2" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
                <label htmlFor="is_active">Active</label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-gray-700">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">{isSaving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
