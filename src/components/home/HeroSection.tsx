import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/common/Button'
import { Calendar, ArrowRight, Compass } from 'lucide-react'

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[720px] sm:min-h-[95vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 sm:pb-16">
      {/* Background Image with Dark Scottish Atmosphere & Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=2000&q=90"
          alt="Historic subterranean dining vaults at AURA Edinburgh"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.15] scale-105"
        />
        {/* Gradients and Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-[#08090c]/60 to-black/60" />
        <div className="absolute inset-0 bg-radial-luxury opacity-80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Michelin Star Award Crest */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-3 px-3 sm:px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-[#c5a059]/40 mb-5 sm:mb-8 shadow-2xl"
        >
          <div className="flex items-center text-[#c5a059] gap-1">
            <span className="text-sm">✦</span>
            <span className="text-sm">✦</span>
          </div>
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#f5eed8] font-sans font-medium">
            Two Michelin Stars • The Michelin Guide 2025
          </span>
        </motion.div>

        {/* Editorial Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-light tracking-tight leading-[1.08] mb-6 max-w-4xl"
        >
          Scottish Terroir, <br />
          <span className="italic text-[#e8dbbe] font-light">Refined to the Sublime.</span>
        </motion.h1>

        {/* Evocative Narrative Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="text-stone-300 font-sans text-sm sm:text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-7 sm:mb-10 text-stone-200/90"
        >
          An unhurried gastronomic pilgrimage through the lochs, wild moors, and coastal waters of
          Scotland. Plated with modernist mastery inside historic 18th-century Edinburgh vaults.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link to="/reservations" className="w-full sm:w-auto">
            <Button
              variant="gold"
              size="lg"
              leftIcon={<Calendar className="w-4 h-4" />}
              className="w-full sm:w-auto px-9 py-4 text-xs font-semibold"
            >
              Reserve a Table
            </Button>
          </Link>
          <Link to="/menu" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto px-8 py-4 text-xs"
            >
              Explore Autumn Menu
            </Button>
          </Link>
        </motion.div>

        {/* Live Service Status Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.65 }}
          className="mt-9 sm:mt-14 pt-5 sm:pt-6 border-t border-stone-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-stone-400"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c5a059] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c5a059]"></span>
            </span>
            <span className="text-stone-300 font-sans tracking-wide">
              Current Service: Autumn 8-Course Tasting
            </span>
          </div>
          <span className="hidden sm:inline text-stone-700">•</span>
          <div className="flex items-center gap-1.5 text-stone-400">
            <Compass className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Royal Terrace Vaults, Edinburgh</span>
          </div>
          <span className="hidden sm:inline text-stone-700">•</span>
          <span className="text-stone-400 italic font-serif">
            Head Sommelier Fiona Sinclair’s Cellar Pairings Available
          </span>
        </motion.div>
      </div>
    </section>
  )
}
