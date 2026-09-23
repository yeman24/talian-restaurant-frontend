import React from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcf5df] flex items-center justify-center text-[#12141a]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#12141a]" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (requiredRoles && requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-[#fcf5df] flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 mb-4 shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl text-[#12141a] font-normal mb-2">Access Restricted</h2>
        <p className="text-xs text-[#5e6576] font-sans max-w-sm mb-6 leading-relaxed">
          Your current account role (<span className="text-[#12141a] font-mono font-medium">{user.role}</span>) does not have
          privileges to access the AURA Executive Operations Console.
        </p>
        <div className="flex items-center gap-3 font-sans">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs text-[#12141a] hover:bg-[#fcf5df] border border-[#e2d7ba] bg-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Restaurant</span>
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 rounded text-xs text-rose-700 hover:bg-rose-100 border border-rose-300 bg-rose-50 transition-colors cursor-pointer"
          >
            Switch Account
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
