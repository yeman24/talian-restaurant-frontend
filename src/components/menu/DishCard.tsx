import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Dish } from '@/types'
import { Badge } from '@/components/common/Badge'
import { formatCurrency } from '@/lib/utils'
import { Wine, ArrowUpRight, Sparkles } from 'lucide-react'

interface DishCardProps {
  dish: Dish
  layout?: 'grid' | 'detailed'
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white border border-[#e2d7ba] hover:border-[#12141a] rounded-xl overflow-hidden transition-all duration-500 flex flex-col justify-between shadow-sm hover:shadow-md"
    >
      {/* Image Container with Ambient Gradient */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={dish.image || '/images/chanterelles.jpg'}
          alt={dish.name}
          width="800"
          height="600"
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (e.currentTarget.src !== window.location.origin + '/images/chanterelles.jpg') {
              e.currentTarget.src = '/images/chanterelles.jpg';
            }
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {dish.courseNumber ? (
            <span className="text-[9px] font-sans font-bold uppercase tracking-widest bg-white/95 text-[#12141a] border border-[#e2d7ba] px-2.5 py-1 rounded-full shadow-sm">
              Course 0{dish.courseNumber}
            </span>
          ) : (
            <span className="text-[9px] font-sans font-bold uppercase tracking-widest bg-white/95 text-[#12141a] border border-[#e2d7ba] px-2.5 py-1 rounded-full shadow-sm">
              {dish.category}
            </span>
          )}

          {dish.isSignature && (
            <span className="inline-flex items-center gap-1 text-[9px] tracking-widest uppercase font-bold text-[#fcf5df] bg-[#12141a] px-2.5 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3 text-[#fcf5df]" /> Signature
            </span>
          )}
        </div>

        {/* Provenance Tag on Image bottom */}
        <div className="absolute bottom-2 left-3 right-3 pointer-events-none">
          <p className="text-[10px] text-white font-sans tracking-wider drop-shadow-md truncate">
            {dish.provenance}
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Gaelic name subtitle */}
          {dish.gaelicName && (
            <span className="text-xs font-serif italic text-[#12141a]/60 block mb-1">
              {dish.gaelicName}
            </span>
          )}

          {/* Dish Title in Story Script */}
          <h3 className="font-serif text-2xl sm:text-3xl text-[#12141a] group-hover:text-[#3a4254] transition-colors leading-tight mb-2">
            <Link to={`/menu/${dish.id}`} className="focus:outline-none focus:underline">
              {dish.name}
            </Link>
          </h3>

          {/* Description in Arimo */}
          <p className="text-xs text-[#5e6576] font-sans font-normal leading-relaxed line-clamp-2 mb-4">
            {dish.description}
          </p>
        </div>

        <div>
          {/* Wine Pairing Snippet */}
          {dish.winePairing && (
            <div className="pt-3 border-t border-[#e2d7ba] mb-4 flex items-start gap-2 text-[#5e6576]">
              <Wine className="w-3.5 h-3.5 text-[#12141a] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight">
                <span className="text-[#12141a] font-serif text-sm">
                  {dish.winePairing.name}
                </span>
                <span className="text-[#8c94a4] text-[10px] block font-sans">
                  {dish.winePairing.region} ({dish.winePairing.vintage})
                </span>
              </div>
            </div>
          )}

          {/* Dietary Badges and Price footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#e2d7ba]/60">
            <div className="flex flex-wrap gap-1">
              {dish.dietary.slice(0, 2).map((d) => (
                <Badge key={d} variant="tag" className="text-[8px] px-1.5 py-0.5">
                  {d}
                </Badge>
              ))}
              {dish.dietary.length > 2 && (
                <span className="text-[9px] text-[#8c94a4] self-center font-sans">
                  +{dish.dietary.length - 2}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl font-serif text-[#12141a] font-bold">
                {formatCurrency(dish.price)}
              </span>
              <Link
                to={`/menu/${dish.id}`}
                aria-label={`View details for ${dish.name}`}
                className="w-7 h-7 rounded-full border border-[#e2d7ba] hover:border-[#12141a] hover:bg-[#12141a] hover:text-[#fcf5df] flex items-center justify-center text-[#12141a] transition-all"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
