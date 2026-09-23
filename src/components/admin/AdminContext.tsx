import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { pathToTab, tabPaths } from './AdminSidebar'
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
  const location = useLocation()
  const navigate = useNavigate()
  const currentTab = pathToTab(location.pathname)
  const [activeTab, setActiveTabState] = useState<AdminTab>(currentTab)
  const [searchQuery, setSearchQuery] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const tab = pathToTab(location.pathname)
    setActiveTabState(tab)
  }, [location.pathname])

  const setActiveTab = (tab: AdminTab) => {
    setActiveTabState(tab)
    const targetPath = tabPaths[tab]
    if (location.pathname !== targetPath) {
      navigate(targetPath)
    }
  }

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
