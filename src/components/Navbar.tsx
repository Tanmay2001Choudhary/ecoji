
import { usePageSection } from '@/hooks/usePageSection'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SearchBar } from './SearchBar'
const links = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'About Us', path: '/about' },
  { name: 'Sustainability', path: '/sustainability' },
  { name: 'Contact', path: '/contact' },
]

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const { data: navbarData } = usePageSection('global', 'navbar', {
    links: [
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
      { name: 'About Us', path: '/about' },
      { name: 'Sustainability', path: '/sustainability' },
      { name: 'Contact', path: '/contact' },
    ]
  })

  const activeLinks = (navbarData?.links && navbarData.links.length > 0) ? navbarData.links : links

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Ecoji Logo" className="h-24 md:h-28 w-auto object-contain transition-transform hover:scale-105" />
          </Link>
        </div>

        {/* Desktop Nav - Character by Character Left-to-Right Wave & Left-to-Right Bottom Line */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-4">
          {activeLinks.map((link: any) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className="group/link relative py-2 px-3 rounded-md text-sm font-medium transition-all select-none flex items-center justify-center active:scale-95"
              >
                <div className="relative z-10 flex items-center">
                  {link.name.split('').map((char: string, index: number) => (
                    <span
                      key={index}
                      style={{ transitionDelay: `${index * 30}ms` }}
                      className={cn(
                        "inline-block transition-all duration-300 ease-out",
                        char === ' ' ? "w-1" : "",
                        isActive
                          ? "text-primary font-semibold"
                          : "text-muted-foreground group-hover/link:text-primary group-hover/link:-translate-y-0.5 group-hover/link:font-semibold"
                      )}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </div>

                {/* Bottom Line appearing from left to right on hover */}
                <span className={cn(
                  "absolute bottom-0.5 left-2 right-2 h-[2px] rounded-full bg-primary transition-transform duration-300 ease-out origin-left",
                  isActive
                    ? "scale-x-100 shadow-[0_0_8px_rgba(34,197,94,0.7)]"
                    : "scale-x-0 group-hover/link:scale-x-100 shadow-[0_0_6px_rgba(34,197,94,0.5)]"
                )} />
              </Link>
            )
          })}
        </nav>

        {/* Search and Mobile Toggle */}
        <div className="flex items-center gap-2">
          <SearchBar />

          <button
            className="md:hidden p-2 text-foreground transition-all duration-200 hover:scale-110 active:scale-90 rounded-full hover:bg-secondary/40 hover:border hover:border-primary/20"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-b bg-background/95 backdrop-blur-xl px-4 py-5 space-y-2 animate-in slide-in-from-top-3 duration-200">
          {activeLinks.map((link: any) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="group/mob relative flex items-center justify-between py-3 px-4 rounded-xl text-base font-medium transition-all select-none overflow-hidden hover:bg-secondary/30 active:scale-98"
              >
                <div className="relative z-10 flex items-center">
                  {link.name.split('').map((char: string, index: number) => (
                    <span
                      key={index}
                      style={{ transitionDelay: `${index * 25}ms` }}
                      className={cn(
                        "inline-block transition-all duration-300 ease-out",
                        char === ' ' ? "w-1.5" : "",
                        isActive
                          ? "text-primary font-semibold"
                          : "text-foreground/80 group-hover/mob:text-primary group-hover/mob:translate-x-0.5 group-hover/mob:font-semibold"
                      )}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </div>

                {/* Bottom Line appearing from left to right on mobile */}
                <span className={cn(
                  "absolute bottom-1 left-4 right-4 h-[2px] rounded-full bg-primary transition-transform duration-300 ease-out origin-left",
                  isActive
                    ? "scale-x-100 shadow-[0_0_8px_rgba(34,197,94,0.7)]"
                    : "scale-x-0 group-hover/mob:scale-x-100 shadow-[0_0_6px_rgba(34,197,94,0.5)]"
                )} />
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
