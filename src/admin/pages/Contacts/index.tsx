import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Plus, Trash2, Mail, Phone, MapPin, Pen } from 'lucide-react'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { RichTextarea } from '@/admin/components/RichTextarea'

export const ContactsList: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Confirm dialog state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const [type, setType] = useState('EMAIL')
  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')
  const [icon, setIcon] = useState('Mail')
  const [displayOrder, setDisplayOrder] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setIsLoading(true)
      const data = await api.contacts.list()
      setContacts(data || [])
    } catch (error) {
      console.error('Failed to load contacts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirmId) return
    try {
      await api.contacts.delete(deleteConfirmId)
      setDeleteConfirmId(null)
      loadContacts()
    } catch (error) {
      console.error('Failed to delete contact:', error)
      alert('Error deleting contact')
    }
  }

  const handleOpenAdd = () => {
    setEditingId(null)
    setType('EMAIL')
    setLabel('')
    setValue('')
    setIcon('Mail')
    setDisplayOrder(contacts.length + 1)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (c: any) => {
    setEditingId(c.id)
    setType(c.type)
    setLabel(c.label)
    setValue(c.value)
    setIcon(c.icon || (c.type === 'EMAIL' ? 'Mail' : c.type === 'PHONE' ? 'Phone' : 'MapPin'))
    setDisplayOrder(c.display_order || 1)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingId) {
        await api.contacts.update(editingId, {
          type,
          label,
          value,
          icon,
          display_order: Number(displayOrder)
        })
      } else {
        await api.contacts.create({
          type,
          label,
          value,
          icon,
          display_order: Number(displayOrder)
        })
      }
      setIsModalOpen(false)
      loadContacts()
    } catch (error) {
      console.error('Failed to save contact:', error)
      alert('Error saving contact')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mail': return <Mail className="w-4 h-4 text-primary" />
      case 'Phone': return <Phone className="w-4 h-4 text-primary" />
      default: return <MapPin className="w-4 h-4 text-primary" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Methods</h1>
          <p className="text-sm text-gray-500">Manage public contact details displayed on the Contact page & Footer.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Contact Info
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details / Value</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : contacts.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No contact methods configured.</td></tr>
            ) : contacts.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">#{c.display_order || 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 flex items-center gap-2">
                  {renderIcon(c.icon)}
                  {c.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.label}</td>
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-pre-line">{c.value}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="text-gray-400 hover:text-primary transition-colors p-1"
                      title="Edit Contact Method"
                    >
                      <Pen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(c.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      title="Delete Contact Method"
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

      {/* Add / Edit Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Contact Method' : 'Add Contact Method'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Type</label>
                <select
                  value={type}
                  onChange={e => {
                    setType(e.target.value)
                    setIcon(e.target.value === 'EMAIL' ? 'Mail' : e.target.value === 'PHONE' ? 'Phone' : 'MapPin')
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                >
                  <option value="EMAIL">Email Address</option>
                  <option value="PHONE">Phone / WhatsApp</option>
                  <option value="ADDRESS">Physical Address</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Label</label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  placeholder="e.g. Sales Inquiry"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Value / Details</label>
                <RichTextarea
                  required
                  rows={3}
                  value={value || ''}
                  onChange={val => setValue(val)}
                  placeholder="e.g. ecoji.office@gmail.com or +91 9876543210"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Order</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={displayOrder}
                  onChange={e => setDisplayOrder(Number(e.target.value))}
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
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update Contact' : 'Add Contact')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        title="Delete Contact Method"
        message="Are you sure you want to remove this contact method? This will permanently delete it from the website."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  )
}
