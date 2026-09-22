import React from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MenuFiltersProps {
  category: string
  onCategoryChange: (cat: string) => void
  dietary: string
  onDietaryChange: (diet: string) => void
  search: string
  onSearchChange: (query: string) => void
  onReset: () => void
  hasActiveFilters: boolean
}

export const MenuFilters: React.FC<MenuFiltersProps> = ({
  category,
  onCategoryChange,
  dietary,
  onDietaryChange,
  search,
  onSearchChange,
  onReset,
  hasActiveFilters,
}) => {
  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'tasting', label: 'Tasting Signature' },
    { id: 'alacarte', label: 'À La Carte' },
    { id: 'plant', label: 'Foraged & Plant' },
  ]

  const dietaryOptions = [
    { id: 'all', label: 'All Diets' },
    { id: 'gluten-free', label: 'Gluten-Free' },
    { id: 'dairy-free', label: 'Dairy-Free' },
    { id: 'pescatarian', label: 'Pescatarian' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
  ]

  return (
    <div className="space-y-6 mb-12">
      {/* Top Search & Dietary Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c94a4] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search ingredients, provenance, Gaelic names..."
            className="w-full bg-white border border-[#e2d7ba] focus:border-[#12141a] rounded-lg pl-10 pr-10 py-2.5 text-xs text-[#12141a] placeholder-[#8c94a4] focus:outline-none transition-colors shadow-sm"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c94a4] hover:text-[#12141a] p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dietary Filter Select */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8c94a4] pointer-events-none" />
            <select
              value={dietary}
              onChange={(e) => onDietaryChange(e.target.value)}
              className="bg-white border border-[#e2d7ba] text-xs text-[#12141a] rounded-lg pl-9 pr-8 py-2.5 focus:border-[#12141a] focus:outline-none appearance-none cursor-pointer shadow-sm"
            >
              {dietaryOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-white text-[#12141a]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-xs text-[#12141a] font-semibold hover:underline flex items-center gap-1 px-2.5 py-2 font-sans"
            >
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#e2d7ba]">
        {categories.map((cat) => {
          const isActive = category === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                'whitespace-nowrap px-4 py-2.5 text-xs uppercase tracking-[0.2em] font-sans rounded-full transition-all duration-300',
                isActive
                  ? 'bg-[#12141a] text-[#fcf5df] font-bold shadow-sm'
                  : 'text-[#12141a]/80 hover:text-[#12141a] bg-white border border-[#e2d7ba] hover:border-[#12141a]/40'
              )}
            >
              {cat.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
