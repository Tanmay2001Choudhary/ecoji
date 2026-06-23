import { SEO } from '@/components/SEO'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MapPin, MessageSquare, ArrowRight, Phone } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.3-.767.966-.94 1.164-.173.199-.347.223-.647.075-.3-.15-1.265-.466-2.406-1.488-.888-.795-1.488-1.778-1.661-2.076-.173-.3-.018-.461.13-.611.134-.133.3-.346.45-.52.149-.174.199-.3.298-.5.101-.2.05-.374-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.374-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.305 1.27.485 1.704.62.715.227 1.365.195 1.88.121.574-.082 1.767-.721 2.016-1.426.248-.705.248-1.305.173-1.425-.074-.12-.272-.195-.573-.345z"/>
    <path d="M20.52 3.449A11.892 11.892 0 0 0 12.017 0C5.437 0 .087 5.35.084 11.93c-.003 2.1.549 4.14 1.595 5.945L0 24l6.335-1.665a11.867 11.867 0 0 0 5.68 1.431h.005c6.58 0 11.93-5.35 11.933-11.93a11.882 11.882 0 0 0-3.433-8.387zM12.017 21.724c-1.773 0-3.51-.476-5.03-1.376l-.36-.214-3.74.98.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.16c.003-5.444 4.435-9.88 9.882-9.88 2.64 0 5.118 1.027 6.983 2.895 1.864 1.866 2.892 4.346 2.89 6.985-.003 5.447-4.437 9.88-9.884 9.88z"/>
  </svg>
)

const faqs = [
  { question: 'Do you ship internationally?', answer: 'Yes, we offer carbon-neutral international shipping to select countries.' },
  { question: 'What is your return policy?', answer: 'We accept returns within 30 days for unused products in their original plastic-free packaging.' },
  { question: 'Do you offer wholesale?', answer: 'Yes! Please contact us at wholesale@ecoji.com for bulk orders.' },
  { question: 'How do I track my order?', answer: 'Once your order ships, you will receive a tracking link via email.' }
]

export const ContactPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [contacts, setContacts] = useState<any[]>([])

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await api.contacts.list()
        setContacts(data)
      } catch (err) {
        console.error('Failed to load contacts', err)
      }
    }
    fetchContacts()
  }, [])

  // Organize contacts by type
  const emailContact = contacts.find(c => c.type === 'EMAIL') || { label: 'Email Us', value: 'ecoji.office@gmail.com', url: 'mailto:ecoji.office@gmail.com' }
  const phoneContact = contacts.find(c => c.type === 'PHONE') || { label: 'WhatsApp / Call', value: '+91 7976474123', url: 'https://wa.me/917976474123' }
  const addressContact = contacts.find(c => c.type === 'ADDRESS') || { label: 'Office', value: '271, Ward 29, Manikya Nagar\nBhilwara - 311001 (Rajasthan)\nIndia' }

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-header', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' })
      gsap.from('.contact-card', { x: -40, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' })
      gsap.from('.contact-form', { x: 40, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' })
      gsap.from('.faq-section', { y: 40, opacity: 0, duration: 1, delay: 0.4, ease: 'power3.out' })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="pb-32 relative">
      <SEO title="Contact Us | Ecoji" description="Get in touch with the Ecoji team for inquiries, support, or wholesale." />
      
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container max-w-7xl mx-auto pt-32">
        <div className="contact-header text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">Get In <span className="text-primary italic">Touch.</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Whether you have a question about our products, sustainability practices, or wholesale, our team is here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-24 items-start mb-32">
          {/* Contact Info Cards */}
          <div className="contact-card lg:col-span-2 flex flex-col gap-6">
            <a href={emailContact.url || `mailto:${emailContact.value}`} className="group p-8 rounded-[2rem] bg-secondary/20 hover:bg-secondary/40 border border-border/50 hover:border-primary/30 transition-all duration-300" data-cursor="interact">
              <Mail className="w-8 h-8 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-2">{emailContact.label}</h3>
              <p className="text-muted-foreground mb-6">For general inquiries and support.</p>
              <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                {emailContact.value} <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </a>

            <a href={phoneContact.url || `tel:${phoneContact.value.replace(/[^0-9+]/g, '')}`} target="_blank" rel="noopener noreferrer" className="group p-8 rounded-[2rem] bg-secondary/20 hover:bg-secondary/40 border border-border/50 hover:border-primary/30 transition-all duration-300" data-cursor="interact">
              <WhatsAppIcon className="w-8 h-8 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-2">{phoneContact.label}</h3>
              <p className="text-muted-foreground mb-6">Mon-Fri from 9am to 6pm IST.</p>
              <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                {phoneContact.value} <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </a>

            <div className="p-8 rounded-[2rem] bg-secondary/20 border border-border/50">
              <MapPin className="w-8 h-8 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-2">{addressContact.label}</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {addressContact.value}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form lg:col-span-3 bg-background rounded-[3rem] border shadow-2xl shadow-primary/5 p-10 md:p-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Send a message</h2>
            </div>
            
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-muted-foreground uppercase tracking-wider text-xs font-semibold">Name</Label>
                  <Input id="name" placeholder="John Doe" required className="h-14 rounded-xl bg-secondary/10 border-transparent focus:border-primary focus:bg-background transition-all" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-muted-foreground uppercase tracking-wider text-xs font-semibold">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required className="h-14 rounded-xl bg-secondary/10 border-transparent focus:border-primary focus:bg-background transition-all" />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="subject" className="text-muted-foreground uppercase tracking-wider text-xs font-semibold">Subject</Label>
                <Input id="subject" placeholder="How can we help?" required className="h-14 rounded-xl bg-secondary/10 border-transparent focus:border-primary focus:bg-background transition-all" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="message" className="text-muted-foreground uppercase tracking-wider text-xs font-semibold">Message</Label>
                <Textarea id="message" placeholder="Write your message here..." className="min-h-[200px] rounded-xl bg-secondary/10 border-transparent focus:border-primary focus:bg-background transition-all resize-none py-4" required />
              </div>
              <Button type="submit" size="lg" className="w-full h-14 rounded-xl text-lg font-medium hover:scale-[1.02] transition-transform">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* FAQs */}
        <div className="faq-section max-w-4xl mx-auto bg-secondary/10 rounded-[3rem] p-10 md:p-16 border border-border/50">
          <h2 className="text-4xl font-bold mb-10 text-center tracking-tight">Frequently Asked Questions</h2>
          <Accordion className="w-full space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`} className="border-none bg-background rounded-2xl px-6 shadow-sm">
                <AccordionTrigger className="text-left text-lg font-semibold py-6 hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}
