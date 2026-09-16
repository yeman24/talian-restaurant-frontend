import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import {
  useAdminStats,
  useAdminReservations,
  useUpdateReservationStatus,
  useUploadGalleryImage,
} from '@/hooks/useDishes'
import { Button } from '@/components/common/Button'
import { Skeleton } from '@/components/common/Skeleton'
import { Badge } from '@/components/common/Badge'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/context/ToastContext'
import {
  Users,
  TrendingUp,
  Calendar,
  UploadCloud,
  Mail,
  Sparkles,
  LogOut,
  RefreshCw,
} from 'lucide-react'
import type { ReservationStatus } from '@/types'

export const AdminPage: React.FC = () => {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL')

  // Queries
  const { data: stats, isLoading: isStatsLoading, refetch: refetchStats } = useAdminStats()
  const {
    data: reservationsData,
    isLoading: isReservationsLoading,
    refetch: refetchReservations,
  } = useAdminReservations(selectedStatusFilter === 'ALL' ? undefined : selectedStatusFilter)

  // Mutations
  const updateStatusMutation = useUpdateReservationStatus()
  const uploadImageMutation = useUploadGalleryImage()

  // Gallery Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadCategory, setUploadCategory] = useState('CULINARY')
  const [uploadCaption, setUploadCaption] = useState('')

  const handleStatusChange = async (id: string, newStatus: ReservationStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus })
      toast({
        title: 'Status Updated (Optimistic)',
        message: `Reservation status transitioned to ${newStatus}.`,
        type: 'success',
      })
    } catch {
      toast({
        title: 'Status Update Reverted',
        message: 'Unable to synchronize status with server.',
        type: 'error',
      })
    }
  }

  const handleGalleryUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile || !uploadTitle) {
      toast({
        title: 'Missing Details',
        message: 'Please provide both an image file and a title.',
        type: 'error',
      })
      return
    }

    try {
      await uploadImageMutation.mutateAsync({
        file: uploadFile,
        title: uploadTitle,
        category: uploadCategory,
        caption: uploadCaption,
      })
      toast({
        title: 'Media Uploaded to Cloudinary',
        message: `"${uploadTitle}" has been added to the restaurant gallery.`,
        type: 'success',
      })
      setUploadFile(null)
      setUploadTitle('')
      setUploadCaption('')
    } catch (err: any) {
      toast({
        title: 'Upload Failed',
        message: err.message || 'Could not complete Cloudinary media upload.',
        type: 'error',
      })
    }
  }

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'SEATED':
        return 'accent'
      case 'CONFIRMED':
        return 'gold'
      case 'COMPLETED':
        return 'subtle'
      case 'CANCELLED':
        return 'outline'
      default:
        return 'subtle'
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-12">
      {/* Executive Portal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-sans font-medium">
              AURA Atelier • Executive Administration
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-light">
            Operations & Cellar Dashboard
          </h1>
          <p className="text-xs text-stone-400 font-light mt-1">
            Logged in as <span className="text-white font-medium">{user?.firstName} {user?.lastName}</span> ({user?.role})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchStats()
              refetchReservations()
              toast({ title: 'Data Synchronized', message: 'Metrics refreshed from NestJS backend.' })
            }}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={logout}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Covers */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-[#0e1017] border border-stone-800/80 shadow-xl"
        >
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs uppercase tracking-wider font-sans">Tonight's Sittings</span>
            <Users className="w-4 h-4 text-[#c5a059]" />
          </div>
          {isStatsLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl text-white font-light">
                  {stats?.metrics.todayCovers || 24}
                </span>
                <span className="text-xs text-stone-500">/ 28 Capacity</span>
              </div>
              <div className="mt-3 w-full bg-stone-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#c5a059] h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats?.metrics.todayOccupancyPercent || 86}%` }}
                />
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">
                {stats?.metrics.todayOccupancyPercent || 86}% Seat Occupancy
              </span>
            </div>
          )}
        </motion.div>

        {/* Card 2: Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl bg-[#0e1017] border border-stone-800/80 shadow-xl"
        >
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs uppercase tracking-wider font-sans">Month Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#c5a059]" />
          </div>
          {isStatsLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div>
              <span className="font-serif text-3xl text-[#f5eed8] font-light block">
                {formatCurrency(stats?.metrics.monthEstimatedRevenue || 28450)}
              </span>
              <span className="text-[10px] text-emerald-400 mt-2 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> +18% vs prior harvest season
              </span>
            </div>
          )}
        </motion.div>

        {/* Card 3: Total Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl bg-[#0e1017] border border-stone-800/80 shadow-xl"
        >
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs uppercase tracking-wider font-sans">Total Reservations</span>
            <Calendar className="w-4 h-4 text-[#c5a059]" />
          </div>
          {isStatsLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div>
              <span className="font-serif text-3xl text-white font-light block">
                {stats?.metrics.totalReservationsCount || 142}
              </span>
              <span className="text-[10px] text-stone-500 mt-2 block">
                Across 8-Course Tasting & Counter
              </span>
            </div>
          )}
        </motion.div>

        {/* Card 4: Inquiries */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-[#0e1017] border border-stone-800/80 shadow-xl"
        >
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs uppercase tracking-wider font-sans">Unread Inquiries</span>
            <Mail className="w-4 h-4 text-[#c5a059]" />
          </div>
          {isStatsLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div>
              <span className="font-serif text-3xl text-white font-light block">
                {stats?.metrics.unreadInquiriesCount || 3}
              </span>
              <span className="text-[10px] text-[#c5a059] mt-2 block">
                Private Vault & Cellar Master inquiries
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Main Operations Grid: Reservations Management & Media Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Reservations Table (8 Cols) */}
        <div className="lg:col-span-8 bg-[#0e1017] border border-stone-800 rounded-xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <h2 className="font-serif text-2xl text-white font-light">Table Reservations</h2>
              <p className="text-xs text-stone-400 font-light mt-0.5">
                Manage seating transitions with instantaneous optimistic cache updates.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['ALL', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatusFilter(st)}
                  className={`px-3 py-1 rounded text-[10px] uppercase tracking-wider font-sans transition-colors ${
                    selectedStatusFilter === st
                      ? 'bg-[#c5a059] text-black font-semibold'
                      : 'bg-[#141720] text-stone-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {isReservationsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-500 uppercase tracking-widest text-[10px]">
                    <th className="pb-3 font-medium">Code / Guest</th>
                    <th className="pb-3 font-medium">Sitting</th>
                    <th className="pb-3 font-medium">Party</th>
                    <th className="pb-3 font-medium">Experience</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {reservationsData?.data.map((res: any) => (
                    <tr key={res.id || res.confirmationCode} className="hover:bg-white/[0.02]">
                      <td className="py-4 pr-3">
                        <span className="font-mono text-[#c5a059] block font-semibold">
                          {res.confirmationCode}
                        </span>
                        <span className="text-white font-medium block">{res.fullName}</span>
                        <span className="text-[10px] text-stone-500">{res.phone}</span>
                      </td>
                      <td className="py-4 pr-3 whitespace-nowrap">
                        <span className="font-medium text-stone-200 block">{res.timeSlot}</span>
                        <span className="text-[10px] text-stone-500 capitalize">{res.service}</span>
                      </td>
                      <td className="py-4 pr-3 whitespace-nowrap">
                        <span className="font-medium text-white">{res.guestsCount || res.guests}</span>{' '}
                        <span className="text-[10px] text-stone-500">guests</span>
                      </td>
                      <td className="py-4 pr-3">
                        <span className="text-stone-300 block line-clamp-1">
                          {res.experienceName || res.experience}
                        </span>
                        <span className="text-[10px] text-[#c5a059]">
                          {formatCurrency(res.totalEstimate)}
                        </span>
                      </td>
                      <td className="py-4 pr-3 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(res.status)}>
                          {res.status || 'CONFIRMED'}
                        </Badge>
                      </td>
                      <td className="py-4 text-right whitespace-nowrap">
                        <select
                          value={res.status || 'CONFIRMED'}
                          onChange={(e) =>
                            handleStatusChange(res.id, e.target.value as ReservationStatus)
                          }
                          className="bg-[#141722] border border-stone-700 text-[11px] rounded px-2 py-1 text-stone-200 focus:border-[#c5a059] focus:outline-none cursor-pointer"
                        >
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

        {/* Cloudinary Gallery Uploader (4 Cols) */}
        <div className="lg:col-span-4 bg-[#0e1017] border border-stone-800 rounded-xl p-6 shadow-2xl space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a059] font-medium font-sans">
              Cloudinary Media Atelier
            </span>
            <h3 className="font-serif text-xl text-white font-light mt-1">
              Upload Gallery Asset
            </h3>
            <p className="text-xs text-stone-400 font-light mt-0.5">
              Adds new culinary plating or ambiance imagery directly to the visual archive.
            </p>
          </div>

          <form onSubmit={handleGalleryUpload} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                Image File *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-stone-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#c5a059] file:text-black file:font-semibold hover:file:bg-[#d4af55] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Autumn Venison Plating"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                Gallery Category
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="CULINARY">Plated Artistry (Culinary)</option>
                <option value="AMBIANCE">Dining Room & Vaults</option>
                <option value="CELLAR">Sommelier Cellar</option>
                <option value="KITCHEN">Kitchen Atelier & Forage</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                Caption
              </label>
              <textarea
                rows={2}
                placeholder="Evocative description of course or setting..."
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                className="w-full bg-[#141720] border border-stone-800 focus:border-[#c5a059] rounded px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="sm"
              isLoading={uploadImageMutation.isPending}
              leftIcon={<UploadCloud className="w-4 h-4" />}
              className="w-full justify-center text-xs"
            >
              Upload to Cloudinary
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
