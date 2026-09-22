import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  Search,
  RefreshCw,
  ArrowUpRight,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import type { AdminTab } from './AdminSidebar'

interface AdminHeaderProps {
  activeTab: AdminTab
  onOpenMobile: () => void
  onRefresh: () => void
  isRefreshing?: boolean
  searchQuery: string
  onSearchChange: (q: string) => void
}

const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
  overview: {
    title: 'Operations Dashboard',
    subtitle: 'Real-time table covers, seating velocity, and revenue analytics',
  },
  reservations: {
    title: 'Reservations & Sittings',
    subtitle: 'Guest manifests, seating transitions, and dietary specifications',
  },
  menu: {
    title: 'Course & Menu Atelier',
    subtitle: 'Tasting sequences, Scottish provenance, and sommelier pairings',
  },
  media: {
    title: 'Cloudinary Media Atelier',
    subtitle: 'Culinary plating, vault ambiance, and cellar visual archive',
  },
  cellar: {
    title: 'Sommelier & Cellar Master',
    subtitle: 'Grand Cru allocations, vintage inventory, and pairing programs',
  },
  inquiries: {
    title: 'VIP & Vault Inquiries',
    subtitle: 'Private dining salon, cellar bookings, and sommelier requests',
  },
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onOpenMobile,
  onRefresh,
  isRefreshing = false,
  searchQuery,
  onSearchChange,
}) => {
  const [timeString, setTimeString] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeString(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Europe/London',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const currentMeta = tabTitles[activeTab] || tabTitles.overview

  return (
    <header className="sticky top-0 z-20 bg-[#fcf5df]/90 backdrop-blur-md border-b border-[#e2d7ba] px-4 sm:px-8 py-3.5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobile}
            className="lg:hidden p-2 rounded-lg text-[#12141a] hover:bg-[#f2e7c9] transition-colors focus:outline-none"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-stone-600">
              <span>AURA Atelier</span>
              <ChevronRight className="w-3 h-3 text-stone-400" />
              <span className="text-[#12141a] font-bold">{currentMeta.title}</span>
            </div>
            <h1 className="text-base sm:text-lg font-serif text-[#12141a] font-medium tracking-wide mt-0.5 hidden sm:block">
              {currentMeta.title}
            </h1>
          </div>
        </div>

        {/* Center: Quick Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search reservations, guests, codes, dishes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white border border-[#dcd2b7] focus:border-[#12141a] rounded-lg pl-9 pr-8 py-1.5 text-xs text-[#12141a] placeholder-stone-500 focus:outline-none transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-500 hover:text-stone-800 font-mono"
              >
                ESC
              </button>
            )}
          </div>
        </div>

        {/* Right Actions: Clock, Refresh, Patron Site Link */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Edinburgh Time */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f5ecce] border border-[#e2d7ba] text-[11px] font-mono text-[#12141a]">
            <Clock className="w-3.5 h-3.5 text-[#12141a]" />
            <span>{timeString || '19:45:00'} GMT</span>
            <span className="text-stone-400">•</span>
            <span className="text-emerald-700 font-sans text-[10px] font-semibold uppercase tracking-wider">
              Dinner Service
            </span>
          </div>

          {/* Refresh Action */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            isLoading={isRefreshing}
            className="text-xs border-[#dcd2b7] hover:border-[#12141a] text-[#12141a] hover:bg-[#f5ecce] px-3 py-1.5 bg-white shadow-sm"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
            title="Refresh metrics from backend"
          >
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          {/* Patron Site Link */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#fcf5df] bg-[#12141a] hover:bg-[#222633] border border-[#12141a] shadow-sm transition-colors"
            title="Open Patron Site in new view"
          >
            <span>Patron Site</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#fcf5df]" />
          </Link>
        </div>
      </div>
    </header>
  )
}
