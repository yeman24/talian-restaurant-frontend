import React from 'react'
import { motion } from 'framer-motion'
import { useDishes } from '@/hooks/useDishes'
import { DishCard } from '@/components/menu/DishCard'
import { Skeleton } from '@/components/common/Skeleton'
import { ButtonLink } from '@/components/common/ButtonLink'
import { ArrowRight, UtensilsCrossed } from 'lucide-react'
import { ErrorState } from '@/components/common/ErrorState'

export const FeaturedCourses: React.FC = () => {
  const { data: dishes, isLoading, isError, refetch } = useDishes()

  const featuredDishes = dishes?.filter((d) => d.isSignature).slice(0, 3) || []

  return (
    <section className="py-24 lg:py-32 bg-[#fcf5df] border-t border-[#e2d7ba] relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#12141a]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#12141a] font-sans font-semibold">
                The Signature Plating
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#12141a]">
              Highlights of the Autumn Tasting Arc
            </h2>
          </div>

          <ButtonLink
              to="/menu"
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="text-xs tracking-[0.2em]"
            >
              View Full Tasting Menu
          </ButtonLink>
        </motion.div>

        {/* Dishes Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => { void refetch() }} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </motion.div>
        )}

        {/* Sommelier Banner Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 p-8 rounded-xl bg-white border border-[#e2d7ba] shadow-md flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#12141a] font-semibold font-sans">
              Head Sommelier’s Selection
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#12141a]">
              Prestige Cellar Pairings & Silent Distillery Scotches
            </h3>
            <p className="text-xs text-[#5e6576] max-w-xl font-normal leading-relaxed font-sans">
              Every course is married to Grand Cru European biodynamic vintages and rare Scottish
              whiskies curated exclusively for the Autumn tasting sequence.
            </p>
          </div>
          <ButtonLink to="/menu" variant="gold" size="sm" className="shrink-0">
              Explore Wine Cellar
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  )
}
