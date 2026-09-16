import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/common/Button'
import { X, Lock, Mail, Sparkles, Shield } from 'lucide-react'

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

  const fillAdminCredentials = () => {
    setLoginEmail('admin@aura-edinburgh.com')
    setLoginPassword('AuraEdinburgh2025!')
  }

  const fillSommelierCredentials = () => {
    setLoginEmail('sommelier@aura-edinburgh.com')
    setLoginPassword('CellarMaster2025!')
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md bg-[#0e1017] border border-[#c5a059]/40 rounded-xl p-6 sm:p-8 shadow-2xl text-stone-300"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors p-1"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <span className="font-serif text-2xl tracking-[0.25em] text-white uppercase block">
              A U R A
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#c5a059] font-sans block mt-1">
              Patron & Staff Portal
            </span>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-stone-800 mb-6">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 pb-3 text-xs uppercase tracking-widest font-sans transition-colors relative ${
                tab === 'login' ? 'text-[#c5a059] font-semibold' : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              Sign In
              {tab === 'login' && (
                <motion.div
                  layoutId="activeAuthTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a059]"
                />
              )}
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 pb-3 text-xs uppercase tracking-widest font-sans transition-colors relative ${
                tab === 'register' ? 'text-[#c5a059] font-semibold' : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              Register
              {tab === 'register' && (
                <motion.div
                  layoutId="activeAuthTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a059]"
                />
              )}
            </button>
          </div>

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded px-9 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded px-9 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none"
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

              {/* Quick Demo Credentials */}
              <div className="pt-4 mt-4 border-t border-stone-800/80 text-center">
                <span className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-sans">
                  Quick Demo Credentials
                </span>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={fillAdminCredentials}
                    className="text-[10px] tracking-wider uppercase bg-[#141722] hover:bg-[#1a1e2b] border border-stone-800 hover:border-[#c5a059] px-2.5 py-1.5 rounded text-stone-300 transition-colors flex items-center gap-1"
                  >
                    <Shield className="w-3 h-3 text-[#c5a059]" /> Fill Admin
                  </button>
                  <button
                    type="button"
                    onClick={fillSommelierCredentials}
                    className="text-[10px] tracking-wider uppercase bg-[#141722] hover:bg-[#1a1e2b] border border-stone-800 hover:border-[#c5a059] px-2.5 py-1.5 rounded text-stone-300 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#c5a059]" /> Fill Sommelier
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    placeholder="Lady Eleanor"
                    className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    placeholder="Vance"
                    className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="eleanor.vance@example.co.uk"
                  className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">
                  Telephone (Optional)
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+44 7911 123456"
                  className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">
                  Password * (Min 8 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded px-3 py-2 text-xs text-white focus:outline-none"
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
