import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { ArrowRight, Sparkles } from 'lucide-react'

export const TerroirStory: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 relative bg-[#08090c] border-t border-stone-800/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Column with layered card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative z-10 rounded-lg overflow-hidden border border-stone-800 shadow-2xl shadow-black/80 aspect-[4/5] bg-stone-900">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=85"
                alt="Chef Euan Macleod preparing venison at AURA"
                className="w-full h-full object-cover filter contrast-[1.08] brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Floating Quote Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded bg-[#0e1016]/90 backdrop-blur-md border border-[#c5a059]/30">
                <p className="font-serif italic text-sm text-stone-200 leading-relaxed mb-2">
                  "Every dish is an edible chapter of Scotland’s wilderness — cold mountain burns,
                  heather moors, and deep North Sea tides."
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#c5a059] font-sans">
                  — Euan Macleod, Chef Patron
                </p>
              </div>
            </div>

            {/* Decorative Offset Frame */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-[#c5a059]/20 rounded-lg -z-0 hidden sm:block pointer-events-none" />
          </motion.div>

          {/* Text & Stats Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                <span className="text-xs uppercase tracking-[0.28em] text-[#c5a059] font-sans font-medium">
                  The Philosophy
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-light leading-tight tracking-tight mb-6">
                Culinary Reverence for the Scottish Landscape
              </h2>

              <p className="text-stone-300 font-light text-base leading-relaxed mb-4">
                Tucked into the atmospheric subterranean stone vaults of Edinburgh’s Georgian New
                Town, AURA was born from a singular obsession: to honour the untamed beauty of
                Scotland through world-class contemporary fine dining.
              </p>

              <p className="text-stone-400 font-light text-sm leading-relaxed mb-8">
                We work directly with hand-divers in Orkney, sustainable deer stalkers in the
                Cairngorms, and small-batch coastal smokehouses. Every course tells a story of
                seasonality, patience, and historic Scottish heritage refined with Michelin-starred
                precision.
              </p>
            </div>

            {/* Key Pillars Grid */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-stone-800/80">
              <div>
                <span className="font-serif text-3xl sm:text-4xl text-[#f5eed8] font-light block mb-1">
                  2 Stars
                </span>
                <p className="text-xs tracking-wider uppercase text-stone-400 font-sans">
                  Michelin Guide UK
                </p>
              </div>

              <div>
                <span className="font-serif text-3xl sm:text-4xl text-[#f5eed8] font-light block mb-1">
                  8 Courses
                </span>
                <p className="text-xs tracking-wider uppercase text-stone-400 font-sans">
                  Seasonal Tasting Arc
                </p>
              </div>

              <div>
                <span className="font-serif text-3xl sm:text-4xl text-[#f5eed8] font-light block mb-1">
                  2,400+
                </span>
                <p className="text-xs tracking-wider uppercase text-stone-400 font-sans">
                  Sommelier Cellar Labels
                </p>
              </div>

              <div>
                <span className="font-serif text-3xl sm:text-4xl text-[#f5eed8] font-light block mb-1">
                  100%
                </span>
                <p className="text-xs tracking-wider uppercase text-stone-400 font-sans">
                  Direct Provenance Sourcing
                </p>
              </div>
            </div>

            {/* CTA link */}
            <div className="pt-2">
              <Link to="/about">
                <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Discover Our Heritage
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
