import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/common/Button'
import { Lock, Mail, Shield, ArrowLeft } from 'lucide-react'

export const AdminLoginPage: React.FC = () => {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    if (!email || !password) {
      setErrorMessage('Please enter both your staff email and executive password.')
      return
    }

    try {
      await login(email, password)
      navigate('/admin')
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please check credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-[#fcf5df] text-[#12141a] flex flex-col justify-between selection:bg-[#12141a] selection:text-[#fcf5df] font-sans relative overflow-hidden">
      {/* Subtle warm luxury glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top bar with return link */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#12141a] hover:text-[#8f6e2f] transition-colors font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Patron Experience</span>
        </Link>
        <span className="text-[10px] uppercase tracking-[0.3em] text-stone-600 font-mono">
          Security Clearance Required
        </span>
      </header>

      {/* Main Login Card (20% Dark Focal Card on 80% Parchment Canvas) */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-[#12141a] text-[#fcf5df] border border-[#2a2f3d] rounded-2xl p-8 sm:p-10 shadow-2xl shadow-stone-900/30 relative"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1c202a] border border-[#c5a059]/40 text-[#c5a059] mb-4 shadow-lg shadow-[#c5a059]/10">
              <Shield className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-serif text-2xl tracking-[0.25em] text-white uppercase font-light">
                A U R A
              </span>
              <span className="text-[#c5a059] text-xs">✦</span>
            </div>
            <h1 className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-sans font-medium mt-1">
              Executive Administration
            </h1>
            <p className="text-xs text-stone-300 font-light mt-2">
              Sign in with active dining room, cellar master, or management credentials.
            </p>
          </div>

          {/* Error banner */}
          {errorMessage && (
            <div className="mb-6 p-3 rounded bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs text-center">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1 font-medium">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@aura-edinburgh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1d26] border border-stone-700 focus:border-[#c5a059] rounded-lg pl-10 pr-3 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1 font-medium">
                Passcode / Credentials
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1a1d26] border border-stone-700 focus:border-[#c5a059] rounded-lg pl-10 pr-3 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="md"
              isLoading={isLoading}
              className="w-full justify-center tracking-[0.2em] uppercase text-xs py-3 mt-2 bg-[#fcf5df] text-[#12141a] hover:bg-white font-bold border-none"
            >
              Access Console
            </Button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="pt-4 border-t border-stone-800/80 mt-6 text-center space-y-2">
            <p className="text-[11px] text-stone-400 font-sans">
              Development Staff Credentials:
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@aura-edinburgh.com')
                  setPassword('AuraEdinburgh2025!')
                }}
                className="px-3 py-1.5 rounded bg-stone-800/80 hover:bg-[#c5a059]/20 border border-stone-700 hover:border-[#c5a059] text-[11px] text-[#c5a059] transition-all cursor-pointer"
              >
                Executive Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('sommelier@aura-edinburgh.com')
                  setPassword('CellarMaster2025!')
                }}
                className="px-3 py-1.5 rounded bg-stone-800/80 hover:bg-[#c5a059]/20 border border-stone-700 hover:border-[#c5a059] text-[11px] text-[#c5a059] transition-all cursor-pointer"
              >
                Sommelier
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[10px] uppercase tracking-[0.2em] text-stone-600 font-mono">
        Authorized Access Only • IP Logged & Monitored
      </footer>
    </div>
  )
}
