# Ecoji Website Development Master Prompt

You are a Senior Staff Software Engineer, Solution Architect, UI/UX Designer, and Frontend Lead.

Your task is to design and develop a production-grade website for the Ecoji brand from scratch inside the provided project directory.

There is currently no React application in the directory. You must initialize and configure the complete project architecture, install all required dependencies, create the folder structure, configure tooling, and implement the entire application.

The final result should be a production-ready, scalable, maintainable, and highly reusable codebase suitable for long-term business growth.

## Initial Project Setup

Create the application from scratch using:

* React
* TypeScript
* Vite (Preferred)
* React Router
* Tailwind CSS
* ShadCN/UI
* Zustand
* GSAP
* Framer Motion
* Three.js
* React Three Fiber
* Drei
* React Query (if required)
* ESLint
* Prettier

Configure all tooling and dependencies automatically.

---

## Business Overview

Ecoji is an eco-friendly product brand.

Initial products include:

* Bamboo Toothbrush
* Neem Comb
* Natural Loofah
* Bamboo Cotton Earbuds

Every product will have a unique QR code.

When customers scan a QR code, they should be redirected to the product page where they can view detailed product information, sustainability information, usage instructions, FAQs, benefits, and related products.

The website should feel premium, modern, trustworthy, environmentally conscious, and export-quality.

---

## Development Approach

Before implementing features:

1. Create project architecture.
2. Configure routing.
3. Configure theme management.
4. Configure state management.
5. Create reusable component library.
6. Create product configuration system.
7. Create layout system.
8. Create animation system.
9. Create SEO system.
10. Implement pages.

Avoid hardcoded implementations whenever possible.

Everything should be configuration-driven.

---

## Project Deliverables

The AI should generate:

* Complete project structure
* Dependency installation commands
* Folder architecture
* Routing setup
* Theme setup
* Product management system
* QR code routing system
* Reusable UI component system
* Responsive layouts
* SEO setup
* Accessibility setup
* Performance optimizations
* Production-ready code

Do not build a prototype. Build the foundation as if Ecoji will eventually support hundreds of products and receive thousands of daily visitors.

[Continue with the remaining sections from the previous prompt: Product Management System, Pages, Theme Management, QR System, Animations, Performance, Accessibility, SEO, Folder Structure, Reusable Components, etc.]


---

# Product Schema

Design a complete schema that supports:

* id
* slug
* sku
* name
* category
* shortDescription
* fullDescription
* images
* gallery
* benefits
* specifications
* ingredientsOrMaterials
* usageInstructions
* maintenanceInstructions
* sustainabilityImpact
* faqs
* tags
* relatedProducts
* seoMetadata
* qrCodeLink

---

# Website Pages

Create the following pages.

## Home Page

Sections:

1. Hero Section
2. Featured Products
3. Why Ecoji
4. Sustainability Mission
5. Product Categories
6. Benefits Section
7. Testimonials
8. FAQ Preview
9. Call To Action
10. Footer

Hero section should contain premium animations.

Use GSAP and Three.js where appropriate.

---

## Products Page

Features:

* Product Grid
* Search
* Category Filter
* Sort Options
* Pagination
* Responsive Layout

---

## Product Details Page

Route:

/products/:slug

Features:

* Product Gallery
* Zoom Images
* Product Overview
* Product Benefits
* Product Specifications
* Materials
* Usage Instructions
* Maintenance Instructions
* Sustainability Impact
* FAQ Section
* Related Products
* Share Product
* Breadcrumbs
* QR Information

Design this page like a premium ecommerce product page.

---

## About Us Page

Sections:

* Brand Story
* Vision
* Mission
* Sustainability Goals
* Manufacturing Philosophy

---

## Sustainability Page

Explain:

* Eco-friendly materials
* Environmental impact
* Plastic reduction
* Sustainable sourcing

---

## Contact Page

Features:

* Contact Form
* Social Links
* Business Information
* FAQ

---

## Not Found Page

Custom branded 404 page.

---

# Navigation System

Implement:

* Sticky Navbar
* Mobile Navigation
* Responsive Menu
* Active Route Highlighting
* Breadcrumbs

Example:

Home > Products > Bamboo Toothbrush

---

# Theme Management System

Create a centralized theme system.

Themes must be switchable through configuration.

No hardcoded colors.

---

## Theme 1 - Premium Eco

Forest Green: #2E7D32
Bamboo Beige: #DCC9A3
Cream White: #F8F5EE
Dark Charcoal: #2D2D2D

Default Theme.

---

## Theme 2 - Modern Eco

Sage Green: #7A9E7E
Sand Beige: #D9C7A3
Off White: #FAF9F6
Dark Green: #355E3B

---

## Theme 3 - Bamboo Inspired

Bamboo Green: #4CAF50
Light Bamboo: #E8D8B5
White: #FFFFFF
Brown: #6D4C41

---

## Theme 4 - Luxury Eco

Deep Green: #1B4332
Gold Beige: #C9A66B
Ivory: #FFF8E7
Black: #1A1A1A

---

# Font Management

Create a global font configuration.

Supported Fonts:

* Poppins
* Inter
* Montserrat
* Lora
* Playfair Display
* Nunito

Changing font should affect the entire website.

---

# Animations

Use premium animations.

Implement:

* Page transitions
* Fade animations
* Scroll-triggered animations
* Product card animations
* Hero animations
* Section reveal animations
* Hover interactions
* Loading animations

Use GSAP primarily.

Use Framer Motion where it simplifies implementation.

---

# 3D Experience

Use Three.js selectively.

Potential uses:

* Floating bamboo elements
* Eco-themed hero scene
* Product showcase interaction
* Premium visual effects

Do not overuse 3D.

Prioritize performance.

---

# User Experience

Implement:

* Smooth scrolling
* Scroll progress indicator
* Back-to-top button
* Lazy loading
* Skeleton loaders
* Optimized image loading
* Responsive design

Target:

* Mobile First
* Tablet Friendly
* Desktop Optimized

---

# SEO

Every page should support:

* Dynamic title
* Meta description
* Open Graph tags
* Structured Data
* Canonical URLs

---

# Accessibility

Follow WCAG best practices.

Implement:

* Keyboard navigation
* Focus states
* Semantic HTML
* Proper ARIA labels
* Accessible forms

---

# Performance

Target:

* Lighthouse Score 90+
* Route-based code splitting
* Image optimization
* Tree shaking
* Lazy loaded pages

---

# Folder Structure

Design a clean scalable folder structure.

Suggested areas:

* components
* pages
* layouts
* features
* products
* themes
* hooks
* animations
* services
* store
* utils
* routes
* assets
* types

---

# Reusable Components

Create reusable components for:

* Buttons
* Cards
* Product Cards
* Product Gallery
* Hero Sections
* Feature Sections
* FAQ Accordion
* Testimonials
* Breadcrumbs
* Search Bar
* Filters
* Modals
* Tabs
* Carousels
* Badges
* Loaders

---

# QR Code System

Each product should support:

/products/bamboo-toothbrush
/products/neem-comb
/products/loofah
/products/bamboo-cotton-earbuds

Provide utility functions to generate QR code URLs.

The system should scale automatically for future products.

---

# Deliverables

1. Production-ready architecture.
2. Complete folder structure.
3. Reusable component library.
4. Theme management system.
5. Product configuration system.
6. QR-based product routing.
7. Responsive design.
8. Animation system.
9. SEO setup.
10. Clean, maintainable TypeScript code.

Act like a senior engineering team building a commercial product, not a demo application. Prioritize scalability, maintainability, performance, and code quality.
