import { ProductCard } from '@/components/ProductCard'
import { ProductGallery } from '@/components/ProductGallery'
import { SafeHtmlRenderer } from '@/components/SafeHtmlRenderer'
import { SEO } from '@/components/SEO'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { shareQRCode } from '@/lib/share'
import { buildUrl } from '@/lib/url'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Copy, Download, Heart, Leaf, QrCode, Share2, ShieldCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import { Navigate, useParams } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

export const ProductDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const containerRef = useRef<HTMLDivElement>(null)

  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const data = await api.public.getProductBySlug(slug)

        // Map to expected format
        const mappedData = {
          ...data,
          category: data.categories?.name,
          shortDescription: data.short_description,
          fullDescription: data.full_description,
          gallery: data.product_images?.sort((a: any, b: any) => a.display_order - b.display_order).map((img: any) => img.url) || [],
          benefits: data.benefits || [],
          specifications: data.specifications || {},
          ingredientsOrMaterials: data.ingredients_materials || [],
          usageInstructions: data.usage_instructions || [],
          maintenanceInstructions: data.maintenance_instructions || [],
          sustainabilityImpact: data.sustainability_impact || '',
          faqs: data.product_faqs?.sort((a: any, b: any) => a.display_order - b.display_order) || [],
          affiliates: data.affiliate_links?.filter((a: any) => a.is_active) || [],
          seoMetadata: {
            title: data.seo_title,
            description: data.seo_description
          },
          qrCodeLink: `/products/${data.slug}`
        }
        setProduct(mappedData)

        // Fetch related products
        const relatedIds = data.product_related?.map((r: any) => r.related_product_id) || []
        if (relatedIds.length > 0) {
          const relatedData = await api.public.getProductsByIds(relatedIds)
          setRelatedProducts(relatedData.map((p: any) => ({
            ...p,
            shortDescription: p.short_description,
            category: p.categories?.name,
            images: p.product_images?.map((img: any) => img.url) || []
          })))
        } else {
          setRelatedProducts([])
        }
      } catch (error) {
        console.error('Error fetching product details:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  // GSAP Animations (Immediate smooth entrance without ScrollTrigger to prevent opacity bugs)
  useGSAP(() => {
    if (isLoading || !product) return

    gsap.fromTo('.gallery-thumbnails button',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power2.out', clearProps: 'all' }
    )
    gsap.fromTo('.gallery-main',
      { scale: 0.98, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out', clearProps: 'all' }
    )

    gsap.utils.toArray('.content-section').forEach((section: any) => {
      gsap.fromTo(section,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', clearProps: 'all' }
      )
    })
  }, { scope: containerRef, dependencies: [isLoading, product] })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-xl">Loading product details...</p>
      </div>
    )
  }

  if (!product) return <Navigate to="/products" />

  const fullUrl = buildUrl(product.qrCodeLink)

  const handleShare = () => {
    shareQRCode({
      elementId: "ProductQRCode",
      filename: `${product.slug}-qr.png`,
      title: `Ecoji - ${product.name}`,
      text: product.shortDescription,
      url: fullUrl
    })
  }

  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl)
  }

  const downloadQR = () => {
    const svg = document.getElementById("ProductQRCode");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${product.slug}-qr.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  }

  return (
    <div ref={containerRef} className="bg-background min-h-screen">
      <SEO
        title={product.seoMetadata?.title || product.name}
        description={product.seoMetadata?.description || product.shortDescription}
      />

      <div className="container py-12 md:py-24">
        {/* Main Product Layout */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative mb-32">

          {/* Left Column: Scrolling Gallery */}
          <div className="lg:w-3/5 gallery-container">
            <ProductGallery images={product.gallery} productName={product.name} />
          </div>

          {/* Right Column: Sticky Product Info */}
          <div className="lg:w-2/5">
            <div className="sticky top-24 space-y-10">
              {/* Core Info */}
              <div>
                <Badge variant="secondary" className="mb-6 text-sm px-4 py-1.5 rounded-full font-medium tracking-wide bg-primary/10 text-primary border-primary/20">{product.category}</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground leading-[1.1]">{product.name}</h1>
                <SafeHtmlRenderer html={product.shortDescription} className="text-xl text-muted-foreground leading-relaxed font-light [&_p]:m-0" />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4">
                {product.affiliates?.length > 0 ? (
                  <>
                    <h4 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-2">Available On</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {product.affiliates.map((aff: any) => (
                        <Button
                          key={aff.id}
                          size="lg"
                          variant="default"
                          className="w-full text-base h-14 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                          onClick={() => window.open(aff.url, '_blank', 'noopener,noreferrer')}
                        >
                          {aff.platform}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : (
                  <Button size="lg" className="w-full text-lg h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-primary text-primary-foreground" onClick={() => document.getElementById('story-section')?.scrollIntoView({ behavior: 'smooth' })}>
                    Discover Story
                  </Button>
                )}

                <Button size="lg" variant="outline" className="w-full text-lg h-16 rounded-full border-2 hover:bg-secondary/50 transition-all duration-300 mt-2" onClick={handleShare}>
                  <Share2 className="mr-2 h-5 w-5" /> Share Product
                </Button>
              </div>

              {/* Highlights & Specifications Accordion */}
              {((product.benefits?.length > 0) || (product.specifications && Object.keys(product.specifications).length > 0)) && (
                <Accordion className="w-full border-t border-border/40 pt-4">
                  {product.benefits?.length > 0 && (
                    <AccordionItem value="highlights" className="border-b-0">
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Highlights</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3 pb-6">
                        <ul className="list-disc pl-5 space-y-2">
                          {product.benefits.map((benefit: any, idx: number) => (
                            <li key={idx} className="text-base font-light leading-relaxed">
                              <SafeHtmlRenderer html={benefit} className="[&_p]:m-0 [&_p]:inline" />
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <AccordionItem value="specs" className="border-b-0 border-t border-border/40">
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Specifications</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-6">
                        <dl className="space-y-4">
                          {Object.entries(product.specifications).map(([key, value]: [string, any]) => (
                            <div key={key} className="grid grid-cols-3 border-b border-border/30 pb-3">
                              <dt className="font-medium text-foreground">{key}</dt>
                              <dd className="col-span-2 font-light">{String(value)}</dd>
                            </div>
                          ))}
                        </dl>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              )}

              {/* QR Code Utility Panel */}
              <div className="bg-gradient-to-br from-secondary/50 to-background border border-secondary rounded-[2rem] p-8 relative overflow-hidden group hover:border-primary/30 transition-colors duration-500 shadow-sm">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-150 duration-700 ease-out" />
                <h3 className="font-semibold text-xl mb-3 flex items-center gap-2">
                  <QrCode className="h-6 w-6 text-primary" /> Product Identity
                </h3>
                <p className="text-base text-muted-foreground mb-8 font-light leading-relaxed">Scan to view sustainability impact, disposal instructions, and verify authenticity.</p>
                <div className="flex items-center gap-6">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border shrink-0 transition-transform duration-500 group-hover:scale-105">
                    <QRCode
                      id="ProductQRCode"
                      value={fullUrl}
                      size={110}
                      level="H"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    <Button variant="secondary" className="w-full justify-start rounded-xl h-11 bg-background hover:bg-primary/10 transition-colors duration-300" onClick={downloadQR}>
                      <Download className="mr-2 h-4 w-4" /> Save QR
                    </Button>
                    <Button variant="ghost" className="w-full justify-start rounded-xl h-11 hover:bg-background transition-colors duration-300" onClick={copyLink}>
                      <Copy className="mr-2 h-4 w-4" /> Copy Link
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Deep Dive Sections */}
        <div className="max-w-5xl mx-auto space-y-32 mb-32">

          {product.fullDescription && product.fullDescription.trim().length > 0 && (
            <section id="story-section" className="content-section text-center space-y-8 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">The Story</h2>
              <SafeHtmlRenderer html={product.fullDescription} className="text-xl md:text-2xl leading-relaxed text-muted-foreground font-light text-center mx-auto" />
            </section>
          )}

          {((product.sustainabilityImpact && product.sustainabilityImpact.trim().length > 0) || product.ingredientsOrMaterials?.length > 0 || product.usageInstructions?.length > 0 || product.maintenanceInstructions?.length > 0) && (
            <section className={`content-section grid ${((product.sustainabilityImpact || product.ingredientsOrMaterials?.length > 0) && (product.usageInstructions?.length > 0 || product.maintenanceInstructions?.length > 0)) ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-2xl mx-auto'} gap-16 items-center`}>
              {((product.sustainabilityImpact && product.sustainabilityImpact.trim().length > 0) || product.ingredientsOrMaterials?.length > 0) && (
                <div className="space-y-8">
                  <div className="h-20 w-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center">
                    <Leaf className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight leading-tight">Sustainability Impact</h2>
                  {product.sustainabilityImpact && <SafeHtmlRenderer html={product.sustainabilityImpact} className="text-xl leading-relaxed text-muted-foreground font-light" />}
                  {product.ingredientsOrMaterials?.length > 0 && (
                    <div className="pt-4 flex flex-wrap gap-3">
                      {product.ingredientsOrMaterials.map((mat: any, idx: number) => (
                        <Badge key={idx} variant="outline" className="px-5 py-2.5 text-base font-normal rounded-full bg-secondary/30 border-secondary backdrop-blur-sm">{mat}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(product.usageInstructions?.length > 0 || product.maintenanceInstructions?.length > 0) && (
                <div className="bg-card border rounded-[2rem] p-10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 p-8 opacity-5 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-12">
                    <ShieldCheck className="w-80 h-80 text-foreground" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-8 tracking-tight">Care & Usage</h3>
                  <div className="space-y-8 relative z-10">
                    {product.usageInstructions?.length > 0 && (
                      <div>
                        <h4 className="text-lg font-medium text-foreground mb-4 flex items-center gap-3"><Heart className="w-5 h-5 text-primary" /> How to Use</h4>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 font-light text-lg leading-relaxed">
                          {product.usageInstructions.map((inst: any, i: number) => (
                            <li key={i}>
                              <SafeHtmlRenderer html={inst} className="[&_p]:m-0 [&_p]:inline" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {product.maintenanceInstructions?.length > 0 && (
                      <div>
                        <h4 className="text-lg font-medium text-foreground mb-4 flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-primary" /> Maintenance</h4>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 font-light text-lg leading-relaxed">
                          {product.maintenanceInstructions.map((inst: any, i: number) => (
                            <li key={i}>
                              <SafeHtmlRenderer html={inst} className="[&_p]:m-0 [&_p]:inline" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

          {product.faqs?.length > 0 && (
            <section className="content-section bg-secondary/20 rounded-[3rem] p-12 md:p-24 text-center border border-secondary/30">
              <h2 className="text-4xl font-bold tracking-tight mb-12">Frequently Asked Questions</h2>
              <div className="max-w-3xl mx-auto text-left">
                <Accordion className="w-full">
                  {product.faqs.map((faq: any, idx: number) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-border/50 py-4">
                      <AccordionTrigger className="text-xl font-medium hover:no-underline tracking-tight">{faq.question}</AccordionTrigger>
                      <AccordionContent className="pt-2 pb-6">
                        <SafeHtmlRenderer html={faq.answer} className="text-lg text-muted-foreground leading-relaxed font-light" />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>
          )}

        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="content-section border-t pt-24">
            <h2 className="text-4xl font-bold mb-16 text-center tracking-tight">Complete Your Routine</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {relatedProducts.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

