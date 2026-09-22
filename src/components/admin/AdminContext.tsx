import React, { createContext, useContext, useState } from 'react'
import type { AdminTab } from './AdminSidebar'

interface AdminContextValue {
  activeTab: AdminTab
  setActiveTab: (tab: AdminTab) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  isRefreshing: boolean
  setIsRefreshing: (refreshing: boolean) => void
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined)

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        isRefreshing,
        setIsRefreshing,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
