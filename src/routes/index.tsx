import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { MainLayout } from '@/layouts/MainLayout'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/Home').then(m => ({ default: m.HomePage })))
const ProductsPage = lazy(() => import('@/pages/Products').then(m => ({ default: m.ProductsPage })))
const ProductDetailsPage = lazy(() => import('@/pages/ProductDetails').then(m => ({ default: m.ProductDetailsPage })))
const AboutPage = lazy(() => import('@/pages/About').then(m => ({ default: m.AboutPage })))
const SustainabilityPage = lazy(() => import('@/pages/Sustainability').then(m => ({ default: m.SustainabilityPage })))
const ContactPage = lazy(() => import('@/pages/Contact').then(m => ({ default: m.ContactPage })))

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
      {
        index: true,
        element: withSuspense(HomePage),
      },
      {
        path: "products",
        element: withSuspense(ProductsPage),
      },
      {
        path: "products/:slug",
        element: withSuspense(ProductDetailsPage),
      },
      {
        path: "about",
        element: withSuspense(AboutPage),
      },
      {
        path: "sustainability",
        element: withSuspense(SustainabilityPage),
      },
      {
        path: "contact",
        element: withSuspense(ContactPage),
      },
      {
        path: "*",
        element: <NotFound />,
      }
    ]
  }
])

export const AppRouter = () => {
  return <RouterProvider router={router} />
}
