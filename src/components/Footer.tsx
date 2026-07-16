import { Share2, QrCode, Mail, Download, Link as LinkIcon, MapPin } from 'lucide-react'
import QRCode from 'react-qr-code'
import { buildUrl } from '@/lib/url'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { shareQRCode } from '@/lib/share'
import { usePageSection } from '@/hooks/usePageSection'
import { SafeHtmlRenderer } from '@/components/SafeHtmlRenderer'

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.3-.767.966-.94 1.164-.173.199-.347.223-.647.075-.3-.15-1.265-.466-2.406-1.488-.888-.795-1.488-1.778-1.661-2.076-.173-.3-.018-.461.13-.611.134-.133.3-.346.45-.52.149-.174.199-.3.298-.5.101-.2.05-.374-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.374-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.305 1.27.485 1.704.62.715.227 1.365.195 1.88.121.574-.082 1.767-.721 2.016-1.426.248-.705.248-1.305.173-1.425-.074-.12-.272-.195-.573-.345z"/>
    <path d="M20.52 3.449A11.892 11.892 0 0 0 12.017 0C5.437 0 .087 5.35.084 11.93c-.003 2.1.549 4.14 1.595 5.945L0 24l6.335-1.665a11.867 11.867 0 0 0 5.68 1.431h.005c6.58 0 11.93-5.35 11.933-11.93a11.882 11.882 0 0 0-3.433-8.387zM12.017 21.724c-1.773 0-3.51-.476-5.03-1.376l-.36-.214-3.74.98.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.16c.003-5.444 4.435-9.88 9.882-9.88 2.64 0 5.118 1.027 6.983 2.895 1.864 1.866 2.892 4.346 2.89 6.985-.003 5.447-4.437 9.88-9.884 9.88z"/>
  </svg>
)

export const Footer = () => {
  const siteUrl = buildUrl('/')
  const [products, setProducts] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])

  const { data: footerData } = usePageSection('global', 'footer', {
    description: 'Premium, sustainable, and export-quality eco-friendly products for a greener tomorrow.',
    copyright: '© 2026 Ecoji. All rights reserved.'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodData = await api.public.getProducts()
        setProducts(prodData.slice(0, 4))
      } catch (err) {
        console.error('Failed to load products for footer', err)
      }
      try {
        const contactData = await api.contacts.list()
        if (contactData && contactData.length > 0) {
          setContacts(contactData.filter((c: any) => c.is_active !== false))
        }
      } catch (err) {
        console.error('Failed to load contacts for footer', err)
      }
    }
    fetchData()
  }, [])

  return (
    <footer className="bg-secondary text-secondary-foreground py-12 border-t">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-2">
          <Link to="/" className="inline-block">
            <img src="/logo.png" alt="Ecoji Logo" className="h-24 md:h-28 w-auto object-contain -ml-7" />
          </Link>
          <SafeHtmlRenderer html={footerData?.description || 'Premium, sustainable, and export-quality eco-friendly products for a greener tomorrow.'} className="text-sm text-secondary-foreground/80 [&_p]:m-0" />
        </div>
        <div>
          <h3 className="font-semibold mb-4">Products</h3>
          <ul className="space-y-2 text-sm">
            {products.map(product => (
              <li key={product.id}>
                <Link to={`/products/${product.slug}`} className="hover:text-primary transition-colors">
                  {product.name}
                </Link>
              </li>
            ))}
            {products.length === 0 && (
              <li className="text-muted-foreground italic">Loading...</li>
            )}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/sustainability" className="hover:text-primary transition-colors">Sustainability</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Connect</h3>
          <div className="flex flex-wrap gap-4 mb-8">
            {contacts.length > 0 ? contacts.map(c => {
              const isEmail = c.type === 'EMAIL' || c.icon === 'Mail'
              const isPhone = c.type === 'PHONE' || c.icon === 'Phone'
              const href = c.url || (isEmail ? `mailto:${c.value}` : isPhone ? `tel:${c.value.replace(/[^0-9+]/g, '')}` : '/contact')
              return (
                <a key={c.id} href={href} target={isPhone ? '_blank' : undefined} rel={isPhone ? 'noopener noreferrer' : undefined} className="hover:text-primary transition-colors flex items-center gap-1.5" title={c.label}>
                  {isEmail ? <Mail className="h-5 w-5" /> : isPhone ? <WhatsAppIcon className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                </a>
              )
            }) : (
              <>
                <a href="https://wa.me/917976474123" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" title="WhatsApp"><WhatsAppIcon className="h-5 w-5" /></a>
                <a href="mailto:ecoji.office@gmail.com" className="hover:text-primary transition-colors" title="Email"><Mail className="h-5 w-5" /></a>
              </>
            )}
          </div>
          
          <div className="bg-background p-6 rounded-2xl shadow-sm border border-border inline-block group" data-cursor="scan">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Share Ecoji</span>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-xl transition-transform duration-500 group-hover:scale-105 shadow-sm border border-border/50 mx-auto flex justify-center w-fit">
              <QRCode id="ecoji-qr" value={siteUrl} size={100} level="H" />
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-6">
              <button 
                onClick={() => {
                  const svg = document.getElementById('ecoji-qr') as unknown as SVGSVGElement;
                  if (!svg) return;
                  const svgData = new XMLSerializer().serializeToString(svg);
                  const canvas = document.createElement("canvas");
                  const ctx = canvas.getContext("2d");
                  const img = new Image();
                  img.onload = () => {
                    // Add quiet zone padding
                    const padding = 20;
                    canvas.width = img.width + padding * 2;
                    canvas.height = img.height + padding * 2;
                    
                    if (ctx) {
                      // Fill with white background
                      ctx.fillStyle = "white";
                      ctx.fillRect(0, 0, canvas.width, canvas.height);
                      // Draw image in center
                      ctx.drawImage(img, padding, padding);
                    }
                    
                    const pngFile = canvas.toDataURL("image/png");
                    const downloadLink = document.createElement("a");
                    downloadLink.download = "ecoji-qr.png";
                    downloadLink.href = `${pngFile}`;
                    downloadLink.click();
                  };
                  img.src = "data:image/svg+xml;base64," + btoa(svgData);
                }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-muted transition-colors group/btn text-muted-foreground hover:text-foreground"
                title="Download QR"
              >
                <Download className="h-4 w-4" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Save</span>
              </button>
              
              <button 
                onClick={() => {
                  shareQRCode({
                    elementId: 'ecoji-qr',
                    filename: 'ecoji-qr.png',
                    title: 'Ecoji',
                    text: 'Premium, sustainable, and export-quality eco-friendly products.',
                    url: siteUrl
                  })
                }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-muted transition-colors group/btn text-muted-foreground hover:text-foreground"
                title="Share Link & QR"
              >
                <Share2 className="h-4 w-4" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Share</span>
              </button>
              
              <button 
                onClick={() => navigator.clipboard.writeText(siteUrl)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-muted transition-colors group/btn text-muted-foreground hover:text-foreground"
                title="Copy Link"
              >
                <LinkIcon className="h-4 w-4" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-12 pt-8 border-t border-border/50 text-sm text-secondary-foreground/60">
        <SafeHtmlRenderer html={footerData?.copyright || '© 2026 Ecoji. All rights reserved.'} className="[&_p]:m-0 [&_p]:inline" />
      </div>
    </footer>
  )
}
