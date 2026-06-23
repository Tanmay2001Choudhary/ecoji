import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { products } from '../config/products'

import 'dotenv/config'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

async function uploadImage(urlOrPath: string, productId: string, index: number) {
  // To avoid local Node.js network hangs with Supabase Storage form-data, 
  // we will just seed the database using the original URLs or local /assets/ paths.
  // The frontend can render these normally. Future uploads from the browser will go to the bucket.
  return urlOrPath
}

async function runMigration() {
  console.log('Starting migration...')

  // 1. Extract and Insert Categories
  console.log('Migrating Categories...')
  const uniqueCategories = Array.from(new Set(products.map(p => p.category)))
  
  for (const catName of uniqueCategories) {
    const slug = slugify(catName)
    const { error } = await supabase.from('categories').upsert({
      name: catName,
      slug: slug,
      is_active: true
    }, { onConflict: 'slug' })

    if (error) console.error(`Error inserting category ${catName}:`, error.message)
  }

  // Fetch created categories to map IDs
  const { data: categoriesData } = await supabase.from('categories').select('id, name')
  const categoryMap = new Map(categoriesData?.map(c => [c.name, c.id]))

  // 2. Insert Products
  console.log('Migrating Products...')
  const productSlugToId = new Map<string, string>()

  for (const [index, p] of products.entries()) {
    console.log(`Processing product: ${p.name}`)
    
    // Check if product already exists to avoid duplication errors on re-runs
    let { data: existingProduct } = await supabase.from('products').select('id').eq('slug', p.slug).single()
    let productId = existingProduct?.id

    if (!productId) {
      const categoryId = categoryMap.get(p.category)
      
      const { data: newProduct, error: prodError } = await supabase.from('products').insert({
        slug: p.slug,
        sku: p.sku,
        name: p.name,
        category_id: categoryId,
        short_description: p.shortDescription,
        full_description: p.fullDescription,
        benefits: p.benefits || [],
        specifications: p.specifications || {},
        ingredients_materials: p.ingredientsOrMaterials || [],
        usage_instructions: p.usageInstructions || [],
        maintenance_instructions: p.maintenanceInstructions || [],
        sustainability_impact: p.sustainabilityImpact,
        seo_title: p.seoMetadata?.title,
        seo_description: p.seoMetadata?.description,
        seo_keywords: p.tags || [],
        status: 'PUBLISHED',
        display_order: index
      }).select('id').single()

      if (prodError) {
        console.error(`Error inserting product ${p.name}:`, prodError.message)
        continue
      }
      productId = newProduct.id
    }
    
    productSlugToId.set(p.slug, productId)

    // 3. Migrate Images
    console.log(`Migrating images for ${p.name}...`)
    
    // Primary images
    if (p.images && p.images.length > 0) {
      for (let i = 0; i < p.images.length; i++) {
        const publicUrl = await uploadImage(p.images[i], productId, i)
        if (publicUrl) {
          await supabase.from('product_images').insert({
            product_id: productId,
            url: publicUrl,
            alt_text: `${p.name} Image ${i + 1}`,
            is_primary: i === 0,
            display_order: i
          })
        }
      }
    }

    // Gallery images
    if (p.gallery && p.gallery.length > 0) {
      for (let i = 0; i < p.gallery.length; i++) {
        // Skip if this image is already the primary image (often duplicated in config)
        if (p.images && p.images.includes(p.gallery[i])) continue
        
        const publicUrl = await uploadImage(p.gallery[i], productId, i + 100) // offset index
        if (publicUrl) {
          await supabase.from('product_images').insert({
            product_id: productId,
            url: publicUrl,
            alt_text: `${p.name} Gallery ${i + 1}`,
            is_primary: false,
            display_order: i + 100
          })
        }
      }
    }

    // 4. Migrate FAQs
    if (p.faqs && p.faqs.length > 0) {
      console.log(`Migrating FAQs for ${p.name}...`)
      for (let i = 0; i < p.faqs.length; i++) {
        await supabase.from('product_faqs').insert({
          product_id: productId,
          question: p.faqs[i].question,
          answer: p.faqs[i].answer,
          display_order: i
        })
      }
    }
  }

  // 5. Migrate Related Products
  console.log('Migrating Related Products Relationships...')
  for (const p of products) {
    if (p.relatedProducts && p.relatedProducts.length > 0) {
      const sourceId = productSlugToId.get(p.slug)
      if (!sourceId) continue

      for (const relSlug of p.relatedProducts) {
        const targetId = productSlugToId.get(relSlug)
        if (targetId) {
          await supabase.from('product_related').upsert({
            product_id: sourceId,
            related_product_id: targetId
          }, { onConflict: 'product_id,related_product_id' })
        }
      }
    }
  }

  console.log('Migration completed successfully!')
}

runMigration()
