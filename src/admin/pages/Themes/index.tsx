import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export const ThemesList: React.FC = () => {
  const [themes, setThemes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Themes</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 p-6">
        {isLoading ? (
          <p>Loading themes...</p>
        ) : themes.length === 0 ? (
          <p className="text-gray-500">No themes found in database.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {themes.map(theme => (
              <div key={theme.id} className="border rounded-md p-4 space-y-2">
                <h3 className="font-bold text-lg">{theme.name}</h3>
                <p className="text-sm text-gray-500">Slug: {theme.slug}</p>
                <div className="flex gap-2">
                  {Object.entries(theme.colors || {}).slice(0, 3).map(([k, v]) => (
                    <div key={k} className="w-6 h-6 rounded border" style={{ backgroundColor: v as string }} title={`${k}: ${v}`}></div>
                  ))}
                </div>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${theme.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {theme.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
