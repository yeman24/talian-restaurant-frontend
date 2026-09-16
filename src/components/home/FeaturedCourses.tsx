import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDishes } from '@/hooks/useDishes'
import { DishCard } from '@/components/menu/DishCard'
import { Skeleton } from '@/components/common/Skeleton'
import { Button } from '@/components/common/Button'
import { ArrowRight, UtensilsCrossed } from 'lucide-react'

export const FeaturedCourses: React.FC = () => {
  const { data: dishes, isLoading } = useDishes()

  const featuredDishes = dishes?.filter((d) => d.isSignature).slice(0, 3) || []

  return (
    <section className="py-24 lg:py-32 bg-[#0b0d12] border-t border-stone-800/60 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="text-xs uppercase tracking-[0.28em] text-[#c5a059] font-sans font-medium">
                The Signature Plating
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-light">
              Highlights of the Autumn Tasting Arc
            </h2>
          </div>

          <Link to="/menu">
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="text-xs tracking-[0.2em]"
            >
              View Full Tasting Menu
            </Button>
          </Link>
        </div>

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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}

        {/* Sommelier Banner Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 p-8 rounded-lg bg-[#141720]/80 border border-[#c5a059]/30 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a059] font-medium font-sans">
              Head Sommelier’s Selection
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-white">
              Prestige Cellar Pairings & Silent Distillery Scotches
            </h3>
            <p className="text-xs text-stone-400 max-w-xl font-light">
              Every course is married to Grand Cru European biodynamic vintages and rare Scottish
              whiskies curated exclusively for the Autumn tasting sequence.
            </p>
          </div>
          <Link to="/menu" className="shrink-0">
            <Button variant="gold" size="sm">
              Explore Wine Cellar
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
