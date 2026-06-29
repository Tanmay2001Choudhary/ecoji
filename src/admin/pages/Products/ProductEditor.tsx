import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { ArrowLeft, Save } from 'lucide-react'
import { ImageUploader } from '@/admin/components/ImageUploader'

export const ProductEditor: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [images, setImages] = useState<any[]>([])
  const [faqs, setFaqs] = useState<any[]>([])

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    category_id: '',
    status: 'DRAFT',
    short_description: '',
    full_description: '',
  })

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      const cats = await api.categories.list()
      setCategories(cats || [])

      if (!isNew && id) {
        const product = await api.products.get(id)
        if (product) {
          setFormData({
            name: product.name || '',
            slug: product.slug || '',
            sku: product.sku || '',
            category_id: product.category_id || '',
            status: product.status || 'DRAFT',
            short_description: product.short_description || '',
            full_description: product.full_description || '',
          })
          
          // Also load images
          const { supabase } = await import('@/lib/supabase')
          const { data: imagesData } = await supabase
            .from('product_images')
            .select('*')
            .eq('product_id', id)
            .order('display_order', { ascending: true })
          
          setImages(imagesData || [])

          const { data: faqsData } = await supabase
            .from('product_faqs')
            .select('*')
            .eq('product_id', id)
            .order('display_order', { ascending: true })
          
          setFaqs(faqsData || [])
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      alert('Failed to load product data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      let savedProductId = id
      if (isNew) {
        const newProd = await api.products.create(formData)
        savedProductId = newProd.id
      } else if (id) {
        await api.products.update(id, formData)
      }

      // Save FAQs
      if (savedProductId) {
        const { supabase } = await import('@/lib/supabase')
        // Delete all old FAQs and insert new ones for simplicity
        await supabase.from('product_faqs').delete().eq('product_id', savedProductId)
        
        if (faqs.length > 0) {
          const faqsToInsert = faqs.map((f, i) => ({
            product_id: savedProductId,
            question: f.question,
            answer: f.answer,
            display_order: i
          }))
          await supabase.from('product_faqs').insert(faqsToInsert)
        }
      }

      navigate('/admin/products')
    } catch (error: any) {
      console.error('Save failed:', error)
      alert('Failed to save product: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div>Loading editor...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/admin/products')} className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Create New Product' : 'Edit Product'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Product Name</label>
              <div className="mt-2">
                <input required type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="slug" className="block text-sm font-medium leading-6 text-gray-900">Slug</label>
              <div className="mt-2">
                <input required type="text" name="slug" id="slug" value={formData.slug} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="sku" className="block text-sm font-medium leading-6 text-gray-900">SKU</label>
              <div className="mt-2">
                <input required type="text" name="sku" id="sku" value={formData.sku} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">Status</label>
              <div className="mt-2">
                <select name="status" id="status" value={formData.status} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:max-w-xs sm:text-sm sm:leading-6 px-3">
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="category_id" className="block text-sm font-medium leading-6 text-gray-900">Category</label>
              <div className="mt-2">
                <select name="category_id" id="category_id" value={formData.category_id} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3">
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="short_description" className="block text-sm font-medium leading-6 text-gray-900">Short Description</label>
              <div className="mt-2">
                <textarea name="short_description" id="short_description" rows={3} value={formData.short_description} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
            </div>

            <div className="col-span-full mt-4">
              <ImageUploader 
                productId={id || 'new'} 
                images={images} 
                onUploadComplete={loadData} 
              />
            </div>

            <div className="col-span-full mt-4 border-t pt-8">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">FAQs</h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={faq.id || index} className="p-4 border rounded-md bg-gray-50 flex flex-col gap-2 relative">
                    <button type="button" onClick={() => setFaqs(f => f.filter((_, i) => i !== index))} className="absolute top-2 right-2 text-red-500 hover:text-red-700">Delete</button>
                    <input type="text" placeholder="Question" className="border px-2 py-1 rounded pr-16" value={faq.question} onChange={e => {
                      const nf = [...faqs]; nf[index].question = e.target.value; setFaqs(nf);
                    }} />
                    <textarea placeholder="Answer" className="border px-2 py-1 rounded" rows={2} value={faq.answer} onChange={e => {
                      const nf = [...faqs]; nf[index].answer = e.target.value; setFaqs(nf);
                    }} />
                  </div>
                ))}
                <button type="button" onClick={() => setFaqs(f => [...f, { question: '', answer: '' }])} className="text-sm text-primary hover:underline">+ Add FAQ</button>
              </div>
            </div>

          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button type="button" onClick={() => navigate('/admin/products')} className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
          <button type="submit" disabled={isSaving} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary flex items-center">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
