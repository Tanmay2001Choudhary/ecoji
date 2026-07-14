import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SmoothScroll } from '@/components/SmoothScroll'
import { ThemeSettings } from '@/components/ThemeSettings'
import { BackToTop } from '@/components/BackToTop'

export const MainLayout = () => {
  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col font-sans relative">
        <Navbar />
        <main className="flex-1 relative z-10">
          <Outlet />
        </main>
        <Footer />
        <ThemeSettings />
        <BackToTop />
        <ScrollRestoration />
      </div>
    </SmoothScroll>
  )
}
