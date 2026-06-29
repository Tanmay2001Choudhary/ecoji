import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Settings, 
  LogOut, 
  Palette,
  Type,
  Link as LinkIcon,
  MessageSquare
} from 'lucide-react'

export const AdminLayout: React.FC = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Themes', href: '/admin/themes', icon: Palette },
    { name: 'Fonts', href: '/admin/fonts', icon: Type },
    { name: 'Affiliates', href: '/admin/affiliates', icon: LinkIcon },
    { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col hidden md:flex flex-shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-gray-200">
          <Link to="/admin/dashboard" className="flex flex-col items-center">
            <img src="/logo.png" alt="Ecoji Admin Logo" className="h-24 md:h-28 w-auto object-contain" />
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <button 
              onClick={signOut}
              className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <img src="/logo.png" alt="Ecoji Admin Logo" className="h-10 w-auto object-contain" />
            <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-wider">Admin</span>
          </Link>
          <button onClick={signOut} className="text-gray-500 hover:text-gray-700">
            <LogOut className="h-6 w-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
