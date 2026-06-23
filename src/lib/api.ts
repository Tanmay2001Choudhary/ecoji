import { supabase } from './supabase'

export const api = {
  products: {
    async list() {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          sku,
          status,
          display_order,
          categories (
            id,
            name
          )
        `)
        .order('display_order', { ascending: true })

      if (error) throw error
      return data
    },
    async get(id: string) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    async create(product: any) {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()

      if (error) throw error
      return data
    },
    async update(id: string, product: any) {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    async uploadImage(file: File, productId: string) {
      const fileName = `${productId}/${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('products')
        .upload(fileName, file)

      if (error) throw error
      const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(fileName)
      return publicUrlData.publicUrl
    }
  },
  categories: {
    async list() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      return data
    }
  },
  settings: {
    async get() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single()

      if (error) throw error
      return data
    },
    async update(settings: any) {
      const { data, error } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', 1)
        .select()
        .single()

      if (error) throw error
      return data
    }
  },
  contacts: {
    async list() {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  },
  themes: {
    async list() {
      const { data, error } = await supabase.from('themes').select('*').order('created_at', { ascending: true })
      if (error) throw error
      return data
    }
  },
  fonts: {
    async list() {
      const { data, error } = await supabase.from('fonts').select('*').order('created_at', { ascending: true })
      if (error) throw error
      return data
    }
  },
  affiliates: {
    async list() {
      const { data, error } = await supabase
        .from('affiliate_links')
        .select(`
          *,
          products(name)
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    async create(affiliate: any) {
      const { data, error } = await supabase
        .from('affiliate_links')
        .insert(affiliate)
        .select()
        .single()
      if (error) throw error
      return data
    },
    async update(id: string, affiliate: any) {
      const { data, error } = await supabase
        .from('affiliate_links')
        .update(affiliate)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('affiliate_links')
        .delete()
        .eq('id', id)
      if (error) throw error
    }
  },
  public: {
    async getProducts() {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          product_images(url, is_primary)
        `)
        .eq('status', 'PUBLISHED')
        .is('deleted_at', null)
        .order('display_order', { ascending: true })
      
      if (error) throw error
      return data
    },
    async getProductBySlug(slug: string) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          product_images(url, is_primary, display_order),
          product_faqs(*),
          product_related!product_related_product_id_fkey(related_product_id),
          affiliate_links(*)
        `)
        .eq('slug', slug)
        .eq('status', 'PUBLISHED')
        .is('deleted_at', null)
        .single()
      
      if (error) throw error
      return data
    },
    async getCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      
      if (error) throw error
      return data
    },
    async getProductsByIds(ids: string[]) {
      if (ids.length === 0) return []
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          product_images(url, is_primary)
        `)
        .in('id', ids)
        .eq('status', 'PUBLISHED')
        .is('deleted_at', null)
      
      if (error) throw error
      return data
    },
    async searchProducts(query: string) {
      if (!query.trim()) return []
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          product_images(url, is_primary)
        `)
        .eq('status', 'PUBLISHED')
        .is('deleted_at', null)
        .or(`name.ilike.%${query}%,short_description.ilike.%${query}%,full_description.ilike.%${query}%`)
        .order('display_order', { ascending: true })
      
      if (error) throw error
      return data
    }
  }
}
