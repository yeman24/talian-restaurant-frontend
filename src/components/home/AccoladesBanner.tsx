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
    <section className="py-24 lg:py-32 bg-[#fcf5df] border-t border-[#e2d7ba] relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute inset-0 bg-radial-luxury opacity-60 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        {/* Top Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="flex text-[#12141a]">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#12141a] font-sans font-semibold">
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
              <Quote className="w-12 h-12 text-[#12141a]/15 mb-4 stroke-1" />
              <blockquote className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#12141a] leading-relaxed max-w-3xl mb-8">
                "{activeReview.quote}"
              </blockquote>
              <div className="space-y-1">
                <p className="text-sm font-semibold tracking-wider text-[#12141a] uppercase font-sans">
                  {activeReview.publication}
                </p>
                <p className="text-xs text-[#5e6576] font-sans">
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
            className="w-10 h-10 rounded-full border border-[#e2d7ba] bg-white hover:bg-[#12141a] hover:border-[#12141a] flex items-center justify-center text-[#12141a] hover:text-[#fcf5df] transition-colors shadow-sm"
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
                  currentIndex === idx ? 'w-8 bg-[#12141a]' : 'w-2 bg-[#d8caa4] hover:bg-[#12141a]/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-[#e2d7ba] bg-white hover:bg-[#12141a] hover:border-[#12141a] flex items-center justify-center text-[#12141a] hover:text-[#fcf5df] transition-colors shadow-sm"
            aria-label="Next review"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
