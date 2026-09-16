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
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search ingredients, provenance, Gaelic names..."
            className="w-full bg-[#101319] border border-stone-800 focus:border-[#c5a059] rounded-md pl-10 pr-10 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dietary Filter Select */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500 pointer-events-none" />
            <select
              value={dietary}
              onChange={(e) => onDietaryChange(e.target.value)}
              className="bg-[#101319] border border-stone-800 text-xs text-stone-200 rounded-md pl-9 pr-8 py-2.5 focus:border-[#c5a059] focus:outline-none appearance-none cursor-pointer"
            >
              {dietaryOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-[#101319] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-xs text-[#c5a059] hover:underline flex items-center gap-1 px-2.5 py-2"
            >
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-800/60">
        {categories.map((cat) => {
          const isActive = category === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                'whitespace-nowrap px-4 py-2.5 text-xs uppercase tracking-[0.2em] font-sans rounded-full transition-all duration-300',
                isActive
                  ? 'bg-[#c5a059] text-black font-semibold shadow-md shadow-[#c5a059]/20'
                  : 'text-stone-400 hover:text-white bg-[#101319]/80 border border-stone-800 hover:border-stone-700'
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
