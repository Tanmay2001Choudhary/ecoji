export interface SEOInfo {
  title?: string
  description?: string
  keywords?: string[]
}

export interface ProductFAQ {
  question: string
  answer: string
}

export interface Product {
  id: string
  slug: string
  sku: string
  name: string
  category: string
  shortDescription: string
  fullDescription: string
  images: string[]
  gallery: string[]
  benefits: string[]
  specifications: Record<string, string>
  ingredientsOrMaterials: string[]
  usageInstructions: string[]
  maintenanceInstructions: string[]
  sustainabilityImpact: string
  faqs: ProductFAQ[]
  tags: string[]
  relatedProducts: string[] // Array of product slugs
  seoMetadata?: SEOInfo
  qrCodeLink: string
}
