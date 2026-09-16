import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DISHES, TASTING_MENUS, REVIEWS, GALLERY_ITEMS } from '@/data/mockData'
import { apiClient } from '@/lib/api-client'
import type {
  Dish,
  TastingMenu,
  Review,
  GalleryItem,
  ReservationPayload,
  AvailabilityResponse,
  DashboardStats,
  ReservationStatus,
  ContactPayload,
} from '@/types'

// Realistic delay for mock fallback
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 1. Dishes List Hook
export function useDishes(filters?: {
  category?: string
  search?: string
  dietary?: string
}) {
  return useQuery<Dish[]>({
    queryKey: ['dishes', filters],
    queryFn: async () => {
      try {
        const queryParams = new URLSearchParams()
        if (filters?.category && filters.category !== 'all') {
          queryParams.append('category', filters.category)
        }
        if (filters?.dietary && filters.dietary !== 'all') {
          queryParams.append('dietary', filters.dietary)
        }
        if (filters?.search && filters.search.trim()) {
          queryParams.append('search', filters.search.trim())
        }

        const res = await apiClient.get<any>(`/menu/dishes?${queryParams.toString()}`)
        const list = res.data || res
        if (Array.isArray(list) && list.length > 0) {
          return list
        }
      } catch {
        // Fall back to local mock data
      }

      await delay(200)
      let list = [...DISHES]

      if (filters?.category && filters.category !== 'all') {
        list = list.filter((item) => item.category === filters.category)
      }

      if (filters?.dietary && filters.dietary !== 'all') {
        list = list.filter((item) =>
          item.dietary.includes(filters.dietary as any)
        )
      }

      if (filters?.search && filters.search.trim()) {
        const q = filters.search.toLowerCase()
        list = list.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.provenance.toLowerCase().includes(q) ||
            (item.gaelicName && item.gaelicName.toLowerCase().includes(q))
        )
      }

      return list
    },
    staleTime: 1000 * 60 * 5,
  })
}

// 2. Single Dish Hook
export function useDish(idOrSlug: string | undefined) {
  return useQuery<Dish | undefined>({
    queryKey: ['dish', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return undefined
      try {
        const dish = await apiClient.get<Dish>(`/menu/dishes/${idOrSlug}`)
        if (dish) return dish
      } catch {
        // Fall back
      }

      await delay(150)
      return DISHES.find((d) => d.id === idOrSlug || d.slug === idOrSlug)
    },
    enabled: Boolean(idOrSlug),
  })
}

// 3. Tasting Menus Hook
export function useTastingMenus() {
  return useQuery<TastingMenu[]>({
    queryKey: ['tasting-menus'],
    queryFn: async () => {
      try {
        const menus = await apiClient.get<TastingMenu[]>('/menu/tasting-menus')
        if (Array.isArray(menus) && menus.length > 0) return menus
      } catch {
        // Fall back
      }

      await delay(150)
      return TASTING_MENUS
    },
    staleTime: 1000 * 60 * 10,
  })
}

// 4. Reviews Hook
export function useReviews() {
  return useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: async () => {
      try {
        const reviews = await apiClient.get<Review[]>('/reviews')
        if (Array.isArray(reviews) && reviews.length > 0) return reviews
      } catch {
        // Fall back
      }

      await delay(150)
      return REVIEWS
    },
  })
}

// 5. Gallery Hook
export function useGallery(category?: string) {
  return useQuery<GalleryItem[]>({
    queryKey: ['gallery', category],
    queryFn: async () => {
      try {
        const url = category && category !== 'all' ? `/gallery?category=${category.toUpperCase()}` : '/gallery'
        const items = await apiClient.get<any[]>(url)
        if (Array.isArray(items) && items.length > 0) {
          return items.map((item) => ({
            id: item.id,
            title: item.title,
            category: item.category.toLowerCase(),
            image: item.imageUrl || item.image,
            caption: item.caption,
            aspect: item.aspect || 'square',
          }))
        }
      } catch {
        // Fall back
      }

      await delay(200)
      if (!category || category === 'all') return GALLERY_ITEMS
      return GALLERY_ITEMS.filter((item) => item.category === category)
    },
  })
}

// 6. Live Availability Checking Hook
export function useAvailability(date: string, guests: number) {
  return useQuery<AvailabilityResponse>({
    queryKey: ['availability', date, guests],
    queryFn: async () => {
      try {
        return await apiClient.get<AvailabilityResponse>(
          `/reservations/availability?date=${date}&guests=${guests}`
        )
      } catch {
        // Fall back calculation
        const dayOfWeek = new Date(date).getUTCDay()
        const isClosed = dayOfWeek === 1 || dayOfWeek === 2
        return {
          isAvailable: !isClosed,
          message: isClosed
            ? 'AURA is closed on Mondays and Tuesdays for Highland foraging and cellar curation.'
            : undefined,
          dinnerSlots: isClosed
            ? []
            : [
                { time: '17:30', status: 'Available', isAvailable: true },
                { time: '18:15', status: 'Few tables left', isAvailable: true },
                { time: '19:00', status: 'Available', isAvailable: true },
                { time: '19:45', status: 'Available', isAvailable: true },
                { time: '20:30', status: 'Available', isAvailable: true },
              ],
          lunchSlots:
            dayOfWeek === 5 || dayOfWeek === 6
              ? [
                  { time: '12:00', status: 'Available', isAvailable: true },
                  { time: '12:45', status: 'Available', isAvailable: true },
                  { time: '13:15', status: 'Few tables left', isAvailable: true },
                ]
              : [],
        }
      }
    },
    enabled: Boolean(date && guests > 0),
  })
}

// 7. Create Reservation Mutation
export function useCreateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      date: string
      timeSlot: string
      service?: string
      guestsCount: number
      experienceName: string
      pairingTier?: string
      seatingPreference?: string
      fullName: string
      email: string
      phone: string
      dietaryNotes?: string
      specialOccasion?: string
      totalEstimate: number
    }) => {
      try {
        const res = await apiClient.post<ReservationPayload>('/reservations', payload)
        if (res && res.confirmationCode) return res
      } catch {
        // Fall back to local simulation
      }

      await delay(600)
      const code = `AURA-${Math.floor(100000 + Math.random() * 900000)}`
      const fallbackRes: ReservationPayload = {
        confirmationCode: code,
        date: payload.date,
        timeSlot: payload.timeSlot,
        service: (payload.service as any) || 'dinner',
        guests: payload.guestsCount,
        experience: payload.experienceName,
        pairingTier: payload.pairingTier,
        seatingPreference: (payload.seatingPreference as any) || 'dining-room',
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        dietaryNotes: payload.dietaryNotes,
        specialOccasion: payload.specialOccasion,
        totalEstimate: payload.totalEstimate,
        createdAt: new Date().toISOString(),
      }

      const existing = JSON.parse(localStorage.getItem('aura_reservations') || '[]')
      existing.unshift(fallbackRes)
      localStorage.setItem('aura_reservations', JSON.stringify(existing))

      return fallbackRes
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })
}

// 8. Stripe Payment Intent Mutation
export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: async ({ reservationId, amount }: { reservationId: string; amount: number }) => {
      try {
        return await apiClient.post<{ clientSecret: string; amount: number; currency: string }>(
          '/payments/create-intent',
          { reservationId, amount }
        )
      } catch {
        // Mock fallback
        return {
          clientSecret: `mock_pi_${Date.now()}_secret`,
          amount,
          currency: 'GBP',
        }
      }
    },
  })
}

// 9. Admin Dashboard Stats Hook
export function useAdminStats() {
  return useQuery<DashboardStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        return await apiClient.get<DashboardStats>('/admin/dashboard/stats')
      } catch {
        // Fallback demo metrics
        return {
          metrics: {
            totalReservationsCount: 142,
            todayCovers: 24,
            todayOccupancyPercent: 86,
            monthEstimatedRevenue: 28450,
            unreadInquiriesCount: 3,
            totalUsersCount: 88,
            totalDishesCount: 12,
          },
          experienceDistribution: {
            'The Autumn Terroir (8 Courses)': 78,
            'The Forager’s Harvest (Plant-Based)': 34,
            'Chef’s Atelier Counter (10 Courses)': 30,
          },
          recentBookings: [],
        }
      }
    },
    refetchInterval: 1000 * 30, // 30s polling for executive dashboard
  })
}

// 10. Admin Reservations List Hook
export function useAdminReservations(status?: string, date?: string) {
  return useQuery<{ data: ReservationPayload[]; meta: any }>({
    queryKey: ['admin-reservations', status, date],
    queryFn: async () => {
      try {
        const queryParams = new URLSearchParams()
        if (status) queryParams.append('status', status)
        if (date) queryParams.append('date', date)
        return await apiClient.get<any>(`/reservations?${queryParams.toString()}`)
      } catch {
        // Fallback demo reservations
        return {
          data: [
            {
              id: 'res-1',
              confirmationCode: 'AURA-839102',
              date: new Date().toISOString().split('T')[0],
              timeSlot: '19:00',
              service: 'dinner',
              guestsCount: 2,
              experienceName: 'The Autumn Terroir (8 Courses)',
              seatingPreference: 'dining-room',
              fullName: 'Lord Alistair Sterling',
              email: 'sterling@highland.co.uk',
              phone: '+44 7911 001122',
              status: 'CONFIRMED',
              totalEstimate: 580,
            },
            {
              id: 'res-2',
              confirmationCode: 'AURA-518290',
              date: new Date().toISOString().split('T')[0],
              timeSlot: '19:45',
              service: 'dinner',
              guestsCount: 4,
              experienceName: 'Chef’s Atelier Counter (10 Courses)',
              seatingPreference: 'chefs-counter',
              fullName: 'Dr. Evelyn Sinclair',
              email: 'evelyn.s@oxford.ac.uk',
              phone: '+44 7922 445566',
              status: 'SEATED',
              totalEstimate: 1260,
            },
            {
              id: 'res-3',
              confirmationCode: 'AURA-992341',
              date: new Date().toISOString().split('T')[0],
              timeSlot: '20:30',
              service: 'dinner',
              guestsCount: 2,
              experienceName: 'The Forager’s Harvest (Plant-Based)',
              seatingPreference: 'vault-alcove',
              fullName: 'Marcus & Clara Thorne',
              email: 'thorne@edinburgh.org',
              phone: '+44 7933 778899',
              status: 'CONFIRMED',
              totalEstimate: 440,
            },
          ],
          meta: { total: 3, page: 1, limit: 20 },
        }
      }
    },
  })
}

// 11. Optimistic Update Reservation Status Mutation
export function useUpdateReservationStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReservationStatus }) => {
      return await apiClient.patch<ReservationPayload>(`/reservations/${id}/status`, { status })
    },
    // Optimistic Update
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['admin-reservations'] })

      // Snapshot previous value
      const previousData = queryClient.getQueryData(['admin-reservations'])

      // Optimistically update to the new status
      queryClient.setQueriesData({ queryKey: ['admin-reservations'] }, (old: any) => {
        if (!old || !old.data) return old
        return {
          ...old,
          data: old.data.map((res: ReservationPayload) =>
            res.id === id ? { ...res, status } : res
          ),
        }
      })

      return { previousData }
    },
    onError: (_err, _variables, context: any) => {
      // Rollback cache if mutation fails
      if (context?.previousData) {
        queryClient.setQueryData(['admin-reservations'], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })
}

// 12. Upload Gallery Image Mutation (Cloudinary)
export function useUploadGalleryImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      file,
      title,
      category,
      caption,
    }: {
      file: File
      title: string
      category: string
      caption?: string
    }) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('category', category.toUpperCase())
      if (caption) formData.append('caption', caption)

      return await apiClient.upload<GalleryItem>('/gallery/upload', formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
    },
  })
}

// 13. Submit Contact Message Mutation
export function useSubmitContact() {
  return useMutation({
    mutationFn: async (payload: ContactPayload) => {
      try {
        return await apiClient.post('/contact', payload)
      } catch {
        await delay(500)
        return { success: true, message: 'Your message has been received by the Maitre d’.' }
      }
    },
  })
}
