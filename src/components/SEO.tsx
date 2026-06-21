import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
}

const DEFAULT_TITLE = "Ecoji - Premium Eco-Friendly Products"
const DEFAULT_DESCRIPTION = "Discover export-quality, premium eco-friendly products like Bamboo Toothbrushes, Neem Combs, and Natural Loofahs. Switch to sustainable living with Ecoji."

export const SEO = ({ title, description, keywords, canonicalUrl }: SEOProps) => {
  const metaTitle = title ? `${title} | Ecoji` : DEFAULT_TITLE
  const metaDescription = description || DEFAULT_DESCRIPTION

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
    </Helmet>
  )
}
