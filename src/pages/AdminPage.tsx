import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from '@/components/admin/AdminContext'
import {
  useAdminStats,
  useAdminReservations,
  useUpdateReservationStatus,
} from '@/hooks/useDishes'
import { useToast } from '@/context/ToastContext'
import { AdminOverviewView } from '@/components/admin/views/AdminOverviewView'
import { AdminReservationsView } from '@/components/admin/views/AdminReservationsView'
import { AdminMediaView } from '@/components/admin/views/AdminMediaView'
import { AdminMenuView } from '@/components/admin/views/AdminMenuView'
import { AdminCellarView } from '@/components/admin/views/AdminCellarView'
import { AdminInquiriesView } from '@/components/admin/views/AdminInquiriesView'
import type { ReservationStatus } from '@/types'

export const AdminPage: React.FC = () => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery } = useAdmin()
  const { toast } = useToast()

  // Queries
  const { data: stats, isLoading: isStatsLoading } = useAdminStats()
  const { data: reservationsData, isLoading: isReservationsLoading } = useAdminReservations()

  // Status Mutation
  const updateStatusMutation = useUpdateReservationStatus()

  const handleStatusChange = async (id: string, newStatus: ReservationStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus })
      toast({
        title: 'Status Updated',
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

  const reservations = reservationsData?.data || []

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="w-full"
      >
        {activeTab === 'overview' && (
          <AdminOverviewView
            stats={stats}
            isLoading={isStatsLoading}
            reservations={reservations}
            onStatusChange={handleStatusChange}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'reservations' && (
          <AdminReservationsView
            reservations={reservations}
            isLoading={isReservationsLoading}
            onStatusChange={handleStatusChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {activeTab === 'menu' && <AdminMenuView />}

        {activeTab === 'media' && <AdminMediaView />}

        {activeTab === 'cellar' && <AdminCellarView />}

        {activeTab === 'inquiries' && <AdminInquiriesView />}
      </motion.div>
    </AnimatePresence>
  )
}
