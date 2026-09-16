import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReviews } from '@/hooks/useDishes'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'

export const AccoladesBanner: React.FC = () => {
  const { data: reviews } = useReviews()
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!reviews || reviews.length === 0) return null

  const next = () => setCurrentIndex((prev) => (prev + 1) % reviews.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)

  const activeReview = reviews[currentIndex]

  return (
    <section className="py-24 lg:py-32 bg-[#08090c] border-t border-stone-800/70 relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute inset-0 bg-radial-luxury opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        {/* Top Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="flex text-[#c5a059]">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span className="text-[11px] tracking-[0.28em] uppercase text-[#c5a059] font-sans font-medium">
            Critical Acclaim
          </span>
        </div>

        {/* Carousel Container */}
        <div className="relative min-h-[260px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeReview.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <Quote className="w-12 h-12 text-[#c5a059]/30 mb-4 stroke-1" />
              <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-light leading-relaxed max-w-3xl mb-8">
                "{activeReview.quote}"
              </blockquote>
              <div className="space-y-1">
                <p className="text-sm font-semibold tracking-wider text-[#c5a059] uppercase font-sans">
                  {activeReview.publication}
                </p>
                <p className="text-xs text-stone-400 font-sans">
                  {activeReview.author} • <span className="italic">{activeReview.year}</span>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination and Arrows */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-stone-800 hover:border-[#c5a059] flex items-center justify-center text-stone-400 hover:text-white transition-colors"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  currentIndex === idx ? 'w-8 bg-[#c5a059]' : 'w-2 bg-stone-800 hover:bg-stone-700'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-stone-800 hover:border-[#c5a059] flex items-center justify-center text-stone-400 hover:text-white transition-colors"
            aria-label="Next review"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
