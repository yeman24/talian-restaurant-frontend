import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGallery } from '@/hooks/useDishes'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const GalleryLightbox: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null)
  const { data: items } = useGallery(selectedCategory)

  const categories = [
    { id: 'all', label: 'All Photographs' },
    { id: 'culinary', label: 'Plated Artistry' },
    { id: 'ambiance', label: 'Dining Rooms' },
    { id: 'cellar', label: 'The Cellar' },
    { id: 'kitchen', label: 'Kitchen Pass & Forage' },
  ]

  const handleNext = useCallback(() => {
    if (!items || items.length === 0 || activePhotoIndex === null) return
    setActivePhotoIndex((prev) => ((prev ?? 0) + 1) % items.length)
  }, [items, activePhotoIndex])

  const handlePrev = useCallback(() => {
    if (!items || items.length === 0 || activePhotoIndex === null) return
    setActivePhotoIndex((prev) => ((prev ?? 0) - 1 + items.length) % items.length)
  }, [items, activePhotoIndex])

  const handleClose = useCallback(() => {
    setActivePhotoIndex(null)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activePhotoIndex, handleClose, handleNext, handlePrev])

  const activePhoto = activePhotoIndex !== null && items ? items[activePhotoIndex] : null

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-8 mb-4 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'whitespace-nowrap px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-sans rounded-full transition-all duration-300',
                isActive
                  ? 'bg-[#c5a059] text-black font-semibold shadow-md shadow-[#c5a059]/20'
                  : 'text-stone-400 hover:text-white bg-[#101319] border border-stone-800 hover:border-stone-700'
              )}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((item, index) => (
          <motion.button
            type="button"
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            onClick={() => setActivePhotoIndex(index)}
            className="group relative rounded-lg overflow-hidden cursor-pointer bg-stone-900 border border-stone-800/80 hover:border-[#c5a059]/50 aspect-[4/3]"
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#c5a059] font-sans">
                {item.category}
              </span>
              <h4 className="font-serif text-lg text-white font-light">{item.title}</h4>
              <p className="text-xs text-stone-300 line-clamp-2 mt-1 font-light">{item.caption}</p>
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                <Maximize2 className="w-3.5 h-3.5 text-[#c5a059]" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${activePhoto.title} image viewer`}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 z-50 text-stone-400 hover:text-white p-2 rounded-full bg-stone-900/60 hover:bg-stone-800 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Nav */}
            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 text-stone-400 hover:text-white p-3 rounded-full bg-stone-900/60 hover:bg-stone-800 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Nav */}
            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 text-stone-400 hover:text-white p-3 rounded-full bg-stone-900/60 hover:bg-stone-800 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Lightbox Content */}
            <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
              <motion.div
                key={activePhoto.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-lg overflow-hidden max-h-[70vh] shadow-2xl border border-stone-800"
              >
                <img
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  className="max-h-[70vh] w-auto object-contain mx-auto"
                />
              </motion.div>

              <div className="text-center mt-4 max-w-xl">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-sans">
                  Photo {(activePhotoIndex ?? 0) + 1} of {items?.length} • {activePhoto.category}
                </span>
                <h3 className="font-serif text-xl text-white font-light mt-1">{activePhoto.title}</h3>
                <p className="text-xs text-stone-400 font-light mt-1">{activePhoto.caption}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
