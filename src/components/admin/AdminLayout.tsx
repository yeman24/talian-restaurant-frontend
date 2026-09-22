import React, { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { AdminProvider, useAdmin } from './AdminContext'
import { useAdminStats, useAdminReservations, useAdminInquiries, useCellarItems } from '@/hooks/useDishes'
import { useToast } from '@/context/ToastContext'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayoutInner: React.FC<AdminLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, isRefreshing, setIsRefreshing } =
    useAdmin()
  const { data: stats, refetch: refetchStats } = useAdminStats()
  const { refetch: refetchReservations } = useAdminReservations()
  const { refetch: refetchInquiries } = useAdminInquiries()
  const { refetch: refetchCellar } = useCellarItems()
  const { toast } = useToast()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([refetchStats(), refetchReservations(), refetchInquiries(), refetchCellar()])
      toast({
        title: 'Atelier Console Synchronized',
        message: 'Live operations metrics and reservations refreshed.',
        type: 'success',
      })
    } catch {
      toast({
        title: 'Sync Notice',
        message: 'Using offline cache records.',
        type: 'info',
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fcf5df] text-[#12141a] flex font-sans antialiased selection:bg-[#12141a] selection:text-[#fcf5df]">
      {/* Responsive Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        unreadInquiriesCount={stats?.metrics.unreadInquiriesCount ?? 0}
        todayCovers={stats?.metrics.todayCovers ?? 0}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AdminHeader
          activeTab={activeTab}
          onOpenMobile={() => setMobileOpen(true)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto pb-16">
          {children}
        </main>
      </div>
    </div>
  )
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  )
}
