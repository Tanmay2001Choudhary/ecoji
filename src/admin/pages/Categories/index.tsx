import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export const CategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      const data = await api.categories.list()
      setCategories(data || [])
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category? Products assigned to it may fail to load properly.')) return
    
    try {
      await supabase.from('categories').delete().eq('id', id)
      setCategories(categories.filter(c => c.id !== id))
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('Failed to delete category')
    }
  }

  const handleEdit = (cat: any) => {
    setIsEditing(cat.id)
    setFormData({ name: cat.name, slug: cat.slug })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing === 'new') {
        await supabase.from('categories').insert(formData)
      } else if (isEditing) {
        await supabase.from('categories').update(formData).eq('id', isEditing)
      }
      setIsEditing(null)
      loadCategories()
    } catch (err: any) {
      alert('Failed to save: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button 
          onClick={() => { setIsEditing('new'); setFormData({ name: '', slug: '' }) }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Category
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : categories.map(cat => (
              <tr key={cat.id}>
                {isEditing === cat.id ? (
                  <td colSpan={3} className="px-6 py-4">
                    <form onSubmit={handleSave} className="flex items-center gap-4">
                      <input type="text" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} className="border rounded px-2 py-1 flex-1" placeholder="Category Name" required />
                      <input type="text" value={formData.slug} onChange={e => setFormData(f => ({ ...f, slug: e.target.value }))} className="border rounded px-2 py-1 flex-1" placeholder="slug" required />
                      <button type="submit" className="text-white bg-primary px-3 py-1 rounded">Save</button>
                      <button type="button" onClick={() => setIsEditing(null)} className="text-gray-500">Cancel</button>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(cat)} className="text-primary hover:text-primary/80 mr-3"><Edit2 className="h-5 w-5 inline" /></button>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5 inline" /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            
            {isEditing === 'new' && (
              <tr>
                <td colSpan={3} className="px-6 py-4">
                  <form onSubmit={handleSave} className="flex items-center gap-4">
                    <input type="text" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} className="border rounded px-2 py-1 flex-1" placeholder="Category Name" required />
                    <input type="text" value={formData.slug} onChange={e => setFormData(f => ({ ...f, slug: e.target.value }))} className="border rounded px-2 py-1 flex-1" placeholder="slug" required />
                    <button type="submit" className="text-white bg-primary px-3 py-1 rounded">Save</button>
                    <button type="button" onClick={() => setIsEditing(null)} className="text-gray-500">Cancel</button>
                  </form>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
