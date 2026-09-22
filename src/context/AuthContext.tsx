import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiClient, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/api-client'
import type { UserProfile, AuthResponse } from '@/types'
import { useToast } from '@/context/ToastContext'

interface AuthContextValue {
  user: UserProfile | null
  accessToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isStaff: boolean
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  login: (email: string, password: string) => Promise<void>
  registerUser: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const { toast } = useToast()

  // Verify session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const profile = await apiClient.get<UserProfile>('/auth/me')
        setUser(profile)
        localStorage.setItem('aura_user_profile', JSON.stringify(profile))
      } catch {
        apiClient.clearTokens()
        localStorage.removeItem('aura_user_profile')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await apiClient.post<AuthResponse>('/auth/login', { email, password })
      localStorage.setItem('aura_user_profile', JSON.stringify(res.user))
      if (res.accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken)
        setAccessToken(res.accessToken)
      }
      if (res.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken)
      }
      setUser(res.user)
      setIsAuthModalOpen(false)

      toast({
        title: `Welcome, ${res.user.firstName}`,
        message: res.user.role !== 'CUSTOMER' ? `Authenticated as ${res.user.role} staff.` : 'Signed into your personal dining account.',
        type: 'success',
      })
    } catch (err: any) {
      toast({
        title: 'Authentication Failed',
        message: err.message || 'Invalid email or password.',
        type: 'error',
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const registerUser = useCallback(async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) => {
    setIsLoading(true)
    try {
      const res = await apiClient.post<AuthResponse>('/auth/register', data)
      localStorage.setItem('aura_user_profile', JSON.stringify(res.user))
      if (res.accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken)
        setAccessToken(res.accessToken)
      }
      if (res.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken)
      }
      setUser(res.user)
      setIsAuthModalOpen(false)

      toast({
        title: 'Welcome to AURA',
        message: `Your patron dining account (${res.user.email}) has been activated.`,
        type: 'success',
      })
    } catch (err: any) {
      toast({
        title: 'Registration Error',
        message: err.message || 'Could not register account.',
        type: 'error',
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout', {}).catch(() => null)
    } finally {
      apiClient.clearTokens()
      localStorage.removeItem('aura_user_profile')
      setAccessToken(null)
      setUser(null)
      toast({
        title: 'Signed Out',
        message: 'You have been safely disconnected from your session.',
        type: 'info',
      })
    }
  }, [toast])


  const isAuthenticated = Boolean(user)
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const isStaff = isAdmin || user?.role === 'SOMMELIER' || user?.role === 'STAFF'

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated,
        isAdmin,
        isStaff,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
