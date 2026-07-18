import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Home as HomeIcon, BookOpen, Leaf, MessageSquare, Globe, Sparkles } from 'lucide-react'
import { HeroSectionEditor } from './components/HeroSectionEditor'
import { RepeaterListEditor } from './components/RepeaterListEditor'
import { RichTextEditor } from './components/RichTextEditor'
import { BrochureEditor } from './components/BrochureEditor'

export const PagesCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'sustainability' | 'contact' | 'global'>('home')
  const [sectionsData, setSectionsData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    setIsLoading(true)
    try {
      const allSections = await api.pagesContent.list()
      const dataMap: Record<string, any> = {}
      allSections.forEach((s: any) => {
        dataMap[`${s.page_slug}:${s.section_key}`] = s.content
      })
      setSectionsData(dataMap)
    } catch (err) {
      console.error('Failed to load CMS data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSection = async (pageSlug: string, sectionKey: string, title: string, content: any) => {
    await api.pagesContent.upsert({
      page_slug: pageSlug,
      section_key: sectionKey,
      title,
      content,
      is_active: true
    })
    setSectionsData(prev => ({ ...prev, [`${pageSlug}:${sectionKey}`]: content }))
  }

  const tabs = [
    { id: 'home', label: 'Home Page', icon: HomeIcon },
    { id: 'about', label: 'About Us', icon: BookOpen },
    { id: 'sustainability', label: 'Sustainability', icon: Leaf },
    { id: 'contact', label: 'Contact & FAQs', icon: MessageSquare },
    { id: 'global', label: 'Global Layout', icon: Globe },
  ] as const

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-primary" /> Pages & Section CMS
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Real-time content manager for Home, About, Sustainability, Contact/FAQs, and Global sections. Changes publish instantly.
        </p>
      </div>

      {/* Tabs */}
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

      {/* Tab Panels */}
      <div className="space-y-8 animate-fade-in">
        
        {/* HOME PAGE */}
        {activeTab === 'home' && (
          <>
            <HeroSectionEditor
              pageSlug="home"
              sectionKey="hero"
              title="Home Hero Banner"
              initialContent={sectionsData['home:hero'] || {
                badgeText: 'Biodegradable & Plastic-Free',
                heading: "Nature's Purest\nMasterpiece.",
                subheading: 'Discover export-quality, zero-waste essentials crafted from organic bamboo, neem wood, and natural gourd. Uncompromising durability meets everyday sustainability.',
                primaryBtnText: 'Explore Products',
                primaryBtnLink: '/products',
                secondaryBtnText: 'Our Mission',
                secondaryBtnLink: '/about'
              }}
              onSave={(content) => handleSaveSection('home', 'hero', 'Home Hero Banner', content)}
            />

            <BrochureEditor
              pageSlug="home"
              sectionKey="brochure"
              title="Interactive 3D Brochure & Catalog (`home/brochure`)"
              initialContent={sectionsData['home:brochure'] || {
                badgeText: 'Interactive Flipbook Catalog',
                heading: 'Explore Our 2026 Export Brochure',
                subheading: 'Experience our complete product specs, export tiers, and zero-waste manufacturing lifecycle directly in your browser.',
                pdfUrl: '',
                pages: [
                  { title: 'Cover & Vision', imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop', description: 'Zero-Waste & Plastic-Free Innovation' },
                  { title: 'Organic Bamboo Range', imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=800&auto=format&fit=crop', description: 'Certified Antimicrobial Brushes & Utensils' },
                  { title: 'Neem Wood Craftsmanship', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop', description: 'Handcrafted Combs & Culinary Boards' },
                  { title: 'Natural Loofah & Gourd', imageUrl: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=800&auto=format&fit=crop', description: 'Unbleached Exfoliators & Scrubbers' },
                  { title: 'Bulk & OEM Customization', imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=800&auto=format&fit=crop', description: 'Custom Laser Engraving & Eco Packaging' },
                  { title: 'Sustainability Metrics', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop', description: '50,000+ Tons of Plastic Prevented' }
                ]
              }}
              onSave={(content) => handleSaveSection('home', 'brochure', 'Interactive 3D Brochure & Catalog', content)}
            />

            <RepeaterListEditor
              pageSlug="home"
              sectionKey="hero_floating_cards"
              title="Hero Floating Glassmorphic Stats Cards"
              subtitle="The 3 floating cards displayed over the main hero banner on desktop and tablet (`home/hero_floating_cards`)."
              itemType="cards"
              initialItems={sectionsData['home:hero_floating_cards']?.items || [
                { badge: 'Global Standard', title: 'Export Quality Certified', description: 'Top Left Floating Card' },
                { badge: 'Impact Driven', title: '50k+ Tons Plastic Prevented', description: 'Bottom Right Floating Card' },
                { badge: '100% Certified', title: 'Cruelty-Free & Ethical', description: 'Top Right Floating Card' }
              ]}
              onSave={(items) => handleSaveSection('home', 'hero_floating_cards', 'Hero Floating Glassmorphic Stats Cards', { items })}
            />

            <RepeaterListEditor
              pageSlug="home"
              sectionKey="features"
              title="Home Feature Section (3 Pillars Grid below Hero)"
              subtitle="The 3 main value proposition cards (`home/features`) shown right below the hero section on the homepage."
              itemType="cards"
              initialItems={sectionsData['home:features']?.items || [
                { title: 'Biodegradable', badge: 'Compostable', description: 'Every product is crafted from nature and returns to nature without leaving a trace.' },
                { title: 'Export Quality', badge: 'Certified', description: 'Premium craftsmanship that meets global standards for durability and performance.' },
                { title: 'Cruelty Free', badge: 'Ethical', description: 'We love animals. None of our products or materials are ever tested on animals.' }
              ]}
              onSave={(items) => handleSaveSection('home', 'features', 'Home Feature Section Cards', { items })}
            />

            <RichTextEditor
              pageSlug="home"
              sectionKey="products_header"
              title="Home Featured Products Header"
              initialTitle={sectionsData['home:products_header']?.title || 'Featured Essentials'}
              initialParagraphs={sectionsData['home:products_header']?.paragraphs || [
                'Every product in our collection is rigorously designed to eliminate single-use plastics without compromising on everyday luxury.'
              ]}
              initialQuote={sectionsData['home:products_header']?.quote || 'Certified Biodegradable • Zero-Waste Shipping'}
              onSave={(content) => handleSaveSection('home', 'products_header', 'Home Featured Products Header', content)}
            />
          </>
        )}

        {/* ABOUT US */}
        {activeTab === 'about' && (
          <>
            <HeroSectionEditor
              pageSlug="about"
              sectionKey="hero"
              title="About Us Header Banner"
              initialContent={sectionsData['about:hero'] || {
                badgeText: 'Our Mission & Vision',
                heading: 'Our Story',
                subheading: 'Proving that premium quality and absolute sustainability can, and must, exist together.',
                primaryBtnText: 'Join the Movement',
                primaryBtnLink: '/sustainability',
                secondaryBtnText: 'Get in Touch',
                secondaryBtnLink: '/contact'
              }}
              onSave={(content) => handleSaveSection('about', 'hero', 'About Us Header Banner', content)}
            />

            <RichTextEditor
              pageSlug="about"
              sectionKey="story"
              title="Our Story & Philosophy"
              initialTitle={sectionsData['about:story']?.title || 'Born from a simple realization'}
              initialParagraphs={sectionsData['about:story']?.paragraphs || [
                'Everyday products were leaving a permanent scar on our planet. We set out to create a brand that proves sustainability and premium quality can go hand-in-hand.',
                'We traveled, researched, and partnered with artisans to bring you everyday essentials that are biodegradable, ethically sourced, and beautifully designed.'
              ]}
              initialQuote={sectionsData['about:story']?.quote || 'Radical Transparency. Circular Innovation. Uncompromising Quality.'}
              onSave={(content) => handleSaveSection('about', 'story', 'Our Story & Philosophy', content)}
            />

            <RepeaterListEditor
              pageSlug="about"
              sectionKey="values"
              title="Core Values Grid"
              subtitle="The pillars that define Ecoji's design and manufacturing standard."
              itemType="cards"
              initialItems={sectionsData['about:values']?.items || [
                { title: 'Our Vision', description: 'We envision a world where zero-waste living is not a compromise, but a standard. A world where every product in your home is crafted from nature and returns to nature seamlessly.' },
                { title: 'Our Mission', description: 'To provide accessible, high-quality, and eco-friendly alternatives to everyday plastic products, empowering individuals to make conscious choices for massive collective impact.' }
              ]}
              onSave={(items) => handleSaveSection('about', 'values', 'Core Values Grid', { items })}
            />

            <RichTextEditor
              pageSlug="about"
              sectionKey="philosophy"
              title="Manufacturing & Craftsmanship Philosophy"
              initialTitle={sectionsData['about:philosophy']?.title || 'Manufacturing Philosophy'}
              initialParagraphs={sectionsData['about:philosophy']?.paragraphs || [
                'We believe in radical transparency. Our processes prioritize ethical labor, minimalistic processing, and maximum utilization of raw materials. We craft solutions with care and responsibility.'
              ]}
              initialQuote={sectionsData['about:philosophy']?.quote || ''}
              onSave={(content) => handleSaveSection('about', 'philosophy', 'Manufacturing & Craftsmanship Philosophy', content)}
            />
          </>
        )}

        {/* SUSTAINABILITY */}
        {activeTab === 'sustainability' && (
          <>
            <HeroSectionEditor
              pageSlug="sustainability"
              sectionKey="hero"
              title="Sustainability Header Banner"
              initialContent={sectionsData['sustainability:hero'] || {
                badgeText: 'The Ecoji Promise',
                heading: 'A cleaner Earth.',
                subheading: 'Every product we make is a deliberate step towards reversing the plastic crisis. Here is how we build a greener tomorrow.',
                primaryBtnText: 'Explore Collection',
                primaryBtnLink: '/products',
                secondaryBtnText: 'View Certifications',
                secondaryBtnLink: '/about'
              }}
              onSave={(content) => handleSaveSection('sustainability', 'hero', 'Sustainability Header Banner', content)}
            />

            <RepeaterListEditor
              pageSlug="sustainability"
              sectionKey="stats"
              title="Impact Counter Stats"
              subtitle="Live animated counters shown across the sustainability dashboard."
              itemType="stats"
              initialItems={sectionsData['sustainability:stats']?.items || [
                { value: 2500, suffix: 'K+', label: 'Plastic Brushes Replaced' },
                { value: 120, suffix: 'Tons', label: 'Ocean Waste Diverted' },
                { value: 100, suffix: '%', label: 'Biodegradable Handles' },
                { value: 50, suffix: 'K+', label: 'Trees Planted via Partners' }
              ]}
              onSave={(items) => handleSaveSection('sustainability', 'stats', 'Impact Counter Stats', { items })}
            />

            <RichTextEditor
              pageSlug="sustainability"
              sectionKey="supply_chain"
              title="Supply Chain & Packaging Policy"
              initialTitle={sectionsData['sustainability:supply_chain']?.title || 'Plastic-Free Supply Chain'}
              initialParagraphs={sectionsData['sustainability:supply_chain']?.paragraphs || [
                'Our commitment does not stop at the product. We ensure that our entire logistics network, from packaging to shipping, is plastic-free.',
                'We partner exclusively with FSC-certified bamboo cooperatives and utilize carbon-neutral shipping routes whenever possible.'
              ]}
              initialQuote={sectionsData['sustainability:supply_chain']?.quote || 'Certified 100% Zero-Waste Logistics Workflow.'}
              onSave={(content) => handleSaveSection('sustainability', 'supply_chain', 'Supply Chain Policy', content)}
            />

            <RichTextEditor
              pageSlug="sustainability"
              sectionKey="regenerative"
              title="Regenerative Materials"
              initialTitle={sectionsData['sustainability:regenerative']?.title || 'Regenerative Materials'}
              initialParagraphs={sectionsData['sustainability:regenerative']?.paragraphs || [
                'We use fast-growing, highly renewable resources like Moso bamboo, neem wood, and natural gourd. These require minimal water and zero pesticides.'
              ]}
              initialQuote={sectionsData['sustainability:regenerative']?.quote || ''}
              onSave={(content) => handleSaveSection('sustainability', 'regenerative', 'Regenerative Materials', content)}
            />

            <RichTextEditor
              pageSlug="sustainability"
              sectionKey="microplastics"
              title="Zero Microplastics & Closed-Loop Lifecycle"
              initialTitle={sectionsData['sustainability:microplastics']?.title || 'Zero Microplastics'}
              initialParagraphs={sectionsData['sustainability:microplastics']?.paragraphs || [
                'Single-use plastics fragment into toxic microplastics that enter the global food chain and water supply.',
                'Our products fully biodegrade cleanly in rich organic soil or compost, leaving zero synthetic residues or harmful trace toxins.'
              ]}
              initialQuote={sectionsData['sustainability:microplastics']?.quote || 'Protecting Natural Ecosystems Forever'}
              onSave={(content) => handleSaveSection('sustainability', 'microplastics', 'Zero Microplastics', content)}
            />

            <RichTextEditor
              pageSlug="sustainability"
              sectionKey="ethical_sourcing"
              title="Ethical & Transparent Sourcing"
              initialTitle={sectionsData['sustainability:ethical_sourcing']?.title || 'Ethical & Transparent Sourcing'}
              initialParagraphs={sectionsData['sustainability:ethical_sourcing']?.paragraphs || [
                'True sustainability demands fair human labor and community welfare. We partner directly with family-run cooperatives and traditional artisans.',
                'Every artisan is paid living wages above regional standards with comprehensive health protection and safe working environments.'
              ]}
              initialQuote={sectionsData['sustainability:ethical_sourcing']?.quote || 'Certified Ethical Labor Standards'}
              onSave={(content) => handleSaveSection('sustainability', 'ethical_sourcing', 'Ethical & Transparent Sourcing', content)}
            />
          </>
        )}

        {/* CONTACT & FAQS */}
        {activeTab === 'contact' && (
          <>
            <HeroSectionEditor
              pageSlug="contact"
              sectionKey="header"
              title="Contact Page Header"
              initialContent={sectionsData['contact:header'] || {
                badgeText: 'Customer Care & Support',
                heading: 'Get In Touch.',
                subheading: 'Whether you have a question about our products, sustainability practices, or wholesale, our team is here to help.',
                primaryBtnText: 'Send Message',
                primaryBtnLink: '#contact-form',
                secondaryBtnText: 'General FAQs',
                secondaryBtnLink: '#faq-section'
              }}
              onSave={(content) => handleSaveSection('contact', 'header', 'Contact Page Header', content)}
            />

            <RepeaterListEditor
              pageSlug="contact"
              sectionKey="faqs"
              title="General Support FAQs (`contact/faqs`)"
              subtitle="Frequently Asked Questions displayed on the Contact/Support page."
              itemType="faqs"
              initialItems={sectionsData['contact:faqs']?.items || [
                { question: 'Do you ship internationally?', answer: 'Yes, we offer carbon-neutral international shipping to select countries.' },
                { question: 'What is your return policy?', answer: 'We accept returns within 30 days for unused products in their original plastic-free packaging.' },
                { question: 'Do you offer wholesale?', answer: 'Yes! Please contact us at wholesale@ecoji.com for bulk orders.' },
                { question: 'How do I track my order?', answer: 'Once your order ships, you will receive a tracking link via email.' }
              ]}
              onSave={(items) => handleSaveSection('contact', 'faqs', 'General Support FAQs', { items })}
            />
          </>
        )}

        {/* GLOBAL HEADER & FOOTER */}
        {activeTab === 'global' && (
          <>
            <RichTextEditor
              pageSlug="global"
              sectionKey="footer_info"
              title="Global Footer Slogan & Copyright"
              initialTitle={sectionsData['global:footer_info']?.title || 'Ecoji Official'}
              initialParagraphs={sectionsData['global:footer_info']?.paragraphs || [
                'Crafting sustainable, zero-waste daily care products for conscious consumers worldwide. Making sustainability effortless and beautiful.'
              ]}
              initialQuote={sectionsData['global:footer_info']?.quote || '© 2026 Ecoji Inc. All rights reserved. 100% Plastic-Free.'}
              onSave={(content) => handleSaveSection('global', 'footer_info', 'Global Footer Slogan', content)}
            />
          </>
        )}

      </div>
    </div>
  )
}
