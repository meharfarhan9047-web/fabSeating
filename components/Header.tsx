'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from './Container'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/#solutions', label: 'Solutions' },
  { href: '/projects', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

export function Header({ logoUrl }: { logoUrl?: string | null }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(true)
  const pathname = usePathname()
  const announcement = {
    message: 'Serving residential & commercial spaces across Chennai & Pan India since 2001.',
    ctaLabel: '',
    ctaHref: '',
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsMobileMenuOpen(false) }, [pathname])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false)
    }
    const desktop = window.matchMedia('(min-width: 768px)')
    const closeOnDesktop = () => { if (desktop.matches) setIsMobileMenuOpen(false) }
    closeOnDesktop()
    desktop.addEventListener('change', closeOnDesktop)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      desktop.removeEventListener('change', closeOnDesktop)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isMobileMenuOpen])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        'bg-transparent'
      )}
    >
      {showAnnouncement && (
        <div className="relative h-7 overflow-hidden bg-black text-white">
          <div className="absolute inset-0 bg-black/80" />
          <button
            aria-label="Close announcement"
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            ×
          </button>
          <div className="absolute inset-0 flex items-center">
            <motion.div
              className="flex items-center gap-12 whitespace-nowrap px-6"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 12, ease: 'linear', repeat: Infinity }}
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/90">
                {announcement.message}
              </span>
              {announcement.ctaLabel && (
                <Link
                  href={announcement.ctaHref}
                  className="text-[10px] font-medium underline underline-offset-4 text-white/90"
                >
                  {announcement.ctaLabel}
                </Link>
              )}
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/90">
                {announcement.message}
              </span>
              {announcement.ctaLabel && (
                <Link
                  href={announcement.ctaHref}
                  className="text-[10px] font-medium underline underline-offset-4 text-white/90"
                >
                  {announcement.ctaLabel}
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      )}

      <div className="w-full">
        <motion.div
          initial={false}
          animate={{
            maxWidth: isScrolled ? '1536px' : '98%',
            marginLeft: isScrolled ? 'auto' : 'auto',
            marginRight: isScrolled ? 'auto' : 'auto',
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className={cn(
            'flex items-center justify-between rounded-[32px] md:rounded-[40px] lg:rounded-[48px] border px-4 py-2 md:px-6 md:py-3 mt-2 transition-all duration-500 overflow-hidden',
            'border-primary-300/30 mx-auto',
            !isScrolled 
              ? 'bg-white shadow-sm' 
              : 'bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(58,135,136,0.15)] border-primary-300/50'
          )}
        >
          <motion.div
            animate={{
              scale: isScrolled ? 0.9 : 1,
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={logoUrl || '/logo.png'}
                alt="Fabseating - Premium Furniture & Furnishings"
                width={200}
                height={60}
                className={cn(
                  'w-auto transition-all duration-500',
                  isScrolled ? 'h-9 md:h-10' : 'h-10 md:h-12'
                )}
                priority
              />
            </Link>
          </motion.div>

          <nav className={cn(
            'hidden md:flex items-center transition-all duration-500 flex-shrink-0 whitespace-nowrap',
            isScrolled ? 'gap-6' : 'gap-8 lg:gap-12'
          )}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'font-medium transition-all duration-500 relative px-4 py-2.5 group whitespace-nowrap flex-shrink-0 overflow-hidden',
                  isScrolled ? 'text-sm' : 'text-base',
                  isScrolled 
                    ? pathname === item.href 
                      ? 'text-gray-900 font-semibold' 
                      : 'text-gray-800 hover:text-gray-900'
                    : pathname === item.href 
                    ? 'text-primary-800 font-semibold' 
                    : 'text-primary-700 hover:text-primary-800'
                )}
              >
                <span className="relative z-10 inline-block transition-all duration-500 group-hover:tracking-wider">
                  {item.label}
                </span>
                {/* Animated underline */}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center"></span>
                {/* Background glow effect */}
                <span className="absolute inset-0 bg-primary-50/0 group-hover:bg-primary-50/30 rounded-lg transform scale-95 group-hover:scale-100 transition-all duration-500 -z-0"></span>
                {/* Shimmer effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent -z-0"></span>
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden relative z-[80] p-2 -mr-2 text-primary-950 hover:bg-primary-50 rounded-full transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <div className="w-6 h-5 flex flex-col justify-between pointer-events-none">
              <span
                className={cn(
                  'block h-0.5 w-full bg-current transition-all duration-300 ease-in-out',
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                )}
              />
              <span
                className={cn(
                  'block h-0.5 w-full bg-current transition-all duration-300 ease-in-out',
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                )}
              />
              <span
                className={cn(
                  'block h-0.5 w-full bg-current transition-all duration-300 ease-in-out',
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                )}
              />
            </div>
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            
            {/* Side Panel */}
            <motion.div
              id="mobile-navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white/95 backdrop-blur-xl z-[70] md:hidden shadow-2xl border-l border-primary-100 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-primary-100/50">
                <span className="text-xl font-serif font-bold text-primary-900">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-primary-50 text-primary-900 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-6">
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "block py-3 px-4 rounded-xl text-lg font-medium transition-all duration-300",
                          pathname === item.href
                            ? "bg-primary-50 text-primary-900 shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 hover:text-primary-800"
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              <div className="p-6 bg-primary-50/50 border-t border-primary-100/50">
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-primary-600/80 font-medium">Get in touch</p>
                  <div className="flex gap-3">
                    <a href="tel:+919841066135" className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-white border border-primary-100 shadow-sm text-primary-800 hover:text-primary-900 hover:shadow-md transition-all">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm font-semibold">Call</span>
                    </a>
                    <a href="https://wa.me/919841066135" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 shadow-sm text-[#128C7E] hover:text-[#075E54] hover:shadow-md transition-all">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297.839-1.457 1.54-2.03 1.64-.545.093-1.243.134-2.02-.124-.474-.153-1.085-.35-1.879-.828-3.307-1.977-5.463-5.577-5.627-5.842-.163-.264-1.348-1.795-1.348-3.424 0-1.63.859-2.429 1.164-2.763.306-.334.669-.418.892-.418.223 0 .446.003.641.012.206.01.48-.078.75.57.297.693 1 2.404 1.086 2.58.086.176.143.382.026.617-.116.235-.176.382-.345.588-.173.206-.363.461-.518.62-.173.176-.353.37-.152.735.202.364.9 1.48 1.937 2.392 1.334 1.154 2.452 1.51 2.816 1.671.364.161.577.147.787-.088.21-.235.904-1.056 1.148-1.418.244-.362.498-.304.83-.176.332.128 2.104.994 2.465 1.174.362.18.602.268.691.416.09.147.09.85-.207 1.689z"/>
                        <path d="M12.004 2C6.485 2 2 6.486 2 12.005c0 2.103.691 4.055 1.872 5.64L3 22l4.5-1.856c1.53.84 3.287 1.325 5.004 1.325 5.519 0 10.004-4.486 10.004-10.004C22.508 6.486 17.523 2 12.004 2zm0 18.007c-1.52 0-3.018-.42-4.321-1.211l-.31-.185-2.554 1.053.547-2.63-.201-.322C4.267 15.532 3.996 13.8 3.996 12.005 3.996 7.586 7.585 3.997 12.004 3.997s8.008 3.589 8.008 8.008-3.59 8.002-8.008 8.002z"/>
                      </svg>
                      <span className="text-sm font-semibold">WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
