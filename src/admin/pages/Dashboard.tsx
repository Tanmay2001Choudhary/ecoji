import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { Package, Layers, Phone, Palette, Plus, ArrowRight, ExternalLink, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    contacts: 0,
    themes: 0
  })
  const [recentProducts, setRecentProducts] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const [prodList, catList, contactList, themeList] = await Promise.all([
          api.products.list().catch(() => []),
          api.categories.list().catch(() => []),
          api.contacts.list().catch(() => []),
          api.themes.list().catch(() => [])
        ])

        setStats({
          products: prodList.length || 0,
          categories: catList.length || 0,
          contacts: contactList.length || 0,
          themes: themeList.length || 0
        })

        setRecentProducts(prodList.slice(0, 5))
      } catch (err) {
        console.error("Failed to load dashboard statistics", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 p-8 md:p-12 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-emerald-100">
            <Sparkles className="w-3.5 h-3.5" /> Live CMS Overview
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Welcome to Ecoji Admin
          </h1>
          <p className="text-emerald-100 text-lg font-light leading-relaxed">
            Manage your sustainable product catalog, customize website styling, and keep customer contact channels up to date—all in real time.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-900 font-semibold text-sm hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </Link>
            <a
              href="https://ecoji.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-md transition-all border border-white/20"
            >
              View Live Site <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/products" className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> Active
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{loading ? '...' : stats.products}</div>
          <div className="text-sm font-medium text-gray-500">Total Products</div>
        </Link>

        <Link to="/admin/categories" className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
              Catalog
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{loading ? '...' : stats.categories}</div>
          <div className="text-sm font-medium text-gray-500">Categories</div>
        </Link>

        <Link to="/admin/contacts" className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Channels
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{loading ? '...' : stats.contacts}</div>
          <div className="text-sm font-medium text-gray-500">Contact Methods</div>
        </Link>

        <Link to="/admin/themes" className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
              <Palette className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
              Styling
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{loading ? '...' : stats.themes}</div>
          <div className="text-sm font-medium text-gray-500">Active Themes</div>
        </Link>
      </div>

      {/* Quick Links & Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Products Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recently Added Products</h2>
              <p className="text-sm text-gray-500">Latest eco-friendly items in your store</p>
            </div>
            <Link to="/admin/products" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400">Loading recent catalog...</div>
          ) : recentProducts.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed rounded-xl border-gray-100">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No products found yet</p>
              <Link to="/admin/products" className="mt-3 inline-block text-xs font-semibold text-emerald-600 hover:underline">Create your first product</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentProducts.map((prod) => (
                <div key={prod.id} className="py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 border overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {prod.images && prod.images[0] ? (
                        <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">{prod.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{prod.category?.name || 'General Eco'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                    <Link to={`/admin/products/${prod.id}`} className="text-xs font-semibold text-gray-600 hover:text-emerald-600 px-3 py-1.5 rounded-lg border hover:border-emerald-200 transition-colors">
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">CMS Shortcuts</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Quickly jump to key sections to manage your brand aesthetics and site content.
            </p>

            <div className="space-y-3 pt-2">
              <Link to="/admin/products" className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group">
                <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700 flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-emerald-600" /> Catalog Inventory
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link to="/admin/themes" className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group">
                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 flex items-center gap-2.5">
                  <Palette className="w-4 h-4 text-purple-600" /> Color Themes & Fonts
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link to="/admin/contacts" className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-blue-600" /> Contact Channels
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-xs text-gray-500 mb-2">Need help configuring live previews?</p>
            <span className="text-xs font-semibold text-gray-700">Ecoji v2.0 - Active & Synced</span>
          </div>
        </div>
      </div>
    </div>
  )
}
