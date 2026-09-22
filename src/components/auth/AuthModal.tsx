import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/common/Button'
import { X, Lock, Mail } from 'lucide-react'

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, registerUser, isLoading } = useAuth()
  const [tab, setTab] = useState<'login' | 'register'>('login')

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form state
  const [regFirstName, setRegFirstName] = useState('')
  const [regLastName, setRegLastName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')

  useEffect(() => {
    if (!isAuthModalOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAuthModal()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAuthModalOpen, closeAuthModal])

  if (!isAuthModalOpen) return null

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) return
    await login(loginEmail, loginPassword)
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regEmail || !regPassword || !regFirstName || !regLastName) return
    await registerUser({
      firstName: regFirstName,
      lastName: regLastName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
    })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md bg-[#fcf5df] border border-[#e2d7ba] rounded-xl p-6 sm:p-8 shadow-2xl text-[#12141a]"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-[#5e6576] hover:text-[#12141a] transition-colors p-1 cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <span className="font-serif text-3xl text-[#12141a] block">
              <span id="auth-modal-title">Aura</span>
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#12141a] font-sans font-medium block mt-1">
              Patron & Staff Portal
            </span>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-[#e2d7ba] mb-6">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'login'}
              onClick={() => setTab('login')}
              className={`flex-1 pb-3 text-xs uppercase tracking-widest font-sans transition-colors relative cursor-pointer ${
                tab === 'login' ? 'text-[#12141a] font-bold' : 'text-[#8890a0] hover:text-[#12141a]'
              }`}
            >
              Sign In
              {tab === 'login' && (
                <motion.div
                  layoutId="activeAuthTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#12141a]"
                />
              )}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'register'}
              onClick={() => setTab('register')}
              className={`flex-1 pb-3 text-xs uppercase tracking-widest font-sans transition-colors relative cursor-pointer ${
                tab === 'register' ? 'text-[#12141a] font-bold' : 'text-[#8890a0] hover:text-[#12141a]'
              }`}
            >
              Register
              {tab === 'register' && (
                <motion.div
                  layoutId="activeAuthTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#12141a]"
                />
              )}
            </button>
          </div>

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#12141a] font-medium font-sans mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#5e6576] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    autoFocus
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-white border border-[#d8caa4] focus:border-[#12141a] rounded px-9 py-2.5 text-xs text-[#12141a] placeholder-[#8890a0] focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#12141a] font-medium font-sans mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#5e6576] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-[#d8caa4] focus:border-[#12141a] rounded px-9 py-2.5 text-xs text-[#12141a] placeholder-[#8890a0] focus:outline-none font-sans"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="md"
                isLoading={isLoading}
                className="w-full justify-center mt-2"
              >
                Sign In to Account
              </Button>

            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#12141a] font-medium font-sans mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    placeholder="Lady Eleanor"
                    className="w-full bg-white border border-[#d8caa4] focus:border-[#12141a] rounded px-3 py-2 text-xs text-[#12141a] focus:outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#12141a] font-medium font-sans mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    placeholder="Vance"
                    className="w-full bg-white border border-[#d8caa4] focus:border-[#12141a] rounded px-3 py-2 text-xs text-[#12141a] focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#12141a] font-medium font-sans mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="eleanor.vance@example.co.uk"
                  className="w-full bg-white border border-[#d8caa4] focus:border-[#12141a] rounded px-3 py-2 text-xs text-[#12141a] focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#12141a] font-medium font-sans mb-1">
                  Telephone (Optional)
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+44 7911 123456"
                  className="w-full bg-white border border-[#d8caa4] focus:border-[#12141a] rounded px-3 py-2 text-xs text-[#12141a] focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#12141a] font-medium font-sans mb-1">
                  Password * (Min 8 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#d8caa4] focus:border-[#12141a] rounded px-3 py-2 text-xs text-[#12141a] focus:outline-none font-sans"
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                size="md"
                isLoading={isLoading}
                className="w-full justify-center mt-3"
              >
                Create Dining Account
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
