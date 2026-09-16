import React, { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { MenuFilters } from '@/components/menu/MenuFilters'
import { DishCard } from '@/components/menu/DishCard'
import { Skeleton } from '@/components/common/Skeleton'
import { Button } from '@/components/common/Button'
import { useDishes, useTastingMenus } from '@/hooks/useDishes'
import { useToast } from '@/context/ToastContext'
import { formatCurrency } from '@/lib/utils'
import { Download, Sparkles, Utensils, Wine, Clock } from 'lucide-react'

export const MenuPage: React.FC = () => {
  const [category, setCategory] = useState<string>('all')
  const [dietary, setDietary] = useState<string>('all')
  const [search, setSearch] = useState<string>('')
  const [activeMenuTab, setActiveMenuTab] = useState<'autumn-terroir' | 'foraged-harvest'>('autumn-terroir')

  const { toast } = useToast()
  const { data: dishes, isLoading } = useDishes({ category, dietary, search })
  const { data: tastingMenus, isLoading: isLoadingTastingMenus } = useTastingMenus()

  const activeTasting = tastingMenus?.find((m) => m.id === activeMenuTab)

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
        {/* Tasting Menu Overview Feature Card */}
        {isLoadingTastingMenus && !activeTasting ? (
          <div className="mb-20 bg-[#0e1017] border border-stone-800 rounded-xl p-8 sm:p-12 space-y-6">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-12 w-80" />
            <Skeleton className="h-5 w-full max-w-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-800/80">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
          </div>
        ) : activeTasting && (
          <div className="mb-20 bg-[#0e1017] border border-[#c5a059]/40 rounded-xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            {/* Top Toggle between Signature and Plant-Based */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-6 mb-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveMenuTab('autumn-terroir')}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-sans transition-all ${
                    activeMenuTab === 'autumn-terroir'
                      ? 'bg-[#c5a059] text-black font-semibold shadow-md'
                      : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-white'
                  }`}
                >
                  The Autumn Terroir
                </button>
                <button
                  onClick={() => setActiveMenuTab('foraged-harvest')}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-sans transition-all ${
                    activeMenuTab === 'foraged-harvest'
                      ? 'bg-[#c5a059] text-black font-semibold shadow-md'
                      : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-white'
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

            {/* Menu Header Details */}
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-[#c5a059] font-sans font-medium">
                Chef Patron Euan Macleod
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-light mt-1 mb-3">
                {activeTasting.title}
              </h2>
              <p className="text-stone-300 font-light text-sm sm:text-base leading-relaxed mb-4">
                {activeTasting.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-6 text-xs text-stone-400">
                <span className="flex items-center gap-1.5 text-[#c5a059]">
                  <Utensils className="w-3.5 h-3.5" />
                  {activeTasting.coursesCount} Courses • {formatCurrency(activeTasting.price)} per guest
                </span>
                <span className="flex items-center gap-1.5">
                  <Wine className="w-3.5 h-3.5 text-[#c5a059]" />
                  Sommelier Cellar Pairing: +{formatCurrency(activeTasting.pairingPrice)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                  {activeTasting.duration}
                </span>
              </div>
            </div>

            {/* Structured Course-by-Course Flow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-800/80">
              {activeTasting.courses.map((course) => (
                <div
                  key={course.number}
                  className="p-4 rounded-lg bg-[#141720]/80 border border-stone-800/60 hover:border-stone-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#c5a059] font-sans">
                      Course 0{course.number}
                    </span>
                    {course.gaelicTitle && (
                      <span className="text-[11px] font-serif italic text-stone-400">
                        {course.gaelicTitle}
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif text-base text-white mb-1.5">{course.title}</h4>
                  <p className="text-xs text-stone-400 font-light leading-relaxed mb-3">
                    {course.description}
                  </p>
                  <div className="text-[10px] text-stone-500 italic border-t border-stone-800/40 pt-2 flex items-center gap-1">
                    <Wine className="w-3 h-3 text-[#c5a059] shrink-0" />
                    <span>Pairing: {course.pairing}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explore All Dishes & Filters Section */}
        <div className="pt-8">
          <div className="mb-8">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#c5a059] font-sans font-medium">
              Culinary Index
            </span>
            <h3 className="font-serif text-3xl text-white font-light mt-1">
              Explore Individual Dishes & Ingredients
            </h3>
            <p className="text-xs text-stone-400 mt-1">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          ) : (
            /* Beautiful Empty State */
            <div className="text-center py-20 px-6 bg-[#0e1017] border border-stone-800/80 rounded-xl max-w-lg mx-auto">
              <Sparkles className="w-8 h-8 text-[#c5a059] mx-auto mb-4" />
              <h4 className="font-serif text-2xl text-white font-light mb-2">
                No Courses Matched Your Criteria
              </h4>
              <p className="text-xs text-stone-400 mb-6 font-light leading-relaxed">
                We could not find any seasonal dishes matching your search terms or dietary filters.
                Our cellar and kitchen can accommodate tailored requests upon booking.
              </p>
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
