import { createClient } from '@supabase/supabase-js'

// ==========================================
// 🛠️ LOCAL DEVELOPMENT TOGGLE (`npm run dev`)
// ==========================================
// Set `USE_PROD_DB_IN_DEV = true`  -> Connects your local dev server to the Production Cloud Database.
// Set `USE_PROD_DB_IN_DEV = false` -> Connects your local dev server to the Local Docker Database.
export const USE_PROD_DB_IN_DEV = true

// ------------------------------------------
// 🔒 STRICT PRODUCTION SAFETY GUARANTEE
// ------------------------------------------
// When built and deployed (`import.meta.env.PROD === true`), this code strictly locks to the default VITE_SUPABASE_URL (which in Vercel is production).
const isProd = import.meta.env.PROD

const supabaseUrl = isProd
  ? import.meta.env.VITE_SUPABASE_URL
  : (USE_PROD_DB_IN_DEV ? import.meta.env.VITE_PROD_SUPABASE_URL : import.meta.env.VITE_SUPABASE_URL)

const supabaseAnonKey = isProd
  ? import.meta.env.VITE_SUPABASE_ANON_KEY
  : (USE_PROD_DB_IN_DEV ? import.meta.env.VITE_PROD_SUPABASE_ANON_KEY : import.meta.env.VITE_SUPABASE_ANON_KEY)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
