import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { MainLayout } from '@/layouts/MainLayout'

// Admin Layouts & Guards
import { AdminLayout } from '@/admin/layouts/AdminLayout'
import { ProtectedRoute } from '@/admin/components/ProtectedRoute'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/Home').then(m => ({ default: m.HomePage })))
const ProductsPage = lazy(() => import('@/pages/Products').then(m => ({ default: m.ProductsPage })))
const ProductDetailsPage = lazy(() => import('@/pages/ProductDetails').then(m => ({ default: m.ProductDetailsPage })))
const AboutPage = lazy(() => import('@/pages/About').then(m => ({ default: m.AboutPage })))
const SustainabilityPage = lazy(() => import('@/pages/Sustainability').then(m => ({ default: m.SustainabilityPage })))
const ContactPage = lazy(() => import('@/pages/Contact').then(m => ({ default: m.ContactPage })))

// Lazy load Admin pages
const AdminLogin = lazy(() => import('@/admin/pages/Login').then(m => ({ default: m.Login })))
const AdminDashboard = lazy(() => import('@/admin/pages/Dashboard').then(m => ({ default: m.Dashboard })))
const AdminProducts = lazy(() => import('@/admin/pages/Products').then(m => ({ default: m.ProductsList })))
const AdminProductEditor = lazy(() => import('@/admin/pages/Products/ProductEditor').then(m => ({ default: m.ProductEditor })))
const AdminCategories = lazy(() => import('@/admin/pages/Categories').then(m => ({ default: m.CategoriesList })))
const AdminSettings = lazy(() => import('@/admin/pages/Settings').then(m => ({ default: m.Settings })))
const AdminContacts = lazy(() => import('@/admin/pages/Contacts').then(m => ({ default: m.ContactsList })))
const AdminThemes = lazy(() => import('@/admin/pages/Themes').then(m => ({ default: m.ThemesList })))
const AdminFonts = lazy(() => import('@/admin/pages/Fonts').then(m => ({ default: m.FontsList })))
const AdminAffiliates = lazy(() => import('@/admin/pages/Affiliates').then(m => ({ default: m.AffiliatesList })))

const LoadingScreen = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
)

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-10">
    <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
    <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
    <p className="text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
  </div>
)

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: "products", element: withSuspense(ProductsPage) },
      { path: "products/:slug", element: withSuspense(ProductDetailsPage) },
      { path: "about", element: withSuspense(AboutPage) },
      { path: "sustainability", element: withSuspense(SustainabilityPage) },
      { path: "contact", element: withSuspense(ContactPage) },
    ]
  },
  {
    path: "/admin",
    children: [
      {
        path: "login",
        element: withSuspense(AdminLogin)
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: "dashboard", element: withSuspense(AdminDashboard) },
              { path: "products", element: withSuspense(AdminProducts) },
              { path: "products/:id", element: withSuspense(AdminProductEditor) },
              { path: "categories", element: withSuspense(AdminCategories) },
              { path: "settings", element: withSuspense(AdminSettings) },
              { path: "contacts", element: withSuspense(AdminContacts) },
              { path: "themes", element: withSuspense(AdminThemes) },
              { path: "fonts", element: withSuspense(AdminFonts) },
              { path: "affiliates", element: withSuspense(AdminAffiliates) },
            ]
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
])

export const AppRouter = () => {
  return <RouterProvider router={router} />
}
