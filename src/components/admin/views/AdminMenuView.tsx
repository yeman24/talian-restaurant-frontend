import React, { useState } from 'react'
import {
  Search,
  CheckCircle2,
  Wine,
  Sparkles,
} from 'lucide-react'
import { useDishes } from '@/hooks/useDishes'
import { Skeleton } from '@/components/common/Skeleton'
import { formatCurrency } from '@/lib/utils'
import type { Dish } from '@/types'

export const AdminMenuView: React.FC = () => {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const { data: dishes, isLoading } = useDishes()

  const filteredDishes = (dishes || []).filter((dish: Dish) => {
    if (selectedCategory !== 'ALL' && dish.category !== selectedCategory.toLowerCase()) {
      return false
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        dish.name.toLowerCase().includes(q) ||
        dish.description?.toLowerCase().includes(q) ||
        dish.provenance?.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white border border-[#e2d7ba] rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl text-[#12141a] font-normal">Course & Menu Atelier</h3>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Active Scottish seasonal tasting dishes and Highland provenance registry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-stone-600 font-semibold">Total Courses:</span>
            <span className="px-2.5 py-1 rounded bg-[#fcf5df] border border-[#e2d7ba] text-[#12141a] font-mono font-bold text-xs">
              {dishes?.length ?? 0}
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#ede3c9]">
          <div className="w-full sm:w-80 relative">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search dishes, wild herbs, cuts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#12141a] placeholder-stone-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'TASTING', 'ALACARTE', 'PLANT'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#12141a] text-[#fcf5df] font-bold'
                    : 'bg-[#fcf5df] text-[#12141a] hover:bg-[#f3e6c6] border border-[#dcd2b7]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dishes Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish: Dish) => (
            <div
              key={dish.id}
              className="bg-white border border-[#e2d7ba] rounded-xl p-5 shadow-sm hover:border-[#12141a] transition-all flex flex-col justify-between text-[#12141a]"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-[#12141a] text-[#fcf5df] font-bold">
                      {dish.category}
                    </span>
                    <h4 className="font-serif text-lg text-[#12141a] font-medium mt-2">{dish.name}</h4>
                    {dish.gaelicName && (
                      <span className="text-[10px] text-stone-500 italic block">
                        {dish.gaelicName}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-sm text-[#12141a] font-bold">
                    {formatCurrency(dish.price)}
                  </span>
                </div>

                <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-3">
                  {dish.description}
                </p>

                {/* Provenance */}
                {dish.provenance && (
                  <div className="text-[10px] text-stone-600 font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#c5a059]" /> {dish.provenance}
                  </div>
                )}

                {/* Wine Pairing */}
                {dish.winePairing && (
                  <div className="text-[11px] text-[#12141a] font-sans flex items-center gap-1.5 p-2 rounded-lg bg-[#fcf5df] border border-[#e2d7ba]">
                    <Wine className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                    <span className="truncate font-medium">{dish.winePairing.name} ({dish.winePairing.vintage})</span>
                  </div>
                )}
              </div>

              {/* Footer Meta */}
              <div className="pt-4 mt-4 border-t border-[#ede3c9] flex items-center justify-between text-[10px] text-stone-500 font-mono">
                <span className="text-stone-600 font-medium">
                  Course {dish.courseNumber || 1} of 8
                </span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active Course
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
