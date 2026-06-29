# Ecoji Admin CMS & Backend Architecture Plan (Final Hardened Version)

> [!NOTE]
> This is a comprehensive discovery, planning, and design document for integrating Supabase into the Ecoji project to drive a fully dynamic Admin CMS. No code has been implemented yet. Please review and approve before we proceed with implementation.

---

## 1. Current Project Analysis

**Detected Technologies:**
- React 19 (Vite)
- TypeScript
- Tailwind CSS
- GSAP & Framer Motion (Animations)
- React Three Fiber / Drei (3D Rendering)
- Zustand (State management)
- React Router DOM v7 (Routing)
- Lucide React (Icons)
- React Helmet Async (SEO)

**Folder Structure:**
- `/src/components`: UI components, 3D modular chunks, layouts.
- `/src/config`: Hardcoded data (e.g., `products.ts`).
- `/src/pages`: Lazy-loaded routes.
- `/src/routes`: React Router configuration.
- `/src/store`: Zustand stores (`useAppStore`, `use3DStore`).
- `/src/types`: TypeScript interfaces.

**Existing Architecture & Data Flow:**
The app currently relies entirely on static mock data exported from `src/config/products.ts`. This data flows into `Zustand` and directly into pages like `Products.tsx`, `ProductDetails.tsx`, and `SearchBar.tsx`.

**Existing Components & Extension Points:**
- `SearchBar.tsx`: Filters local array. Will need to point to Supabase Edge Functions or dynamic client queries.
- `ThemeProvider.tsx` / `ThemeSettings.tsx`: Reads from Zustand. Can be extended to fetch dynamic themes from Supabase on init.
- `CustomCursor.tsx` / `GlobalLoader.tsx`: Highly interactive global overlays.
- `Footer.tsx`: Handles dynamic QR generation via `react-qr-code` and Canvas APIs.

**Existing Technical Debt:**
- Products are hardcoded.
- Categories are derived statically from the hardcoded products array.
- Search filters are client-side only, which does not scale if product count grows.
- Footer social links are hardcoded.

---

## 2. Architecture Review

The target architecture will remain a Single Page Application (SPA) driven by React, but we will shift the data source from `config/products.ts` to a live Supabase backend.

- **Frontend CMS:** A protected route tree (`/admin/*`) inside the React app.
- **Backend as a Service (BaaS):** Supabase (PostgreSQL, Auth, Storage).
- **Data Fetching:** `@supabase/supabase-js` client utilizing React context/hooks.

This allows us to leverage existing state management (Zustand) by simply hydrating the store from Supabase on app load, preventing an architectural rewrite of the front-facing website.

---

## 3. Database Design (PostgreSQL Schema)

> [!TIP]
> The database is designed fully normalized. All mutable tables include both `created_at` and `updated_at` columns. These timestamps are essential for auditing (tracking *when* things changed), cache invalidation (ETags / Last-Modified caching), API sorting (`order_by=updated_at.desc`), and providing admin visibility into stale vs active data.

**`users`** (Managed by Supabase Auth)
- `id` (UUID, PK)
- `role` (Enum: ADMIN, EDITOR)
- `email`

**`products`**
- `id` (UUID, PK)
- `slug` (String, Unique)
- `sku` (String, Unique)
- `name` (String)
- `category_id` (UUID, FK)
- `short_description` (Text)
- `full_description` (Text)
- `benefits` (String[])
- `specifications` (JSONB)
- `ingredients_materials` (String[])
- `usage_instructions` (String[])
- `maintenance_instructions` (String[])
- `sustainability_impact` (Text)
- `seo_title` (String)
- `seo_description` (Text)
- `seo_keywords` (String[])
- `status` (Enum: DRAFT, PUBLISHED, ARCHIVED)
- `display_order` (Integer)
- `deleted_at` (Timestamp, Nullable) - Soft Delete
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**`product_faqs`**
- `id` (UUID, PK)
- `product_id` (UUID, FK)
- `question` (Text)
- `answer` (Text)
- `display_order` (Integer)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**`product_related`**
- `id` (UUID, PK)
- `product_id` (UUID, FK)
- `related_product_id` (UUID, FK)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**`product_placements`**
- `id` (UUID, PK)
- `product_id` (UUID, FK)
- `placement_type` (Enum: HOMEPAGE_FEATURED, HERO_SECTION, NEW_ARRIVALS, BEST_SELLERS)
- `display_order` (Integer)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**`product_images`**
- `id` (UUID, PK)
- `product_id` (UUID, FK)
- `url` (String)
- `alt_text` (String) - Critical for SEO & Accessibility.
- `image_type` (String, Nullable) - e.g., 'primary', 'gallery', 'packaging'.
- `is_primary` (Boolean)
- `display_order` (Integer)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
> *Future fields:* `width`, `height` (can be dynamically updated later via edge functions or client-side reading).

**`categories`**
- `id` (UUID, PK)
- `name` (String)
- `slug` (String, Unique)
- `description` (Text)
- `icon` (String)
- `display_order` (Integer)
- `is_active` (Boolean) - Soft Delete alternative.
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**`affiliate_links`**
- `id` (UUID, PK)
- `product_id` (UUID, FK)
- `platform` (String - e.g., Amazon, Flipkart)
- `url` (String)
- `is_active` (Boolean) - Soft Delete alternative.
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**`themes`**
- `id` (UUID, PK)
- `name` (String)
- `slug` (String, Unique)
- `colors` (JSONB)
- `is_active` (Boolean) - Soft Delete alternative.
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**`fonts`**
- `id` (UUID, PK)
- `provider` (Enum: GOOGLE_FONTS, CUSTOM)
- `font_family` (String)
- `available_weights` (String[]) - e.g., ['300', '400', '600', '700']
- `is_active` (Boolean) - Soft Delete alternative.
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**`contacts`**
- `id` (UUID, PK)
- `type` (String)
- `label` (String)
- `icon` (String)
- `value` (String)
- `url` (String)
- `display_order` (Integer)
- `is_active` (Boolean) - Soft Delete alternative.
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**`site_settings`** (Single row, enforces ID = 1)
- `id` (Integer, PK)
- `site_name` (String)
- `meta_title` (String)
- `meta_description` (Text)
- `site_logo_url` (String)
- `favicon_url` (String)
- `default_theme_id` (UUID, FK)
- `default_font_id` (UUID, FK)
- `products_per_page_default` (Integer)
- `contact_email` (String)
- `contact_phone` (String)
- `maintenance_mode` (Boolean)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

---

## 4. Audit Logging Strategy

> [!TIP]
> Audit logs provide accountability for all admin actions, essential as the team scales (e.g., Editor vs Admin roles).

**`audit_logs`**
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `action` (String - e.g., 'UPDATE_PRODUCT')
- `entity_type` (String - e.g., 'product')
- `entity_id` (UUID)
- `before_data` (JSONB)
- `after_data` (JSONB)
- `created_at` (Timestamp)

**Implementation Details:**
- **Triggered By:** PostgreSQL Triggers (or Supabase Edge Functions) listening for `INSERT`, `UPDATE`, `DELETE` on monitored tables.
- **Retention:** Supabase DB size must be monitored. A background cron job should prune or cold-store logs older than 90 days.

---

## 5. Soft Delete Strategy

To prevent accidental data loss, permanent `DELETE` commands are avoided in favor of logical hiding.

- **`products`**: Utilizes a `deleted_at` timestamp. If `deleted_at IS NOT NULL`, the product is omitted from frontend queries and hidden in the Admin UI (unless viewing the "Trash" filter).
- **`categories`, `themes`, `fonts`, `contacts`, `affiliate_links`**: Utilize an `is_active` boolean. Deactivating these is safer and conceptually cleaner than a "trash" state, as they are utility configurations.

---

## 6. Improved Font Architecture

Relying on arbitrary URLs is a security and stability risk.

**Strategy:**
- We limit fonts strictly to a `provider` enum (`GOOGLE_FONTS`).
- The frontend dynamically constructs the safe `<link>` tag based on `font_family` and `available_weights`.
- e.g. `https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap`
- **Validation:** The Admin UI ensures the family string contains only alphanumeric characters and spaces.

---

## 7. Expanded Analytics Planning (Future-Proofing)

When the time comes to track engagement:

**`product_views` / `qr_scans` / `affiliate_clicks`**
- `id` (UUID)
- `product_id` (UUID)
- `platform` (String, optional)
- `device_type` (String - mobile, tablet, desktop)
- `browser` (String)
- `operating_system` (String)
- `referrer` (String)
- `country` (String)
- `created_at` (Timestamp)

*Note: Capturing device metadata adds immense value to understanding where the audience is arriving from (especially for physical QR scans).*

---

## 8. Theme & Font Precedence Rules

The system handles both CMS-driven global defaults and local user preferences.

**Precedence Rule:** Admin Sets Default -> User Overrides Locally.
1. `site_settings` dictates `default_theme_id` and `default_font_id`.
2. On initial page load, if `localStorage` (via Zustand) contains NO user preference, the app fetches the CMS default and applies it globally.
3. If the user interacts with the frontend `ThemeSettings` widget, their choice overrides the global CMS default and is saved to their `localStorage`.

---

## 9. Slug Strategy Review

Slugs provide readable, SEO-friendly URLs. Where do they matter?
- **`products`:** YES. `/products/bamboo-toothbrush`.
- **`categories`:** YES. `/products?category=dental-care`.
- **`themes`:** YES. `theme="premium-eco"` is cleaner in class bindings than UUIDs.
- **`fonts`:** NO. Fonts are referenced via `font_family` name natively in CSS. Slugs are unnecessary.

---

## 10. Existing Product Interface Mapping

| Frontend Field (`Product`) | Database Destination | PostgreSQL Type | Notes |
|----------------------------|----------------------|-----------------|-------|
| `id` | `products.id` | UUID | Replaces hardcoded string |
| `slug` | `products.slug` | String | Unique constraint |
| `sku` | `products.sku` | String | Unique constraint |
| `name` | `products.name` | String | |
| `category` | `products.category_id` | UUID (FK) | Maps to `categories.id` via relationship. Prevents string duplication. |
| `shortDescription` | `products.short_description` | Text | |
| `fullDescription` | `products.full_description` | Text | |
| `images` | `product_images.url` | Relational | Filtered by `is_primary = true` |
| `gallery` | `product_images.url` | Relational | Filtered by `is_primary = false`, ordered by `display_order` |
| `benefits` | `products.benefits` | String[] | Native Postgres Array |
| `specifications` | `products.specifications` | JSONB | Dynamic key-value pairs |
| `ingredientsOrMaterials` | `products.ingredients_materials`| String[] | Native Postgres Array |
| `usageInstructions` | `products.usage_instructions` | String[] | Native Postgres Array |
| `maintenanceInstructions`| `products.maintenance_instructions`| String[] | Native Postgres Array |
| `sustainabilityImpact` | `products.sustainability_impact` | Text | |
| `faqs` | `product_faqs` | Relational Table| 1:N Relationship |
| `tags` | `products.seo_keywords` | String[] | Mapped to SEO |
| `relatedProducts` | `product_related` | Relational Table| M-to-M relationship via product slugs/IDs |
| `seoMetadata` | `products.seo_*` | Strings/Text | Flattened into `seo_title`, `seo_description` |
| `qrCodeLink` | N/A | Dynamic String | Derived dynamically on frontend as `/products/${slug}` |

---

## 11. Search Architecture Review

**Recommendation:** For Ecoji's e-commerce scale, **PostgreSQL Full Text Search** is highly recommended over simple `ILIKE`. It provides a much better user experience with typo-tolerance, stemming, and high-performance querying across `name`, `description`, and `benefits`.

---

## 12. Data Migration Strategy

1. **Category Migration:** Extract all unique categories from `products.ts`. Seed them into the `categories` table.
2. **Product Migration:** Run a one-time script to map `products.ts` items to `products`, matching categories by name to acquire the `category_id`.
3. **Image Migration:** Upload images listed in `products.ts` to Supabase Storage, and map the URLs to the `product_images` table along with generated `alt_text`.
4. **FAQ Migration:** Bulk insert into `product_faqs` with the newly generated `product_id`.
5. **Related Product Migration:** Resolve `relatedProducts` slug arrays into `product_related` UUID relationships.
6. **QR URL Migration:** Hardcoded URLs will be deprecated in favor of dynamic derivation.

---

## 13. Risks & Tradeoffs

> [!WARNING]
> Please review these architectural risks carefully before starting implementation.

- **Supabase FTS Limitation:** While PostgreSQL FTS is powerful, it does not support advanced misspellings as gracefully as dedicated search engines like Algolia or Typesense without extensive custom dictionary configurations.
- **Storage Bandwidth Cost:** Storing images in Supabase requires diligent bandwidth management. We must ensure images are aggressively compressed (WebP) client-side before upload to prevent spiking egress costs.
- **Theme Precedence Complexity:** Since we are combining CMS defaults with localStorage user overrides, UI hydration bugs ("FOUC") can occur. We must carefully synchronize Zustand hydration with the Supabase fetch in the `GlobalLoader`.
- **Analytics DB Growth:** Tracking `product_views` and `qr_scans` directly inside the transactional Postgres DB can cause table bloat quickly. We should ensure these tables are partitioned if traffic spikes, or consider moving them to a time-series DB (like ClickHouse) in the long term.
- **Font Loading Risks:** Dynamically generating Google Font `<link>` tags based on CMS data might cause layout shifts. `display=swap` must be strictly enforced on the generated URLs.

---

## 14. Phased Implementation Plan

1. **Phase 2: Database Setup & Supabase Auth**
   - Create Supabase project, setup schemas, soft-deletes, `audit_logs` triggers, RLS, and Storage buckets.
2. **Phase 3: Data Migration Scripting**
   - Execute migration strategy to seed Supabase with `config/products.ts` data.
3. **Phase 4: Admin UI Foundation & Read/Write API**
   - Build `AdminLayout`, Sidebar, and connect base CRUD services.
4. **Phase 5: Product, FAQ, & Category Management**
   - Build CMS forms, Image uploader, Related Products selector, and Placements UI.
5. **Phase 6: Global Systems Management**
   - Build Theme, Font, and Site Settings CMS.
6. **Phase 7: Frontend Integration**
   - Migrate `Home`, `Products`, `Footer`, and `SearchBar` away from local mocks to Supabase fetches utilizing PostgreSQL FTS.

---

Please review this final hardened plan. If approved, we will lock the architecture and begin **Phase 2** (Database Setup & Supabase Auth).
