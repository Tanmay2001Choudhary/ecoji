import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { ArrowLeft, Save, Plus, Trash2, Layers, Sparkles, Sliders, Leaf, Heart, HelpCircle, Image as ImageIcon } from 'lucide-react'
import { ImageUploader } from '@/admin/components/ImageUploader'
import { RichTextarea } from '@/admin/components/RichTextarea'

export const ProductEditor: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [activeTab, setActiveTab] = useState<'basic' | 'story' | 'specs' | 'sustainability' | 'care' | 'faqs'>('basic')
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [images, setImages] = useState<any[]>([])
  const [faqs, setFaqs] = useState<any[]>([])

  // New Repeater States for rich sections
  const [benefits, setBenefits] = useState<string[]>([])
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([])
  const [ingredientsMaterials, setIngredientsMaterials] = useState<string[]>([])
  const [usageInstructions, setUsageInstructions] = useState<string[]>([])
  const [maintenanceInstructions, setMaintenanceInstructions] = useState<string[]>([])

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    category_id: '',
    status: 'DRAFT',
    short_description: '',
    full_description: '',
    sustainability_impact: '',
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
            sustainability_impact: product.sustainability_impact || '',
          })

          setBenefits(Array.isArray(product.benefits) ? product.benefits : [])
          
          // Map JSON specifications object to array
          if (product.specifications && typeof product.specifications === 'object') {
            const specsArr = Object.entries(product.specifications).map(([key, value]) => ({
              key,
              value: String(value || '')
            }))
            setSpecifications(specsArr)
          } else {
            setSpecifications([])
          }

          setIngredientsMaterials(Array.isArray(product.ingredients_materials) ? product.ingredients_materials : [])
          setUsageInstructions(Array.isArray(product.usage_instructions) ? product.usage_instructions : [])
          setMaintenanceInstructions(Array.isArray(product.maintenance_instructions) ? product.maintenance_instructions : [])

          // Load images
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
      // Build clean payload
      const cleanSpecifications: Record<string, string> = {}
      specifications.forEach(s => {
        if (s.key.trim()) {
          cleanSpecifications[s.key.trim()] = s.value.trim()
        }
      })

      const fullPayload = {
        ...formData,
        benefits: benefits.map(b => b.trim()).filter(Boolean),
        specifications: cleanSpecifications,
        ingredients_materials: ingredientsMaterials.map(m => m.trim()).filter(Boolean),
        usage_instructions: usageInstructions.map(u => u.trim()).filter(Boolean),
        maintenance_instructions: maintenanceInstructions.map(m => m.trim()).filter(Boolean),
      }

      let savedProductId = id
      if (isNew) {
        const newProd = await api.products.create(fullPayload)
        savedProductId = newProd.id
      } else if (id) {
        await api.products.update(id, fullPayload)
      }

      // Save FAQs
      if (savedProductId) {
        const { supabase } = await import('@/lib/supabase')
        await supabase.from('product_faqs').delete().eq('product_id', savedProductId)
        
        if (faqs.length > 0) {
          const faqsToInsert = faqs
            .filter(f => f.question?.trim() || f.answer?.trim())
            .map((f, i) => ({
              product_id: savedProductId,
              question: f.question.trim() || 'Question',
              answer: f.answer.trim() || 'Answer',
              display_order: i
            }))
          if (faqsToInsert.length > 0) {
            await supabase.from('product_faqs').insert(faqsToInsert)
          }
        }
      }

      alert('Product saved successfully with all detailed sections!')
      navigate('/admin/products')
    } catch (error: any) {
      console.error('Save failed:', error)
      alert('Failed to save product: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info & Media', icon: Layers },
    { id: 'story', label: 'Discovery & Highlights', icon: Sparkles },
    { id: 'specs', label: 'Specifications', icon: Sliders },
    { id: 'sustainability', label: 'Sustainability & Materials', icon: Leaf },
    { id: 'care', label: 'Care & Disposal', icon: Heart },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  ] as const

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            type="button" 
            onClick={() => navigate('/admin/products')} 
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? 'Create New Product' : `Edit: ${formData.name || 'Product'}`}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Edit all sections displayed on the product details page</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {tabs.map(t => {
          const Icon = t.icon
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg ring-1 ring-gray-900/5 rounded-2xl overflow-hidden">
        <div className="p-6 sm:p-10 space-y-8">
          
          {/* TAB 1: BASIC INFO & MEDIA */}
          {activeTab === 'basic' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" /> Core Information & Gallery
                </h2>
                <p className="text-sm text-gray-500">Basic identifiers and gallery thumbnails.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900">Product Name *</label>
                  <input required type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-2 block w-full rounded-xl border border-gray-300 py-2.5 px-3 text-gray-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm" placeholder="Organic Bamboo Toothbrush" />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="slug" className="block text-sm font-semibold text-gray-900">URL Slug *</label>
                  <input required type="text" name="slug" id="slug" value={formData.slug} onChange={handleChange} className="mt-2 block w-full rounded-xl border border-gray-300 py-2.5 px-3 text-gray-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm" placeholder="organic-bamboo-toothbrush" />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="sku" className="block text-sm font-semibold text-gray-900">SKU *</label>
                  <input required type="text" name="sku" id="sku" value={formData.sku} onChange={handleChange} className="mt-2 block w-full rounded-xl border border-gray-300 py-2.5 px-3 text-gray-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm" placeholder="ECO-BAM-001" />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="category_id" className="block text-sm font-semibold text-gray-900">Category *</label>
                  <select required name="category_id" id="category_id" value={formData.category_id} onChange={handleChange} className="mt-2 block w-full rounded-xl border border-gray-300 py-2.5 px-3 text-gray-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm bg-white">
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="status" className="block text-sm font-semibold text-gray-900">Status</label>
                  <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-2 block w-full rounded-xl border border-gray-300 py-2.5 px-3 text-gray-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm bg-white font-medium">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div className="col-span-full">
                  <label htmlFor="short_description" className="block text-sm font-semibold text-gray-900">Short Summary (Shown on Product Cards) *</label>
                  <RichTextarea required name="short_description" id="short_description" rows={3} value={formData.short_description || ''} onChange={(val) => setFormData(prev => ({ ...prev, short_description: val }))} className="mt-2" placeholder="A premium, biodegradable toothbrush made from sustainable Moso bamboo..." />
                </div>

                <div className="col-span-full border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary" /> Product Images Gallery (4:5 Aspect Ratio Recommended)
                  </h3>
                  <ImageUploader 
                    productId={id || 'new'} 
                    images={images} 
                    onUploadComplete={loadData} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DISCOVERY STORY & HIGHLIGHTS */}
          {activeTab === 'story' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> Discovery (The Story) & Highlights
                </h2>
                <p className="text-sm text-gray-500">The immersive product narrative and key benefit highlights.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="full_description" className="block text-sm font-semibold text-gray-900">Discovery Narrative / Full Story Paragraph *</label>
                  <p className="text-xs text-gray-500 mb-2">Displayed in the large center section ("The Story") on the details page.</p>
                  <RichTextarea 
                    name="full_description" 
                    id="full_description" 
                    rows={7} 
                    value={formData.full_description || ''} 
                    onChange={(val) => setFormData(prev => ({ ...prev, full_description: val }))} 
                    placeholder="Tell the detailed origin and sustainability mission behind this product..." 
                  />
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Highlights List (`benefits`)</h3>
                      <p className="text-xs text-gray-500">Bulleted points shown inside the Highlights accordion.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBenefits([...benefits, ''])}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Highlight
                    </button>
                  </div>

                  {benefits.length === 0 ? (
                    <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                      No highlights added yet. Click "+ Add Highlight" above.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
                          <input
                            type="text"
                            value={benefit}
                            onChange={(e) => {
                              const nb = [...benefits]
                              nb[idx] = e.target.value
                              setBenefits(nb)
                            }}
                            placeholder="e.g., 100% Biodegradable & Plastic-Free Handle"
                            className="flex-1 rounded-xl border border-gray-300 py-2 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            type="button"
                            onClick={() => setBenefits(benefits.filter((_, i) => i !== idx))}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-primary" /> Key-Value Specifications
                  </h2>
                  <p className="text-sm text-gray-500">Technical details displayed in the Specifications table accordion.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSpecifications([...specifications, { key: '', value: '' }])}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-semibold transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Specification Row
                </button>
              </div>

              {specifications.length === 0 ? (
                <div className="p-10 text-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm">
                  No specifications added yet. Click "+ Add Specification Row" to add properties like Length, Weight, or Material.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-4">Specification Key</div>
                    <div className="col-span-7">Specification Value</div>
                    <div className="col-span-1 text-right">Action</div>
                  </div>
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded-xl border border-gray-200/80">
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={spec.key}
                          onChange={(e) => {
                            const ns = [...specifications]
                            ns[idx].key = e.target.value
                            setSpecifications(ns)
                          }}
                          placeholder="e.g., Dimensions / Material"
                          className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                        />
                      </div>
                      <div className="col-span-7">
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const ns = [...specifications]
                            ns[idx].value = e.target.value
                            setSpecifications(ns)
                          }}
                          placeholder="e.g., 19cm Length x 1.5cm Width / 100% Organic Bamboo"
                          className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => setSpecifications(specifications.filter((_, i) => i !== idx))}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SUSTAINABILITY IMPACT & MATERIALS */}
          {activeTab === 'sustainability' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary" /> Sustainability Impact & Materials
                </h2>
                <p className="text-sm text-gray-500">Environmental footprint and certified materials tags.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="sustainability_impact" className="block text-sm font-semibold text-gray-900">Sustainability Impact Paragraph</label>
                  <p className="text-xs text-gray-500 mb-2">Displayed alongside the green leaf badge right above Care & Usage.</p>
                  <RichTextarea 
                    name="sustainability_impact" 
                    id="sustainability_impact" 
                    rows={5} 
                    value={formData.sustainability_impact || ''} 
                    onChange={(val) => setFormData(prev => ({ ...prev, sustainability_impact: val }))} 
                    placeholder="Describe how choosing this product reduces CO2 emissions, plastic waste, or supports reforestation..." 
                  />
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Ingredients / Certified Materials Pills (`ingredients_materials`)</h3>
                      <p className="text-xs text-gray-500">Tag badges displayed right under the sustainability paragraph.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIngredientsMaterials([...ingredientsMaterials, ''])}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 text-xs font-semibold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Material Tag
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {ingredientsMaterials.map((mat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full pl-3.5 pr-1.5 py-1">
                        <input
                          type="text"
                          value={mat}
                          onChange={(e) => {
                            const nm = [...ingredientsMaterials]
                            nm[idx] = e.target.value
                            setIngredientsMaterials(nm)
                          }}
                          placeholder="e.g., Moso Bamboo"
                          className="bg-transparent border-none text-emerald-900 text-xs font-medium focus:outline-none focus:ring-0 p-0 w-36"
                        />
                        <button
                          type="button"
                          onClick={() => setIngredientsMaterials(ingredientsMaterials.filter((_, i) => i !== idx))}
                          className="p-1 rounded-full hover:bg-emerald-200/50 text-emerald-700 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {ingredientsMaterials.length === 0 && (
                      <span className="text-xs text-gray-400 italic py-2">No material pills added yet.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CARE & DISPOSAL INSTRUCTIONS */}
          {activeTab === 'care' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" /> Care & Disposal / Compost Instructions
                </h2>
                <p className="text-sm text-gray-500">Bulleted usage instructions and end-of-life disposal guide.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* How to Use */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-primary" /> How to Use (`usage_instructions`)
                      </h3>
                      <p className="text-xs text-gray-500">Care & best practices during usage.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUsageInstructions([...usageInstructions, ''])}
                      className="p-1.5 rounded-lg bg-white border border-gray-200 text-primary hover:bg-primary/5 text-xs font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {usageInstructions.map((ins, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={ins}
                          onChange={(e) => {
                            const nu = [...usageInstructions]
                            nu[idx] = e.target.value
                            setUsageInstructions(nu)
                          }}
                          placeholder="e.g., Rinse thoroughly and store dry..."
                          className="flex-1 rounded-xl border border-gray-300 py-2 px-3 text-xs bg-white focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setUsageInstructions(usageInstructions.filter((_, i) => i !== idx))}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {usageInstructions.length === 0 && (
                      <p className="text-xs text-gray-400 italic text-center py-4">Click + to add usage instructions.</p>
                    )}
                  </div>
                </div>

                {/* How to Dispose */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-emerald-600" /> How to Dispose / Compost (`maintenance_instructions`)
                      </h3>
                      <p className="text-xs text-gray-500">End-of-life zero-waste instructions.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMaintenanceInstructions([...maintenanceInstructions, ''])}
                      className="p-1.5 rounded-lg bg-white border border-gray-200 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {maintenanceInstructions.map((ins, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={ins}
                          onChange={(e) => {
                            const nm = [...maintenanceInstructions]
                            nm[idx] = e.target.value
                            setMaintenanceInstructions(nm)
                          }}
                          placeholder="e.g., Remove bristles with pliers and compost the handle..."
                          className="flex-1 rounded-xl border border-gray-300 py-2 px-3 text-xs bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                        />
                        <button
                          type="button"
                          onClick={() => setMaintenanceInstructions(maintenanceInstructions.filter((_, i) => i !== idx))}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {maintenanceInstructions.length === 0 && (
                      <p className="text-xs text-gray-400 italic text-center py-4">Click + to add disposal instructions.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" /> Product FAQs
                  </h2>
                  <p className="text-sm text-gray-500">Questions and answers displayed at the bottom of the product details page.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-semibold transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add FAQ Item
                </button>
              </div>

              {faqs.length === 0 ? (
                <div className="p-10 text-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm">
                  No FAQs added yet. Click "+ Add FAQ Item" to answer common customer questions about this product.
                </div>
              ) : (
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={faq.id || index} className="p-5 border border-gray-200 rounded-2xl bg-gray-50/70 flex flex-col gap-3 relative transition-all hover:border-primary/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">FAQ Item #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
                          className="text-gray-400 hover:text-red-500 text-xs font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Question (e.g., How long does this toothbrush last?)"
                        className="w-full border border-gray-300 px-3.5 py-2 rounded-xl text-sm font-semibold bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                        value={faq.question}
                        onChange={(e) => {
                          const nf = [...faqs]
                          nf[index].question = e.target.value
                          setFaqs(nf)
                        }}
                      />
                      <RichTextarea
                        placeholder="Answer (e.g., With proper care, it lasts 3-4 months just like standard plastic toothbrushes...)"
                        rows={2}
                        value={faq.answer || ''}
                        onChange={(val) => {
                          const nf = [...faqs]
                          nf[index].answer = val
                          setFaqs(nf)
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/80 px-6 py-4 sm:px-10">
          <div className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            All sections will be saved simultaneously
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary flex items-center transition-all scale-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving Product...' : 'Save Complete Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
