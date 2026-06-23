import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export const ContactsList: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : contacts.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No contact submissions found.</td></tr>
            ) : contacts.map(c => (
              <tr key={c.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.label}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
