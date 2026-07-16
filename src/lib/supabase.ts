import { createClient } from '@supabase/supabase-js'

// ==========================================
// 🚀 SUPABASE DATABASE CONFIGURATION & TOGGLE
// ==========================================

// 1. Production Cloud Supabase credentials (always used in Production builds on Vercel)
const PROD_SUPABASE_URL = 'https://lzaxelofbcsivbssrffc.supabase.co'
const PROD_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6YXhlbG9mYmNzaXZic3NyZmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMTE1MjQsImV4cCI6MjA5Nzc4NzUyNH0.CEAy85Hhw2CWXfLHKwaNpdTSl4XgianUPHBibNjkonM'

// 2. Local Supabase credentials (for testing against local Docker Supabase)
const LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321'
const LOCAL_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

// ------------------------------------------
// 🛠️ LOCAL DEVELOPMENT TOGGLE (`npm run dev`)
// ------------------------------------------
// Set `USE_PROD_DB_IN_DEV = true`  -> Connects your local dev server (`localhost:5180`) to the Production Cloud Database.
// Set `USE_PROD_DB_IN_DEV = false` -> Connects your local dev server (`localhost:5180`) to the Local Docker Database (`127.0.0.1:54321`).
export const USE_PROD_DB_IN_DEV = false

// ------------------------------------------
// 🔒 STRICT PRODUCTION SAFETY GUARANTEE
// ------------------------------------------
// When built and deployed to Vercel (`import.meta.env.PROD === true`), this code strictly locks to the Production Cloud Database,
// ignoring `USE_PROD_DB_IN_DEV = false` or any missing/override local environment variables!
const isProd = import.meta.env.PROD

const supabaseUrl = isProd
  ? PROD_SUPABASE_URL
  : (USE_PROD_DB_IN_DEV ? PROD_SUPABASE_URL : (import.meta.env.VITE_SUPABASE_URL || LOCAL_SUPABASE_URL))

const supabaseAnonKey = isProd
  ? PROD_SUPABASE_ANON_KEY
  : (USE_PROD_DB_IN_DEV ? PROD_SUPABASE_ANON_KEY : (import.meta.env.VITE_SUPABASE_ANON_KEY || LOCAL_SUPABASE_ANON_KEY))

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
