import React from 'react'
import { motion } from 'framer-motion'
import { ButtonLink } from '@/components/common/ButtonLink'
import { ArrowRight, Sparkles } from 'lucide-react'

export const TerroirStory: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 relative bg-[#f6eed2]/50 border-t border-[#e2d7ba] overflow-hidden">
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
            <div className="relative z-10 rounded-lg overflow-hidden border border-[#e2d7ba] shadow-xl aspect-[4/5] bg-stone-900">
              <img
                src="/images/chef_euan.jpg"
                alt="Chef Patron Euan Macleod at AURA"
                width="1200"
                height="1847"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover filter contrast-[1.05] brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating Quote Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-lg bg-white/95 backdrop-blur-md border border-[#e2d7ba] shadow-lg">
                <p className="font-serif text-lg text-[#12141a] leading-relaxed mb-2">
                  "Every dish is an edible chapter of Scotland’s wilderness — cold mountain burns,
                  heather moors, and deep North Sea tides."
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#12141a] font-sans font-semibold">
                  — Euan Macleod, Chef Patron
                </p>
              </div>
            </div>

            {/* Decorative Offset Frame */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-[#12141a]/15 rounded-lg -z-0 hidden sm:block pointer-events-none" />
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
                <Sparkles className="w-3.5 h-3.5 text-[#12141a]" />
                <span className="text-xs uppercase tracking-[0.25em] text-[#12141a] font-sans font-semibold">
                  The Philosophy
                </span>
              </div>

              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#12141a] leading-tight mb-6">
                Culinary Reverence for the Scottish Landscape
              </h2>

              <p className="text-[#4a5160] font-sans text-base leading-relaxed mb-4">
                Tucked into the atmospheric subterranean stone vaults of Edinburgh’s Georgian New
                Town, AURA was born from a singular obsession: to honour the untamed beauty of
                Scotland through world-class contemporary fine dining.
              </p>

              <p className="text-[#5e6576] font-sans text-sm leading-relaxed mb-8">
                We work directly with hand-divers in Orkney, sustainable deer stalkers in the
                Cairngorms, and small-batch coastal smokehouses. Every course tells a story of
                seasonality, patience, and historic Scottish heritage refined with Michelin-starred
                precision.
              </p>
            </div>

            {/* Key Pillars Grid */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#e2d7ba]">
              <div>
                <span className="font-serif text-4xl sm:text-5xl text-[#12141a] block mb-1">
                  2 Stars
                </span>
                <p className="text-xs tracking-wider uppercase text-[#5e6576] font-sans font-medium">
                  Michelin Guide UK
                </p>
              </div>

              <div>
                <span className="font-serif text-4xl sm:text-5xl text-[#12141a] block mb-1">
                  8 Courses
                </span>
                <p className="text-xs tracking-wider uppercase text-[#5e6576] font-sans font-medium">
                  Seasonal Tasting Arc
                </p>
              </div>

              <div>
                <span className="font-serif text-4xl sm:text-5xl text-[#12141a] block mb-1">
                  2,400+
                </span>
                <p className="text-xs tracking-wider uppercase text-[#5e6576] font-sans font-medium">
                  Sommelier Cellar Labels
                </p>
              </div>

              <div>
                <span className="font-serif text-4xl sm:text-5xl text-[#12141a] block mb-1">
                  100%
                </span>
                <p className="text-xs tracking-wider uppercase text-[#5e6576] font-sans font-medium">
                  Direct Provenance Sourcing
                </p>
              </div>
            </div>

            {/* CTA link */}
            <div className="pt-2">
              <ButtonLink to="/about" variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Discover Our Heritage
              </ButtonLink>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
