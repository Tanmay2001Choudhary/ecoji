import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export const FontsList: React.FC = () => {
  const [fonts, setFonts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Fonts</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 p-6">
        {isLoading ? (
          <p>Loading fonts...</p>
        ) : fonts.length === 0 ? (
          <p className="text-gray-500">No fonts found in database.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weights</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fonts.map(font => (
                <tr key={font.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{font.font_family}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{font.provider}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{font.available_weights?.join(', ')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${font.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {font.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
