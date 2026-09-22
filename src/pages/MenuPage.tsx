import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/common/PageHeader'
import { MenuFilters } from '@/components/menu/MenuFilters'
import { DishCard } from '@/components/menu/DishCard'
import { Skeleton } from '@/components/common/Skeleton'
import { Button } from '@/components/common/Button'
import { useDishes, useTastingMenus } from '@/hooks/useDishes'
import { useToast } from '@/context/ToastContext'
import { formatCurrency } from '@/lib/utils'
import { Download, Sparkles, Utensils, Wine, Clock } from 'lucide-react'
import { ErrorState } from '@/components/common/ErrorState'

export const MenuPage: React.FC = () => {
  const [category, setCategory] = useState<string>('all')
  const [dietary, setDietary] = useState<string>('all')
  const [search, setSearch] = useState<string>('')
  const [activeMenuTab, setActiveMenuTab] = useState<'autumn-terroir' | 'foraged-harvest'>('autumn-terroir')

  const { toast } = useToast()
  const dishesQuery = useDishes({ category, dietary, search })
  const tastingMenusQuery = useTastingMenus()
  const { data: dishes, isLoading, isError, refetch: refetchDishes } = dishesQuery
  const { data: tastingMenus, isLoading: isLoadingTastingMenus, isError: isTastingError, refetch: refetchTastingMenus } = tastingMenusQuery

  const activeTasting = tastingMenus?.find((m) => m.id === activeMenuTab || m.slug === activeMenuTab)

  const handleDownloadPdf = () => {
    toast({
      title: 'Tasting Menu PDF Dispatched',
      message: 'The Autumn Terroir & Cellar Catalog PDF has been prepared for download.',
      type: 'info',
    })
  }

  const handleResetFilters = () => {
    setCategory('all')
    setDietary('all')
    setSearch('')
  }

  const hasActiveFilters = category !== 'all' || dietary !== 'all' || search.trim() !== ''

  return (
    <div>
      <PageHeader
        eyebrow="Gastronomic Sequence"
        title="The Autumn Tasting Arc"
        subtitle="A seasonal dialogue between Scotland’s untamed wilderness, highland estates, and hand-harvested coastal waters."
        breadcrumbs={[{ label: 'Menu' }]}
        accentImage="https://images.unsplash.com/photo-1612204078213-a227dba74093?auto=format&fit=crop&w=1200&q=85"
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {(isError || isTastingError) && (
          <div className="mb-10">
            <ErrorState onRetry={() => { void Promise.all([refetchDishes(), refetchTastingMenus()]) }} />
          </div>
        )}
        {/* Tasting Menu Overview Feature Card */}
        {isLoadingTastingMenus && !activeTasting ? (
          <div className="mb-20 bg-white border border-[#e2d7ba] rounded-2xl p-8 sm:p-12 space-y-6 shadow-md">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-12 w-80" />
            <Skeleton className="h-5 w-full max-w-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#e2d7ba]">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
          </div>
        ) : activeTasting && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 bg-white border border-[#e2d7ba] rounded-2xl p-8 sm:p-12 shadow-md relative overflow-hidden"
          >
            {/* Top Toggle between Signature and Plant-Based */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2d7ba] pb-6 mb-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveMenuTab('autumn-terroir')}
                  className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-sans transition-all cursor-pointer ${
                    activeMenuTab === 'autumn-terroir'
                      ? 'bg-[#12141a] text-[#fcf5df] font-bold shadow-md'
                      : 'bg-[#fcf5df] text-[#12141a] border border-[#e2d7ba] hover:bg-white'
                  }`}
                >
                  The Autumn Terroir
                </button>
                <button
                  onClick={() => setActiveMenuTab('foraged-harvest')}
                  className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-sans transition-all cursor-pointer ${
                    activeMenuTab === 'foraged-harvest'
                      ? 'bg-[#12141a] text-[#fcf5df] font-bold shadow-md'
                      : 'bg-[#fcf5df] text-[#12141a] border border-[#e2d7ba] hover:bg-white'
                  }`}
                >
                  The Forager’s Harvest (Plant-Based)
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPdf}
                leftIcon={<Download className="w-3.5 h-3.5" />}
                className="text-[10px]"
              >
                Download PDF
              </Button>
            </div>

            {/* Menu Header Details with Animated Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMenuTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-3xl mb-10">
                  <span className="text-xs uppercase tracking-[0.25em] text-[#12141a] font-sans font-semibold">
                    Chef Patron Euan Macleod
                  </span>
                  <h2 className="font-serif text-4xl sm:text-5xl text-[#12141a] mt-1 mb-3">
                    {activeTasting.title}
                  </h2>
                  <p className="text-[#4a5160] font-sans text-sm sm:text-base leading-relaxed mb-4">
                    {activeTasting.subtitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-6 text-xs text-[#5e6576] font-sans">
                    <span className="flex items-center gap-1.5 text-[#12141a] font-medium">
                      <Utensils className="w-3.5 h-3.5" />
                      {activeTasting.coursesCount} Courses • {formatCurrency(activeTasting.price)} per guest
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Wine className="w-3.5 h-3.5 text-[#12141a]" />
                      Sommelier Cellar Pairing: +{formatCurrency(activeTasting.pairingPrice)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#12141a]" />
                      {activeTasting.duration}
                    </span>
                  </div>
                </div>

                {/* Structured Course-by-Course Flow */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#e2d7ba]">
                  {activeTasting.courses.map((course, idx) => (
                    <motion.div
                      key={course.number}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.04 }}
                      className="p-5 rounded-xl bg-[#fcf5df]/50 border border-[#e2d7ba] hover:border-[#12141a]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase tracking-widest text-[#12141a] font-sans font-bold">
                          Course 0{course.number}
                        </span>
                        {course.gaelicTitle && (
                          <span className="text-xs font-serif italic text-[#12141a]/60">
                            {course.gaelicTitle}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-2xl text-[#12141a] mb-1.5">{course.title}</h4>
                      <p className="text-xs text-[#5e6576] font-sans leading-relaxed mb-3">
                        {course.description}
                      </p>
                      <div className="text-[10px] text-[#12141a] font-sans border-t border-[#e2d7ba]/60 pt-2 flex items-center gap-1">
                        <Wine className="w-3 h-3 text-[#12141a] shrink-0" />
                        <span>Pairing: {course.pairing}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Explore All Dishes & Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="pt-8"
        >
          <div className="mb-8">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#12141a] font-sans font-semibold">
              Culinary Index
            </span>
            <h3 className="font-serif text-4xl sm:text-5xl text-[#12141a] mt-1">
              Explore Individual Dishes & Ingredients
            </h3>
            <p className="text-xs text-[#5e6576] font-sans mt-1">
              Select any dish to discover its Scottish provenance, hand-diver origin, and sommelier pairing notes.
            </p>
          </div>

          <MenuFilters
            category={category}
            onCategoryChange={setCategory}
            dietary={dietary}
            onDietaryChange={setDietary}
            search={search}
            onSearchChange={setSearch}
            onReset={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Dishes Grid or Loading / Empty States */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : dishes && dishes.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {dishes.map((dish) => (
                  <DishCard key={dish.id} dish={dish} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Beautiful Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-20 px-6 bg-white border border-[#e2d7ba] rounded-2xl max-w-lg mx-auto shadow-sm"
            >
              <Sparkles className="w-8 h-8 text-[#12141a] mx-auto mb-4" />
              <h4 className="font-serif text-3xl text-[#12141a] mb-2">
                No Courses Matched Your Criteria
              </h4>
              <p className="text-xs text-[#5e6576] font-sans mb-6 leading-relaxed">
                We could not find any seasonal dishes matching your search terms or dietary filters.
                Our cellar and kitchen can accommodate tailored requests upon booking.
              </p>
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Reset All Filters
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
