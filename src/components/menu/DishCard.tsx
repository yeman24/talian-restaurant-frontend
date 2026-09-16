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
      className="group relative bg-[#0e1016]/90 border border-stone-800/80 hover:border-[#c5a059]/50 rounded-lg overflow-hidden transition-all duration-500 flex flex-col justify-between shadow-xl shadow-black/60 hover:shadow-[#c5a059]/10"
    >
      {/* Image Container with Ambient Gradient */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1016] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {dish.courseNumber ? (
            <Badge variant="subtle" className="text-[9px] bg-black/60 backdrop-blur-md">
              Course 0{dish.courseNumber}
            </Badge>
          ) : (
            <Badge variant="subtle" className="text-[9px] bg-black/60 backdrop-blur-md">
              {dish.category}
            </Badge>
          )}

          {dish.isSignature && (
            <span className="inline-flex items-center gap-1 text-[10px] tracking-widest uppercase font-semibold text-[#c5a059] bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#c5a059]/40">
              <Sparkles className="w-3 h-3 text-[#c5a059]" /> Signature
            </span>
          )}
        </div>

        {/* Provenance Tag on Image bottom */}
        <div className="absolute bottom-2 left-3 right-3 pointer-events-none">
          <p className="text-[10px] text-stone-300 font-sans tracking-wider drop-shadow-md truncate">
            {dish.provenance}
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Gaelic name subtitle */}
          {dish.gaelicName && (
            <span className="text-[11px] font-serif italic text-[#c5a059]/90 tracking-wider block mb-1">
              {dish.gaelicName}
            </span>
          )}

          {/* Dish Title */}
          <h3 className="font-serif text-xl sm:text-2xl text-white font-normal group-hover:text-[#c5a059] transition-colors leading-snug mb-2">
            <Link to={`/menu/${dish.id}`} className="focus:outline-none focus:underline">
              {dish.name}
            </Link>
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-400 font-light leading-relaxed line-clamp-2 mb-4">
            {dish.description}
          </p>
        </div>

        <div>
          {/* Wine Pairing Snippet */}
          {dish.winePairing && (
            <div className="pt-3 border-t border-stone-800/70 mb-4 flex items-start gap-2 text-stone-400">
              <Wine className="w-3.5 h-3.5 text-[#c5a059] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight">
                <span className="text-stone-300 font-serif italic">
                  {dish.winePairing.name}
                </span>
                <span className="text-stone-500 text-[10px] block">
                  {dish.winePairing.region} ({dish.winePairing.vintage})
                </span>
              </div>
            </div>
          )}

          {/* Dietary Badges and Price footer */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-800/50">
            <div className="flex flex-wrap gap-1">
              {dish.dietary.slice(0, 2).map((d) => (
                <Badge key={d} variant="tag" className="text-[8px] px-1.5 py-0.5">
                  {d}
                </Badge>
              ))}
              {dish.dietary.length > 2 && (
                <span className="text-[9px] text-stone-500 self-center">
                  +{dish.dietary.length - 2}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-base font-serif text-white font-medium">
                {formatCurrency(dish.price)}
              </span>
              <Link
                to={`/menu/${dish.id}`}
                aria-label={`View details for ${dish.name}`}
                className="w-7 h-7 rounded-full border border-stone-700 group-hover:border-[#c5a059] flex items-center justify-center text-stone-400 group-hover:text-white group-hover:bg-[#c5a059]/20 transition-all"
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
