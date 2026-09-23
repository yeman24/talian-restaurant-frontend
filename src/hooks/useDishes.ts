import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { IS_DEMO_MODE } from '@/lib/runtime'
import type {
  Dish,
  TastingMenu,
  Category,
  CreateDishPayload,
  UpdateDishPayload,
  CreateTastingMenuPayload,
  UpdateTastingMenuPayload,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  Review,
  GalleryItem,
  ReservationPayload,
  AvailabilityResponse,
  DashboardStats,
  ReservationStatus,
  ContactPayload,
  ContactInquiry,
  CellarItem,
} from '@/types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const loadMockData = () => import('@/data/mockData')

const normalizeDish = (item: any): Dish => ({
  ...item,
  category: typeof item.category === 'string' ? item.category : item.category?.slug || item.category?.name || '',
  categoryId: item.categoryId || (typeof item.category === 'object' ? item.category?.id : undefined),
  price: Number(item.price),
})

// 1. Dishes List Hook
export function useDishes(filters?: {
  category?: string
  search?: string
  dietary?: string
}) {
  return useQuery<Dish[]>({
    queryKey: ['dishes', filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      if (filters?.category && filters.category !== 'all') queryParams.append('category', filters.category)
      if (filters?.dietary && filters.dietary !== 'all') queryParams.append('dietary', filters.dietary)
      if (filters?.search && filters.search.trim()) queryParams.append('search', filters.search.trim())

      if (!IS_DEMO_MODE) {
        const res = await apiClient.get<any>(`/menu/dishes?${queryParams.toString()}`)
        const items = Array.isArray(res) ? res : res.data || []
        return items.map(normalizeDish)
      }

      const { DISHES } = await loadMockData()
      await delay(80)
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
      if (!IS_DEMO_MODE) return normalizeDish(await apiClient.get<any>(`/menu/dishes/${idOrSlug}`))
      const { DISHES } = await loadMockData()
      await delay(80)
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
      if (!IS_DEMO_MODE) return apiClient.get<TastingMenu[]>('/menu/tasting-menus')
      const { TASTING_MENUS } = await loadMockData()
      await delay(80)
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
      if (!IS_DEMO_MODE) return apiClient.get<Review[]>('/reviews')
      const { REVIEWS } = await loadMockData()
      await delay(80)
      return REVIEWS
    },
  })
}

// 5. Gallery Hook
export function useGallery(category?: string) {
  return useQuery<GalleryItem[]>({
    queryKey: ['gallery', category],
    queryFn: async () => {
      if (!IS_DEMO_MODE) {
        const url = category && category !== 'all' ? `/gallery?category=${category.toUpperCase()}` : '/gallery'
        const items = await apiClient.get<any[]>(url)
        return items.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category.toLowerCase(),
          image: item.imageUrl || item.image,
          caption: item.caption,
          aspect: item.aspect || 'square',
        }))
      }

      const { GALLERY_ITEMS } = await loadMockData()
      await delay(80)
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
      if (!IS_DEMO_MODE) {
        return apiClient.get<AvailabilityResponse>(
          `/reservations/availability?date=${encodeURIComponent(date)}&guests=${guests}`
        )
      }

      await delay(80)
      const dayOfWeek = new Date(date).getUTCDay()
      const isClosed = dayOfWeek === 1 || dayOfWeek === 2
      const isSunday = dayOfWeek === 0
      return {
          isAvailable: !isClosed,
          message: isClosed
            ? 'AURA is closed on Mondays & Tuesdays for Highland foraging and cellar curation.'
            : undefined,
          dinnerSlots: isClosed
            ? []
            : isSunday
            ? [
                { time: '17:00', status: 'Available', isAvailable: true },
                { time: '17:45', status: 'Available', isAvailable: true },
                { time: '18:30', status: 'Few tables left', isAvailable: true },
                { time: '19:15', status: 'Available', isAvailable: true },
                { time: '19:45', status: 'Available', isAvailable: true },
              ]
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
    },
    enabled: Boolean(date && guests > 0),
    placeholderData: (previousData) => previousData,
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
      policyAccepted: boolean
      idempotencyKey: string
    }) => {
      if (!IS_DEMO_MODE) {
        const { idempotencyKey, totalEstimate: _clientTotalEstimate, ...reservationPayload } = payload
        const result = await apiClient.post<any>('/reservations', {
          ...reservationPayload,
          service: payload.service?.toUpperCase(),
          seatingPreference: payload.seatingPreference?.replace('-', '_').toUpperCase(),
          policyAccepted: payload.policyAccepted,
        },
        { 'Idempotency-Key': idempotencyKey })
        return {
          ...result,
          service: String(result.service || payload.service || 'dinner').toLowerCase(),
          guests: result.guests ?? result.guestsCount,
          experience: result.experience ?? result.experienceName,
          seatingPreference: String(result.seatingPreference || payload.seatingPreference || 'dining-room').toLowerCase().replace('_', '-'),
          totalEstimate: Number(result.totalEstimate ?? payload.totalEstimate),
        } as ReservationPayload
      }

      await delay(120)
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
    mutationFn: async ({ reservationId, amount, email, idempotencyKey }: { reservationId: string; amount: number; email: string; idempotencyKey: string }) => {
      if (!IS_DEMO_MODE) {
        return apiClient.post<{ clientSecret: string; amount: number; currency: string }>(
          '/payments/create-intent',
          { reservationId, email },
          { 'Idempotency-Key': idempotencyKey },
        )
      }
      await delay(80)
      return { clientSecret: `mock_pi_${Date.now()}_secret`, amount, currency: 'GBP' }
    },
  })
}

// 9. Admin Dashboard Stats Hook
export function useAdminStats() {
  return useQuery<DashboardStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      if (!IS_DEMO_MODE) return apiClient.get<DashboardStats>('/admin/dashboard/stats')
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
    },
    refetchInterval: 1000 * 30, // 30s polling for executive dashboard
  })
}

// 10. Admin Reservations List Hook
export function useAdminReservations(status?: string, date?: string) {
  return useQuery<{ data: ReservationPayload[]; meta: any }>({
    queryKey: ['admin-reservations', status, date],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      if (status) queryParams.append('status', status)
      if (date) queryParams.append('date', date)
      if (!IS_DEMO_MODE) return apiClient.get<any>(`/reservations?${queryParams.toString()}`)
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
    },
  })
}

export function useAdminInquiries(status?: string) {
  return useQuery<{ data: ContactInquiry[]; meta: any }>({
    queryKey: ['admin-inquiries', status],
    queryFn: async () => {
      const query = status ? `?status=${encodeURIComponent(status)}` : ''
      return apiClient.get<{ data: ContactInquiry[]; meta: any }>(`/contact/inquiries${query}`)
    },
  })
}

export function useUpdateInquiryStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'IN_PROGRESS' | 'RESOLVED' }) =>
      apiClient.patch<ContactInquiry>(`/contact/inquiries/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })
}

export function useCellarItems() {
  return useQuery<CellarItem[]>({
    queryKey: ['cellar-items'],
    queryFn: () => apiClient.get<CellarItem[]>('/cellar/items'),
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
      if (!IS_DEMO_MODE) {
        const inquiryTypeMap = {
          general: 'GENERAL',
          'private-dining': 'PRIVATE_DINING',
          press: 'PRESS',
          'cellar-master': 'CELLAR_MASTER',
        } as const
        return apiClient.post('/contact/inquiries', {
          ...payload,
          inquiryType: inquiryTypeMap[payload.inquiryType as keyof typeof inquiryTypeMap] || payload.inquiryType,
        })
      }
      await delay(80)
      return { success: true, message: 'Your message has been received by the Maitre d’.' }
    },
  })
}

export function useSubmitNewsletter() {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      if (!IS_DEMO_MODE) return apiClient.post('/contact/newsletter', { email })
      await delay(80)
      return { success: true, email }
    },
  })
}

// 14. Course Categories Hooks & Mutations
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!IS_DEMO_MODE) {
        return apiClient.get<Category[]>('/categories')
      }
      return [
        { id: 'cat-1', name: 'Tasting Signature', slug: 'tasting', description: 'Sequential 8-course degustation courses', displayOrder: 1 },
        { id: 'cat-2', name: 'Highland & Coastal À La Carte', slug: 'alacarte', description: 'Individual seasonal dishes', displayOrder: 2 },
        { id: 'cat-3', name: 'Foraged & Plant-Based', slug: 'plant', description: 'Caledonian wild flora, ancient grains and roots', displayOrder: 3 },
      ]
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCategoryPayload) => apiClient.post<Category>('/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryPayload }) =>
      apiClient.patch<Category>(`/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['dishes'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['dishes'] })
    },
  })
}

// 15. Dish CRUD Mutations
export function useCreateDish() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDishPayload) => apiClient.post<Dish>('/menu/dishes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useUpdateDish() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDishPayload }) =>
      apiClient.patch<Dish>(`/menu/dishes/${id}`, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] })
      queryClient.invalidateQueries({ queryKey: ['dish', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useDeleteDish() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/menu/dishes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

// 16. Tasting Menu CRUD Mutations
export function useCreateTastingMenu() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTastingMenuPayload) => apiClient.post<TastingMenu>('/menu/tasting-menus', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasting-menus'] })
    },
  })
}

export function useUpdateTastingMenu() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTastingMenuPayload }) =>
      apiClient.patch<TastingMenu>(`/menu/tasting-menus/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasting-menus'] })
    },
  })
}

export function useDeleteTastingMenu() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/menu/tasting-menus/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasting-menus'] })
    },
  })
}

