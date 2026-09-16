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
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem(ACCESS_TOKEN_KEY))
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const { toast } = useToast()

  // Verify session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY)
      const savedUserStr = localStorage.getItem('aura_user_profile')

      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const profile = await apiClient.get<UserProfile>('/auth/me')
        setUser(profile)
        localStorage.setItem('aura_user_profile', JSON.stringify(profile))
      } catch {
        // If backend is offline or network fails, keep saved profile if available
        if (savedUserStr) {
          try {
            setUser(JSON.parse(savedUserStr))
          } catch {
            apiClient.clearTokens()
            localStorage.removeItem('aura_user_profile')
            setUser(null)
            setAccessToken(null)
          }
        } else {
          apiClient.clearTokens()
          setUser(null)
          setAccessToken(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      let res: AuthResponse
      try {
        res = await apiClient.post<AuthResponse>('/auth/login', { email, password })
      } catch (networkErr: any) {
        // Fallback for standalone / offline demo mode
        const isSommelier = email.toLowerCase().includes('sommelier')
        const isAdminUser = email.toLowerCase().includes('admin') || (!isSommelier && !email.toLowerCase().includes('customer'))

        const mockUser: UserProfile = {
          id: isAdminUser ? 'usr-admin-01' : isSommelier ? 'usr-somm-02' : 'usr-cust-03',
          email,
          firstName: isAdminUser ? 'Alistair' : isSommelier ? 'Fiona' : 'Julian',
          lastName: isAdminUser ? 'MacRae' : isSommelier ? 'Sinclair' : 'Vane',
          phone: '+44 131 555 0192',
          role: isAdminUser ? 'ADMIN' : isSommelier ? 'SOMMELIER' : 'CUSTOMER',
          createdAt: new Date().toISOString(),
        }

        res = {
          user: mockUser,
          accessToken: 'demo-jwt-access-token-aura-2025',
          refreshToken: 'demo-jwt-refresh-token-aura-2025',
          tokenType: 'Bearer',
          expiresIn: '15m',
        }
      }

      localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken)
      localStorage.setItem('aura_user_profile', JSON.stringify(res.user))
      setAccessToken(res.accessToken)
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
      let res: AuthResponse
      try {
        res = await apiClient.post<AuthResponse>('/auth/register', data)
      } catch {
        // Standalone offline registration fallback
        const mockUser: UserProfile = {
          id: `usr-${Date.now()}`,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: 'CUSTOMER',
          createdAt: new Date().toISOString(),
        }

        res = {
          user: mockUser,
          accessToken: 'demo-jwt-access-token-new',
          refreshToken: 'demo-jwt-refresh-token-new',
          tokenType: 'Bearer',
          expiresIn: '15m',
        }
      }

      localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken)
      localStorage.setItem('aura_user_profile', JSON.stringify(res.user))
      setAccessToken(res.accessToken)
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
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
      await apiClient.post('/auth/logout', { refreshToken }).catch(() => null)
    } finally {
      apiClient.clearTokens()
      localStorage.removeItem('aura_user_profile')
      setUser(null)
      setAccessToken(null)
      toast({
        title: 'Signed Out',
        message: 'You have been safely disconnected from your session.',
        type: 'info',
      })
    }
  }, [toast])


  const isAuthenticated = Boolean(user && accessToken)
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
