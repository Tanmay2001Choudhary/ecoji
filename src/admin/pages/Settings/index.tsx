import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Save } from 'lucide-react'

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      const data = await api.settings.get()
      setSettings(data || { site_name: '', meta_title: '', meta_description: '', contact_email: '', contact_phone: '' })
    } catch (error) {
      console.error('Failed to load settings:', error)
      // Mock it if no row exists yet
      setSettings({ site_name: 'Ecoji', meta_title: '', meta_description: '', contact_email: '', contact_phone: '' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await api.settings.update(settings)
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Global Settings</h1>
      </div>

      <form onSubmit={handleSave} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            
            <div className="sm:col-span-3">
              <label htmlFor="site_name" className="block text-sm font-medium leading-6 text-gray-900">Site Name</label>
              <div className="mt-2">
                <input required type="text" name="site_name" id="site_name" value={settings.site_name || ''} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 px-3 focus:ring-primary focus:ring-2 sm:text-sm sm:leading-6" />
              </div>
            </div>



            <div className="sm:col-span-6">
              <label htmlFor="meta_title" className="block text-sm font-medium leading-6 text-gray-900">Default SEO Title</label>
              <div className="mt-2">
                <input type="text" name="meta_title" id="meta_title" value={settings.meta_title || ''} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 px-3 focus:ring-primary focus:ring-2 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="meta_description" className="block text-sm font-medium leading-6 text-gray-900">Default SEO Description</label>
              <div className="mt-2">
                <textarea rows={3} name="meta_description" id="meta_description" value={settings.meta_description || ''} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 px-3 focus:ring-primary focus:ring-2 sm:text-sm sm:leading-6" />
              </div>
            </div>

          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button type="submit" disabled={isSaving} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 flex items-center">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
