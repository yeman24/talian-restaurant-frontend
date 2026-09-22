import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu as MenuIcon, X, Calendar } from 'lucide-react'
import { ButtonLink } from '@/components/common/ButtonLink'
import { cn } from '@/lib/utils'

const routePreloaders: Record<string, () => Promise<unknown>> = {
  '/': () => import('@/pages/HomePage'),
  '/menu': () => import('@/pages/MenuPage'),
  '/about': () => import('@/pages/AboutPage'),
  '/gallery': () => import('@/pages/GalleryPage'),
  '/reservations': () => import('@/pages/ReservationsPage'),
  '/contact': () => import('@/pages/ContactPage'),
}

const preloadRoute = (href: string) => {
  const preload = routePreloaders[href]
  if (preload) void preload()
}

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileOpen])

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'About', href: '/about' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Reservations', href: '/reservations' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header
      className={cn(
        'no-print fixed top-0 left-0 right-0 z-40 transition-[background-color,padding,border-color,box-shadow] duration-200',
        scrolled
          ? 'bg-[#fcf5df]/95 backdrop-blur-md border-b border-[#e2d7ba] py-3.5 shadow-sm shadow-[#12141a]/5'
          : 'bg-[#fcf5df]/90 backdrop-blur-md border-b border-[#e2d7ba]/60 py-4'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="group flex flex-col items-start focus-visible:outline-none">
          <div className="flex items-center gap-2">
            <span className="font-serif text-3xl text-[#12141a] group-hover:text-[#3a4254] transition-colors leading-none">
              Aura
            </span>
            <span className="text-[#12141a] text-xs">✦</span>
          </div>
          <span className="text-[9px] tracking-[0.25em] uppercase text-[#12141a]/60 font-sans group-hover:text-[#12141a] transition-colors mt-0.5">
            Edinburgh • 2 Michelin Stars
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.href)

            return (
              <Link
                key={link.href}
                to={link.href}
                onMouseEnter={() => preloadRoute(link.href)}
                onFocus={() => preloadRoute(link.href)}
                onPointerDown={() => preloadRoute(link.href)}
                className={cn(
                  'relative text-xs tracking-[0.22em] uppercase font-sans py-1 transition-colors duration-200',
                  isActive
                    ? 'text-[#12141a] font-semibold'
                    : 'text-[#12141a]/70 hover:text-[#12141a]'
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#12141a]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <ButtonLink
            to="/reservations"
            className="px-5 py-2 tracking-[0.2em]"
            variant="gold"
            size="sm"
            leftIcon={<Calendar className="w-3.5 h-3.5" />}
          >
            Book Table
          </ButtonLink>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <ButtonLink to="/reservations" onClick={() => setMobileOpen(false)} variant="gold" size="sm" className="px-3 py-1.5 text-[10px]">
            Reserve
          </ButtonLink>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[#12141a] hover:bg-[#12141a]/5 p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#12141a]"
            aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="lg:hidden bg-[#fcf5df]/98 border-b border-[#e2d7ba] backdrop-blur-2xl overflow-hidden px-6 pt-6 pb-8 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <nav id="mobile-navigation" aria-label="Mobile Navigation" className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'text-sm tracking-[0.25em] uppercase font-sans py-2 border-b border-[#e2d7ba] flex items-center justify-between',
                      isActive ? 'text-[#12141a] font-bold' : 'text-[#12141a]/80'
                    )}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="text-xs text-[#12141a]">✦</span>}
                  </Link>
                )
              })}

              <div className="pt-4 flex flex-col gap-3">
                <ButtonLink to="/reservations" onClick={() => setMobileOpen(false)} variant="gold" className="w-full justify-center">
                  Reserve an Experience
                </ButtonLink>
                <div className="text-center text-[10px] tracking-widest text-[#12141a]/60 uppercase mt-2">
                  14–16 Royal Terrace Vaults, Edinburgh
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
