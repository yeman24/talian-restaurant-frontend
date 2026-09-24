import React from 'react'
import { motion } from 'framer-motion'
import { ButtonLink } from '@/components/common/ButtonLink'
import { Calendar, ArrowRight, Compass } from 'lucide-react'

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[720px] sm:min-h-[95vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 sm:pb-20">
      {/* Background Image with Cinematic Scottish Atmosphere & Parchment Base Blend */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1600&q=80"
          alt="Historic subterranean dining vaults at AURA Edinburgh"
          width="1600"
          height="960"
          fetchPriority="high"
          decoding="async"
          onError={(e) => {
            if (e.currentTarget.src !== window.location.origin + '/images/vault_dining.jpg') {
              e.currentTarget.src = '/images/vault_dining.jpg';
            }
          }}
          className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-[1.1] scale-105"
        />
        {/* Gradients smoothly transitioning into the #fcf5df parchment foundation */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#fcf5df] via-[#12141a]/65 to-[#12141a]/90" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Michelin Star Award Crest */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#e2d7ba] mb-6 sm:mb-8 shadow-md"
        >
          <div className="flex items-center text-[#12141a] gap-1">
            <span className="text-sm">✦</span>
            <span className="text-sm">✦</span>
          </div>
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#12141a] font-sans font-semibold">
            Two Michelin Stars • The Michelin Guide 2025
          </span>
        </motion.div>

        {/* Editorial Headline in Story Script */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#fcf5df] tracking-normal leading-[1.05] mb-6 max-w-4xl drop-shadow-md"
        >
          Scottish Terroir, <br />
          <span className="text-[#fcf5df]">Refined to the Sublime.</span>
        </motion.h1>

        {/* Evocative Narrative Subtitle in Arimo */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-[#fcf5df]/90 font-sans text-sm sm:text-lg md:text-xl font-normal max-w-2xl leading-relaxed mb-8 sm:mb-10 drop-shadow-sm"
        >
          An unhurried gastronomic pilgrimage through the lochs, wild moors, and coastal waters of
          Scotland. Plated with modernist mastery inside historic 18th-century Edinburgh vaults.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <ButtonLink to="/reservations" className="w-full sm:w-auto px-9 py-4 text-xs font-semibold bg-[#12141a] text-[#fcf5df] hover:bg-[#202532] shadow-xl" variant="primary" size="lg" leftIcon={<Calendar className="w-4 h-4" />}>
              Reserve a Table
          </ButtonLink>
          <ButtonLink to="/menu" className="w-full sm:w-auto px-8 py-4 text-xs border-white/80 text-white hover:bg-white hover:text-[#12141a]" variant="outline" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Autumn Menu
          </ButtonLink>
        </motion.div>

        {/* Live Service Status Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="mt-10 sm:mt-14 pt-5 sm:pt-6 border-t border-[#12141a]/15 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#12141a]"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12141a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#12141a]"></span>
            </span>
            <span className="text-[#12141a] font-sans font-medium tracking-wide">
              Current Service: Autumn 8-Course Tasting
            </span>
          </div>
          <span className="hidden sm:inline text-[#12141a]/30">•</span>
          <div className="flex items-center gap-1.5 text-[#12141a]/80">
            <Compass className="w-3.5 h-3.5 text-[#12141a]" />
            <span>Royal Terrace Vaults, Edinburgh</span>
          </div>
          <span className="hidden sm:inline text-[#12141a]/30">•</span>
          <span className="text-[#12141a] font-serif text-sm">
            Head Sommelier Fiona Sinclair’s Cellar Pairings Available
          </span>
        </motion.div>
      </div>
    </section>
  )
}
