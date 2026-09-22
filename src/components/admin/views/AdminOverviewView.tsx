import React from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  TrendingUp,
  Calendar,
  Mail,
  Sparkles,
  Utensils,
  ArrowRight,
  Wine,
} from 'lucide-react'
import { Skeleton } from '@/components/common/Skeleton'
import { Badge } from '@/components/common/Badge'
import { formatCurrency } from '@/lib/utils'
import type { DashboardStats, ReservationPayload, ReservationStatus } from '@/types'
import type { AdminTab } from '../AdminSidebar'

interface AdminOverviewViewProps {
  stats?: DashboardStats
  isLoading: boolean
  reservations: ReservationPayload[]
  onStatusChange: (id: string, status: ReservationStatus) => void
  onNavigateTab: (tab: AdminTab) => void
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({
  stats,
  isLoading,
  reservations,
  onStatusChange,
  onNavigateTab,
}) => {
  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'SEATED':
        return 'accent'
      case 'CONFIRMED':
        return 'gold'
      case 'PENDING':
        return 'subtle'
      case 'COMPLETED':
        return 'subtle'
      case 'CANCELLED':
        return 'outline'
      default:
        return 'subtle'
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Banner: Service Announcement (20% Dark Focal Element) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#12141a] text-[#fcf5df] border border-[#262c3a] p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-mono font-bold">
                Dinner Service Operations
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-mono">Kitchen Synchronized</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal tracking-wide">
              Tonight’s 8-Course Harvest Service
            </h2>
            <p className="text-xs text-stone-300 font-light mt-1.5 leading-relaxed">
              28 maximum guest covers across Royal Terrace Vaults & the Chef’s Counter. Kitchen brigade
              under Chef Patron Euan Macleod: <span className="text-emerald-400 font-semibold">Active Prep Nominal</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('reservations')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#fcf5df] hover:bg-white text-[#12141a] text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              <span>Manage Sittings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('cellar')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1e2330] hover:bg-[#282f40] border border-stone-700 text-stone-200 text-xs font-medium transition-colors"
            >
              <Wine className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Cellar Master</span>
            </button>
          </div>
        </div>

        {/* Subtle background luxury radial */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid (Crisp 80% Parchment Surfaces) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Covers */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 sm:p-6 rounded-xl bg-white border border-[#e2d7ba] shadow-sm relative"
        >
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-[11px] uppercase tracking-wider font-mono font-semibold">Tonight's Sittings</span>
            <div className="w-8 h-8 rounded-lg bg-[#fcf5df] border border-[#e2d7ba] flex items-center justify-center text-[#12141a]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl sm:text-4xl text-[#12141a] font-light">
                  {stats?.metrics.todayCovers ?? 0}
                </span>
                <span className="text-xs text-stone-500 font-mono">/ 28 Max Capacity</span>
              </div>
              <div className="mt-3 w-full bg-[#ede4cb] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#12141a] h-full rounded-full transition-all duration-700"
                  style={{ width: `${stats?.metrics.todayOccupancyPercent ?? 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-stone-600 mt-2 font-mono">
                <span>{stats?.metrics.todayOccupancyPercent ?? 0}% Seat Occupancy</span>
                <span className="text-emerald-700 font-semibold">{Math.max(0, 28 - (stats?.metrics.todayCovers ?? 0))} Remaining</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Metric 2: Estimated Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="p-5 sm:p-6 rounded-xl bg-white border border-[#e2d7ba] shadow-sm"
        >
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-[11px] uppercase tracking-wider font-mono font-semibold">Month Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-[#fcf5df] border border-[#e2d7ba] flex items-center justify-center text-[#12141a]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div>
              <span className="font-serif text-3xl sm:text-4xl text-[#12141a] font-light block">
                {formatCurrency(stats?.metrics.monthEstimatedRevenue ?? 0)}
              </span>
              <span className="text-[10px] text-emerald-700 mt-2.5 inline-flex items-center gap-1 font-mono font-medium">
                <Sparkles className="w-3 h-3 text-[#c5a059]" /> +18% vs prior harvest cycle
              </span>
            </div>
          )}
        </motion.div>

        {/* Metric 3: Total Reservations */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="p-5 sm:p-6 rounded-xl bg-white border border-[#e2d7ba] shadow-sm"
        >
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-[11px] uppercase tracking-wider font-mono font-semibold">Active Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-[#fcf5df] border border-[#e2d7ba] flex items-center justify-center text-[#12141a]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div>
              <span className="font-serif text-3xl sm:text-4xl text-[#12141a] font-light block">
                {stats?.metrics.totalReservationsCount ?? 0}
              </span>
              <span className="text-[10px] text-stone-500 mt-2 block font-mono">
                Across 8-Course Tasting & Counter
              </span>
            </div>
          )}
        </motion.div>

        {/* Metric 4: VIP Inquiries */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="p-5 sm:p-6 rounded-xl bg-white border border-[#e2d7ba] shadow-sm cursor-pointer hover:border-[#12141a] transition-colors"
          onClick={() => onNavigateTab('inquiries')}
        >
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-[11px] uppercase tracking-wider font-mono font-semibold">VIP Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-[#fcf5df] border border-[#e2d7ba] flex items-center justify-center text-[#12141a]">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl sm:text-4xl text-[#12141a] font-light">
                  {stats?.metrics.unreadInquiriesCount ?? 0}
                </span>
                <span className="text-xs text-amber-700 font-mono font-medium">Pending Review</span>
              </div>
              <span className="text-[10px] text-stone-600 mt-2 block font-sans">
                Private Vault & Cellar Master requests
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Operations Split Grid: Service Timeline & Experience Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recent Reservations Manifest (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#e2d7ba] rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#e2d7ba] pb-4">
            <div>
              <h3 className="font-serif text-2xl text-[#12141a] font-normal">Today’s Sitting Manifest</h3>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                Immediate seating status transitions and guest party details.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('reservations')}
              className="text-xs text-[#12141a] hover:text-[#c5a059] flex items-center gap-1 font-mono uppercase tracking-wider font-semibold"
            >
              <span>View Full Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Table */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#12141a]">
                <thead>
                  <tr className="border-b border-[#e2d7ba] text-stone-500 uppercase tracking-widest text-[10px] font-mono">
                    <th className="pb-3">Guest & Code</th>
                    <th className="pb-3">Sitting</th>
                    <th className="pb-3">Party</th>
                    <th className="pb-3">Experience</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Quick Transition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee5ce]">
                  {reservations.slice(0, 5).map((res) => (
                    <tr key={res.id || res.confirmationCode} className="hover:bg-[#fcf5df]/60 transition-colors">
                      <td className="py-3.5 pr-3">
                        <span className="font-mono text-[#12141a] block font-bold text-[11px]">
                          {res.confirmationCode}
                        </span>
                        <span className="text-[#12141a] font-medium block">{res.fullName}</span>
                      </td>
                      <td className="py-3.5 pr-3 whitespace-nowrap">
                        <span className="font-semibold text-[#12141a] block">{res.timeSlot}</span>
                        <span className="text-[10px] text-stone-500 capitalize">{res.service}</span>
                      </td>
                      <td className="py-3.5 pr-3 whitespace-nowrap">
                        <span className="text-[#12141a] font-medium">{res.guestsCount ?? res.guests ?? 2}</span>{' '}
                        <span className="text-[10px] text-stone-500">guests</span>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className="text-stone-700 block line-clamp-1 text-[11px]">
                          {res.experienceName || res.experience}
                        </span>
                        <span className="text-[10px] text-[#12141a] font-mono font-bold">
                          {formatCurrency(res.totalEstimate)}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(res.status)}>
                          {res.status || 'CONFIRMED'}
                        </Badge>
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <select
                          value={res.status || 'CONFIRMED'}
                          onChange={(e) =>
                            onStatusChange(res.id || '', e.target.value as ReservationStatus)
                          }
                          className="bg-[#fcf5df] border border-[#dcd2b7] text-[11px] rounded-md px-2.5 py-1 text-[#12141a] focus:border-[#12141a] focus:outline-none cursor-pointer font-medium"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SEATED">SEATED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Tasting Experience Breakdown & System Integrity (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Experience Distribution Card */}
          <div className="bg-white border border-[#e2d7ba] rounded-xl p-6 shadow-sm space-y-4">
            <div className="border-b border-[#e2d7ba] pb-3 flex items-center justify-between">
              <h3 className="font-serif text-lg text-[#12141a] font-normal">Experience Demand</h3>
              <Utensils className="w-4 h-4 text-[#12141a]" />
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs text-[#12141a] mb-1 font-medium">
                  <span>The Autumn Terroir (8 Courses)</span>
                  <span className="font-mono text-[#12141a]">55%</span>
                </div>
                <div className="w-full bg-[#ede4cb] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#12141a] h-full rounded-full" style={{ width: '55%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-[#12141a] mb-1 font-medium">
                  <span>The Forager’s Harvest (Plant-Based)</span>
                  <span className="font-mono text-emerald-800">24%</span>
                </div>
                <div className="w-full bg-[#ede4cb] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-700 h-full rounded-full" style={{ width: '24%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-[#12141a] mb-1 font-medium">
                  <span>Chef’s Atelier Counter (10 Courses)</span>
                  <span className="font-mono text-[#c5a059]">21%</span>
                </div>
                <div className="w-full bg-[#ede4cb] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#c5a059] h-full rounded-full" style={{ width: '21%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Sommelier & System Status */}
          <div className="bg-white border border-[#e2d7ba] rounded-xl p-6 shadow-sm space-y-4">
            <div className="border-b border-[#e2d7ba] pb-3 flex items-center justify-between">
              <h3 className="font-serif text-lg text-[#12141a] font-normal">Cellar & Vault Telemetry</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#fcf5df] border border-[#e2d7ba]">
                <span className="text-[10px] uppercase font-mono text-stone-500 block font-semibold">Cellar Temp</span>
                <span className="text-base font-serif text-[#12141a] font-bold mt-1 block">12.4°C</span>
                <span className="text-[10px] text-emerald-800 font-mono font-medium">Optimal Cru</span>
              </div>
              <div className="p-3 rounded-lg bg-[#fcf5df] border border-[#e2d7ba]">
                <span className="text-[10px] uppercase font-mono text-stone-500 block font-semibold">Humidity</span>
                <span className="text-base font-serif text-[#12141a] font-bold mt-1 block">68.5%</span>
                <span className="text-[10px] text-emerald-800 font-mono font-medium">Cork Preserved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
