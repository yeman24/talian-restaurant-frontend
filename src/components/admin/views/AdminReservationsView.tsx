import React, { useState, useMemo } from 'react'
import {
  CalendarDays,
  Users,
  Search,
  Filter,
  Phone,
  Mail,
} from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { Skeleton } from '@/components/common/Skeleton'
import { formatCurrency } from '@/lib/utils'
import type { ReservationPayload, ReservationStatus } from '@/types'

interface AdminReservationsViewProps {
  reservations: ReservationPayload[]
  isLoading: boolean
  onStatusChange: (id: string, newStatus: ReservationStatus) => void
  searchQuery: string
  onSearchChange: (q: string) => void
}

export const AdminReservationsView: React.FC<AdminReservationsViewProps> = ({
  reservations,
  isLoading,
  onStatusChange,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [selectedService, setSelectedService] = useState<string>('ALL')

  // Filter reservations based on status, service, and search query
  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      // Status filter
      if (selectedStatus !== 'ALL' && res.status !== selectedStatus) {
        return false
      }
      // Service filter
      if (selectedService !== 'ALL' && res.service?.toLowerCase() !== selectedService.toLowerCase()) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchName = res.fullName?.toLowerCase().includes(query)
        const matchCode = res.confirmationCode?.toLowerCase().includes(query)
        const matchPhone = res.phone?.toLowerCase().includes(query)
        const matchEmail = res.email?.toLowerCase().includes(query)
        const matchExperience = res.experienceName?.toLowerCase().includes(query)
        return matchName || matchCode || matchPhone || matchEmail || matchExperience
      }
      return true
    })
  }, [reservations, selectedStatus, selectedService, searchQuery])

  // Aggregate stats from filtered list
  const totalCovers = useMemo(() => {
    return filteredReservations.reduce((acc, curr) => acc + (curr.guestsCount || 0), 0)
  }, [filteredReservations])

  const totalRevenue = useMemo(() => {
    return filteredReservations.reduce((acc, curr) => acc + (Number(curr.totalEstimate) || 0), 0)
  }, [filteredReservations])

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
    <div className="space-y-6">
      {/* Control Bar: Filters & Summary */}
      <div className="bg-white border border-[#e2d7ba] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 mr-1 flex items-center gap-1 font-semibold">
              <Filter className="w-3 h-3 text-[#12141a]" /> Status:
            </span>
            {['ALL', 'PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all ${
                  selectedStatus === st
                    ? 'bg-[#12141a] text-[#fcf5df] font-semibold shadow-sm'
                    : 'bg-[#fcf5df] text-[#12141a] hover:bg-[#f3e6c6] border border-[#dcd2b7]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1 rounded-md bg-[#fcf5df] border border-[#e2d7ba] text-[#12141a]">
              <span className="text-stone-500 mr-1.5">Bookings:</span>
              <strong className="text-[#12141a]">{filteredReservations.length}</strong>
            </div>
            <div className="px-3 py-1 rounded-md bg-[#fcf5df] border border-[#e2d7ba] text-[#12141a]">
              <span className="text-stone-500 mr-1.5">Covers:</span>
              <strong className="text-[#12141a]">{totalCovers} guests</strong>
            </div>
            <div className="px-3 py-1 rounded-md bg-[#fcf5df] border border-[#e2d7ba] text-[#12141a] hidden sm:block">
              <span className="text-stone-500 mr-1.5">Est. Value:</span>
              <strong className="text-emerald-800">{formatCurrency(totalRevenue)}</strong>
            </div>
          </div>
        </div>

        {/* Search & Service Filter Sub-bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#ede3c9]">
          <div className="w-full sm:w-80 relative">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by guest, phone, or code..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#12141a] placeholder-stone-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
              Service:
            </span>
            {['ALL', 'dinner', 'lunch'].map((srv) => (
              <button
                key={srv}
                onClick={() => setSelectedService(srv)}
                className={`px-2.5 py-1 rounded text-[10px] uppercase font-mono transition-colors ${
                  selectedService === srv
                    ? 'bg-[#12141a] text-[#fcf5df] font-semibold'
                    : 'bg-[#fcf5df] text-[#12141a] hover:bg-[#f3e6c6] border border-[#dcd2b7]'
                }`}
              >
                {srv}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white border border-[#e2d7ba] rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="py-16 px-6 text-center text-stone-500 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#fcf5df] border border-[#e2d7ba] flex items-center justify-center text-[#12141a] mx-auto">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg text-[#12141a] font-normal">No Reservations Found</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No bookings matched your filter parameters. Try clearing your search query or selecting ALL
              statuses.
            </p>
            <button
              onClick={() => {
                setSelectedStatus('ALL')
                setSelectedService('ALL')
                onSearchChange('')
              }}
              className="text-xs text-[#12141a] hover:underline font-mono uppercase tracking-wider font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#12141a]">
              <thead>
                <tr className="bg-[#f8f1d8] border-b border-[#e2d7ba] text-stone-700 uppercase tracking-widest text-[10px] font-mono">
                  <th className="py-3.5 px-4 font-semibold">Confirmation / Guest</th>
                  <th className="py-3.5 px-4 font-semibold">Service & Sitting</th>
                  <th className="py-3.5 px-4 font-semibold">Party Size</th>
                  <th className="py-3.5 px-4 font-semibold">Tasting Experience</th>
                  <th className="py-3.5 px-4 font-semibold">Table Preference</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Transition Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee5ce]">
                {filteredReservations.map((res) => (
                  <tr
                    key={res.id || res.confirmationCode}
                    className="hover:bg-[#fcf5df]/60 transition-colors"
                  >
                    {/* Guest Name & Code */}
                    <td className="py-4 px-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-[#12141a] font-bold text-xs">
                          {res.confirmationCode}
                        </span>
                      </div>
                      <span className="text-[#12141a] font-semibold text-xs block mt-0.5">
                        {res.fullName}
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500 font-mono">
                        {res.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-2.5 h-2.5" /> {res.phone}
                          </span>
                        )}
                        {res.email && (
                          <span className="flex items-center gap-1 truncate max-w-[140px]" title={res.email}>
                            <Mail className="w-2.5 h-2.5" /> {res.email}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Service & Time */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono text-[#12141a] block text-xs font-bold">
                        {res.timeSlot}
                      </span>
                      <span className="text-[10px] text-stone-500 capitalize block font-medium">
                        {res.service} • {res.date}
                      </span>
                    </td>

                    {/* Party Size */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#12141a]" />
                        <span className="font-bold text-[#12141a] text-xs">{res.guestsCount ?? res.guests ?? 2}</span>
                        <span className="text-[10px] text-stone-500">guests</span>
                      </div>
                    </td>

                    {/* Tasting Experience */}
                    <td className="py-4 px-4">
                      <span className="text-stone-800 block text-xs font-medium line-clamp-1">
                        {res.experienceName || res.experience}
                      </span>
                      <span className="text-[11px] text-[#12141a] font-mono font-bold block mt-0.5">
                        {formatCurrency(res.totalEstimate)}
                      </span>
                    </td>

                    {/* Seating Preference */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#fcf5df] border border-[#e2d7ba] text-stone-700 capitalize font-medium">
                        {res.seatingPreference?.replace('-', ' ') || 'Dining Room'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(res.status)}>
                        {res.status || 'CONFIRMED'}
                      </Badge>
                    </td>

                    {/* Status Select Action */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <select
                        value={res.status || 'CONFIRMED'}
                        onChange={(e) =>
                          onStatusChange(res.id || '', e.target.value as ReservationStatus)
                        }
                        className="bg-[#fcf5df] border border-[#dcd2b7] text-xs rounded-md px-2.5 py-1.5 text-[#12141a] focus:border-[#12141a] focus:outline-none cursor-pointer hover:border-stone-500 transition-colors font-mono font-semibold"
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
    </div>
  )
}
