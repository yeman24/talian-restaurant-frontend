import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu as MenuIcon, X, Calendar, Shield, User, LogOut } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const location = useLocation()
  const { user, isAuthenticated, isStaff, openAuthModal, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
    setUserDropdownOpen(false)
  }, [location.pathname])

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
        'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
        scrolled
          ? 'bg-[#08090c]/90 backdrop-blur-md border-b border-stone-800/80 py-3.5 shadow-xl shadow-black/40'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="group flex flex-col items-start focus-visible:outline-none">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl tracking-[0.25em] text-white group-hover:text-[#c5a059] transition-colors uppercase font-light">
              A U R A
            </span>
            <span className="text-[#c5a059] text-xs">✦</span>
          </div>
          <span className="text-[9px] tracking-[0.3em] uppercase text-stone-400 font-sans group-hover:text-stone-300 transition-colors">
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
                className={cn(
                  'relative text-xs tracking-[0.22em] uppercase font-sans py-1 transition-colors duration-200',
                  isActive
                    ? 'text-[#c5a059] font-medium'
                    : 'text-stone-300 hover:text-white'
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#c5a059]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Actions (Auth + Reserve) */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#c5a059]/40 bg-[#12141c] hover:border-[#c5a059] text-xs text-stone-200 transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-[#c5a059]/20 text-[#c5a059] flex items-center justify-center text-[10px] font-bold">
                  {user.firstName[0]}
                </div>
                <span className="tracking-wide text-xs">{user.firstName}</span>
                {isStaff && (
                  <span className="bg-[#c5a059] text-black text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                    {user.role}
                  </span>
                )}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#10121a] border border-stone-800 rounded-lg shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-stone-800/80">
                    <p className="text-[11px] font-medium text-white truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                  </div>

                  {isStaff && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#c5a059] hover:bg-[#1a1e2b] transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin Console</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={async () => {
                      setUserDropdownOpen(false)
                      await logout()
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              className="text-xs tracking-[0.18em] uppercase text-stone-300 hover:text-[#c5a059] font-sans flex items-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Portal</span>
            </button>
          )}

          <Link to="/reservations">
            <Button
              variant="gold"
              size="sm"
              leftIcon={<Calendar className="w-3.5 h-3.5" />}
              className="px-5 py-2 tracking-[0.2em]"
            >
              Book Table
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-3 lg:hidden">
          {isAuthenticated ? (
            <button
              onClick={() => setMobileOpen(true)}
              className="w-7 h-7 rounded-full bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40 flex items-center justify-center text-xs font-bold"
            >
              {user?.firstName[0]}
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              className="text-xs text-stone-300 hover:text-[#c5a059] p-1.5"
              aria-label="Sign In"
            >
              <User className="w-4 h-4" />
            </button>
          )}

          <Link to="/reservations">
            <Button variant="gold" size="sm" className="px-3 py-1.5 text-[10px]">
              Reserve
            </Button>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-stone-200 hover:text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#c5a059]"
            aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileOpen}
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
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#0a0c10]/98 border-b border-stone-800/90 backdrop-blur-2xl overflow-hidden px-6 pt-6 pb-8"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'text-sm tracking-[0.25em] uppercase font-sans py-2 border-b border-stone-800/50 flex items-center justify-between',
                      isActive ? 'text-[#c5a059] font-medium' : 'text-stone-300'
                    )}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="text-xs text-[#c5a059]">✦</span>}
                  </Link>
                )
              })}

              {/* Mobile Auth & Staff Options */}
              <div className="py-2 border-b border-stone-800/50">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="text-xs text-stone-300 flex items-center justify-between">
                      <span>
                        Signed in as <strong className="text-white">{user.firstName}</strong> ({user.role})
                      </span>
                      <button
                        onClick={logout}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                    {isStaff && (
                      <Link
                        to="/admin"
                        className="block w-full py-2 px-3 text-center bg-[#c5a059]/15 border border-[#c5a059]/40 rounded text-xs text-[#c5a059] uppercase tracking-wider font-semibold"
                      >
                        Staff Management Console
                      </Link>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      openAuthModal()
                    }}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c5a059] py-1"
                  >
                    <User className="w-4 h-4" />
                    <span>Staff & Patron Sign In</span>
                  </button>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Link to="/reservations" className="w-full">
                  <Button variant="gold" className="w-full justify-center">
                    Reserve an Experience
                  </Button>
                </Link>
                <div className="text-center text-[10px] tracking-widest text-stone-500 uppercase mt-2">
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

