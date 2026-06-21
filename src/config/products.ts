import type { Product } from '@/types/product'

export const products: Product[] = [
  {
    id: 'prod-001',
    slug: 'bamboo-toothbrush',
    sku: 'ECO-TB-001',
    name: 'Premium Bamboo Toothbrush',
    category: 'Dental Care',
    shortDescription: 'biodegradable bamboo toothbrush with soft, BPA-free bristles.',
    fullDescription: 'Make your morning routine sustainable with our premium bamboo toothbrush. Designed with a beautifully crafted, ergonomic bamboo handle and soft, BPA-free bristles, it provides a superior clean while keeping plastic out of our oceans. Naturally antimicrobial and biodegradable.',
    images: ['/assets/toothbrush.jpeg'],
    gallery: [
      '/assets/toothbrush.jpeg',
      'https://images.unsplash.com/photo-1608248593458-154df2416bc2?auto=format&fit=crop&q=80&w=800'
    ],
    benefits: [
      'biodegradable handle',
      'Soft, BPA-free bristles for sensitive gums',
      'Naturally antimicrobial',
      'Vegan and cruelty-free',
      'Zero-waste packaging'
    ],
    specifications: {
      'Material': 'Moso Bamboo, Nylon-4 bristles',
      'Length': '19 cm',
      'Weight': '15g',
      'Lifespan': '3-4 months'
    },
    ingredientsOrMaterials: ['Moso Bamboo', 'BPA-Free Nylon-4'],
    usageInstructions: ['Brush gently in circular motions for 2 minutes.', 'Rinse thoroughly after use.'],
    maintenanceInstructions: ['Store in a dry, well-ventilated area.', 'Do not leave sitting in water.', 'Replace every 3 months or when bristles fray.'],
    sustainabilityImpact: 'Saves 4 plastic toothbrushes per year from entering landfills. Bamboo is a fast-growing, renewable resource that requires no pesticides.',
    faqs: [
      { question: 'How do I dispose of the toothbrush?', answer: 'Snap off the bristle head and dispose of it in regular trash. The bamboo handle can be composted.' },
      { question: 'Are the bristles biodegradable?', answer: 'Currently, the bristles are made of BPA-free Nylon-4, which is technically biodegradable under certain conditions, but we recommend removing them before composting the handle.' }
    ],
    tags: ['bamboo', 'toothbrush', 'dental', 'zero-waste'],
    relatedProducts: ['neem-comb', 'bamboo-cotton-earbuds'],
    seoMetadata: {
      title: 'Premium Bamboo Toothbrush | Ecoji',
      description: 'Switch to a sustainable smile with our biodegradable bamboo toothbrush.'
    },
    qrCodeLink: '/products/bamboo-toothbrush'
  },
  {
    id: 'prod-002',
    slug: 'neem-comb',
    sku: 'ECO-NC-001',
    name: 'Pure Neem Wood Comb',
    category: 'Hair Care',
    shortDescription: 'Handcrafted neem wood comb for healthy hair and scalp.',
    fullDescription: 'Our pure neem wood comb is a natural, sustainable alternative to plastic combs. Handcrafted by artisans, the wooden teeth gently massage the scalp, distributing natural oils and preventing static. Neem wood is known for its antibacterial properties, promoting a healthier scalp and reducing dandruff.',
    images: ['https://images.unsplash.com/photo-1598452963314-b09f397a5c48?auto=format&fit=crop&q=80&w=800'],
    gallery: [
      'https://images.unsplash.com/photo-1598452963314-b09f397a5c48?auto=format&fit=crop&q=80&w=800'
    ],
    benefits: [
      'Prevents static and frizz',
      'Distributes natural oils evenly',
      'Antibacterial properties help reduce dandruff',
      'Gentle on scalp and hair cuticles',
      '100% natural and biodegradable'
    ],
    specifications: {
      'Material': '100% Pure Neem Wood',
      'Size': '18 cm x 5 cm',
      'Weight': '40g'
    },
    ingredientsOrMaterials: ['Neem Wood'],
    usageInstructions: ['Comb gently from roots to ends.', 'Use on dry or slightly damp hair.'],
    maintenanceInstructions: ['Wipe clean with a dry cloth.', 'Do not wash with water. If needed, wipe with natural oils like coconut or olive oil.'],
    sustainabilityImpact: 'Replaces plastic combs that take hundreds of years to decompose. Handcrafted using sustainably sourced neem wood.',
    faqs: [
      { question: 'Can I use this on wet hair?', answer: 'We recommend using it on dry or slightly damp hair to prevent the wood from swelling.' },
      { question: 'How do I clean the comb?', answer: 'Wipe it with a dry cloth. For deeper cleaning, apply a little natural oil and wipe clean.' }
    ],
    tags: ['neem', 'comb', 'haircare', 'wooden'],
    relatedProducts: ['natural-loofah'],
    seoMetadata: {
      title: 'Pure Neem Wood Comb | Ecoji',
      description: 'Handcrafted neem wood comb with antibacterial properties for healthy hair.'
    },
    qrCodeLink: '/products/neem-comb'
  },
  {
    id: 'prod-003',
    slug: 'natural-loofah',
    sku: 'ECO-NL-001',
    name: 'Organic Natural Loofah',
    category: 'Body Care',
    shortDescription: 'Exfoliating body sponge made from 100% natural dried gourd.',
    fullDescription: 'Elevate your shower routine with our organic natural loofah. Harvested from the Luffa plant, this fully biodegradable sponge gently exfoliates dead skin cells, promoting circulation and leaving your skin smooth and rejuvenated. It expands and softens when wet for a luxurious lather.',
    images: ['https://images.unsplash.com/photo-1629851614214-4340dcc2eb5c?auto=format&fit=crop&q=80&w=800'],
    gallery: [
      'https://images.unsplash.com/photo-1629851614214-4340dcc2eb5c?auto=format&fit=crop&q=80&w=800'
    ],
    benefits: [
      'Natural exfoliation for smoother skin',
      'Improves blood circulation',
      'Expands and softens when wet',
      '100% compostable and vegan',
      'A great alternative to synthetic plastic sponges'
    ],
    specifications: {
      'Material': 'Dried Luffa Gourd',
      'Size': 'Approx 15 cm (sizes may vary slightly)',
      'Weight': '20g'
    },
    ingredientsOrMaterials: ['Luffa Aegyptiaca (Gourd)'],
    usageInstructions: ['Soak in warm water until soft before first use.', 'Apply soap or body wash and scrub gently in circular motions.'],
    maintenanceInstructions: ['Rinse thoroughly after each use.', 'Squeeze out excess water and hang to dry in a well-ventilated area.', 'Boil for 2 minutes once a month to sanitize.'],
    sustainabilityImpact: 'Replaces microplastic-shedding synthetic sponges. 100% home compostable at the end of its life.',
    faqs: [
      { question: 'Is it too rough for sensitive skin?', answer: 'When fully soaked in warm water, it softens significantly. However, use gentle pressure if you have sensitive skin.' },
      { question: 'When should I replace it?', answer: 'We recommend replacing your loofah every 4-6 weeks for hygiene purposes.' }
    ],
    tags: ['loofah', 'bath', 'exfoliation', 'sponge'],
    relatedProducts: ['bamboo-toothbrush'],
    seoMetadata: {
      title: 'Organic Natural Loofah | Ecoji',
      description: '100% natural, biodegradable exfoliating loofah for smooth, healthy skin.'
    },
    qrCodeLink: '/products/natural-loofah'
  },
  {
    id: 'prod-004',
    slug: 'bamboo-cotton-earbuds',
    sku: 'ECO-CE-001',
    name: 'Bamboo Cotton Earbuds',
    category: 'Personal Care',
    shortDescription: 'biodegradable earbuds with bamboo sticks and pure cotton tips.',
    fullDescription: 'Ditch the plastic with our eco-friendly bamboo cotton earbuds. Made with sustainably sourced bamboo sticks and dual-tipped with soft, 100% pure organic cotton. Perfect for personal care, makeup application, and cleaning delicate items, while being completely gentle on the planet.',
    images: ['https://images.unsplash.com/photo-1620061280387-a2f6fb39f60e?auto=format&fit=crop&q=80&w=800'],
    gallery: [
      'https://images.unsplash.com/photo-1620061280387-a2f6fb39f60e?auto=format&fit=crop&q=80&w=800'
    ],
    benefits: [
      'biodegradable and compostable',
      'Stronger than paper-stick alternatives',
      'Soft, organic cotton tips',
      'Versatile for personal and beauty care',
      'Plastic-free packaging'
    ],
    specifications: {
      'Quantity': '200 pieces per box',
      'Material': 'Bamboo stick, Organic Cotton',
      'Length': '7.5 cm'
    },
    ingredientsOrMaterials: ['Bamboo', 'Organic Cotton'],
    usageInstructions: ['Use gently for external ear cleaning, makeup application, or arts and crafts.', 'Do not insert into the ear canal.'],
    maintenanceInstructions: ['Store in a dry place.'],
    sustainabilityImpact: 'Prevents thousands of plastic cotton swabs from polluting beaches and oceans.',
    faqs: [
      { question: 'Are these safe for cleaning ears?', answer: 'They are safe for cleaning the outer ear, but medical professionals advise against inserting any objects into the ear canal.' },
      { question: 'How do I dispose of them?', answer: 'They can be safely disposed of in your home compost bin.' }
    ],
    tags: ['cotton', 'earbuds', 'bamboo', 'hygiene'],
    relatedProducts: ['bamboo-toothbrush', 'natural-loofah'],
    seoMetadata: {
      title: 'Bamboo Cotton Earbuds | Ecoji',
      description: 'biodegradable bamboo and organic cotton earbuds. The perfect plastic-free alternative.'
    },
    qrCodeLink: '/products/bamboo-cotton-earbuds'
  }
]

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug)
}

export const getRelatedProducts = (slugs: string[]): Product[] => {
  return products.filter(p => slugs.includes(p.slug))
}
