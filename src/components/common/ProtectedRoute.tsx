import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/common/Button'
import { ShieldAlert, Lock } from 'lucide-react'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { user, isAuthenticated, isLoading, openAuthModal } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 text-stone-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#c5a059]" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 pt-32">
        <div className="w-14 h-14 rounded-full bg-[#181b24] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-3xl text-white font-light mb-2">
          Authentication Required
        </h2>
        <p className="text-xs text-stone-400 max-w-sm mb-6 leading-relaxed">
          This portal requires active dining staff or administrator credentials. Please sign in to
          continue.
        </p>
        <Button variant="gold" size="md" onClick={openAuthModal}>
          Sign In to Portal
        </Button>
      </div>
    )
  }

  if (requiredRoles && requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 pt-32">
        <div className="w-14 h-14 rounded-full bg-rose-950/40 border border-rose-800/60 flex items-center justify-center text-rose-400 mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-3xl text-white font-light mb-2">Access Restricted</h2>
        <p className="text-xs text-stone-400 max-w-sm mb-6 leading-relaxed">
          Your account role (<span className="text-white font-mono">{user.role}</span>) does not have
          privileges to view this management section.
        </p>
        <Navigate to="/" replace />
      </div>
    )
  }

  return <>{children}</>
}
