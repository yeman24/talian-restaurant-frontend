export type CourseCategory = 'tasting' | 'alacarte' | 'plant' | 'cellar'

export type DietaryTag = 'gluten-free' | 'dairy-free' | 'pescatarian' | 'vegan' | 'vegetarian' | 'nut-free'

export type UserRole = 'ADMIN' | 'MANAGER' | 'SOMMELIER' | 'STAFF' | 'CUSTOMER'

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  isActive?: boolean
  createdAt?: string
}

export interface AuthTokens {
  accessToken?: string
  refreshToken?: string
  tokenType?: string
  expiresIn?: string
}

export interface AuthResponse extends AuthTokens {
  user: UserProfile
}

export interface WinePairing {
  name: string
  producer: string
  vintage: string
  region: string
  notes: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  displayOrder: number
  createdAt?: string
  updatedAt?: string
  _count?: {
    dishes: number
  }
}

export interface Dish {
  id: string
  slug?: string
  name: string
  gaelicName?: string
  category: CourseCategory | string
  categoryId?: string
  courseNumber?: number
  description: string
  story: string
  provenance: string
  price: number
  winePairing: WinePairing
  dietary: DietaryTag[]
  allergens: string[]
  image: string
  isChefRecommendation?: boolean
  isSignature?: boolean
}

export interface CreateDishPayload {
  name: string
  gaelicName?: string
  categoryId: string
  courseNumber?: number
  description: string
  story: string
  provenance: string
  price: number
  image: string
  isSignature?: boolean
  isChefRecommendation?: boolean
  winePairing?: WinePairing | null
  dietary?: DietaryTag[]
  allergens?: string[]
}

export type UpdateDishPayload = Partial<CreateDishPayload>

export interface TastingMenu {
  id: string
  slug?: string
  title: string
  subtitle: string
  description: string
  price: number
  pairingPrice: number
  prestigePairingPrice: number
  coursesCount: number
  duration: string
  isActive?: boolean
  courses: {
    number: number
    title: string
    gaelicTitle?: string
    description: string
    dishId?: string
    pairing: string
  }[]
}

export interface CreateTastingMenuPayload {
  title: string
  slug?: string
  subtitle: string
  description: string
  price: number
  pairingPrice: number
  prestigePairingPrice?: number
  coursesCount: number
  duration?: string
  isActive?: boolean
  courses: {
    number: number
    title: string
    gaelicTitle?: string
    description: string
    dishId?: string
    pairing: string
  }[]
}

export type UpdateTastingMenuPayload = Partial<CreateTastingMenuPayload>

export interface CreateCategoryPayload {
  name: string
  slug?: string
  description?: string
  displayOrder?: number
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>

export interface GalleryItem {
  id: string
  title: string
  category: 'culinary' | 'ambiance' | 'cellar' | 'kitchen' | 'CULINARY' | 'AMBIANCE' | 'CELLAR' | 'KITCHEN'
  image: string
  imageUrl?: string
  caption?: string
  aspect?: 'tall' | 'wide' | 'square'
}

export interface Review {
  id: string
  publication: string
  author: string
  quote: string
  year: string
  rating: string
  badge?: string
}

export interface ReservationPayload {
  id?: string
  confirmationCode: string
  date: string
  timeSlot: string
  service: 'lunch' | 'dinner' | 'LUNCH' | 'DINNER'
  guests?: number
  guestsCount?: number
  experience?: string
  experienceName?: string
  pairing?: 'none' | 'sommelier' | 'prestige' | 'non-alcoholic'
  pairingTier?: string
  seatingPreference: 'dining-room' | 'chefs-counter' | 'vault-alcove' | 'DINING_ROOM' | 'CHEFS_COUNTER' | 'VAULT_ALCOVE'
  fullName: string
  email: string
  phone: string
  dietaryNotes?: string
  specialOccasion?: string
  totalEstimate: number
  depositAmount?: number
  status?: ReservationStatus
  createdAt?: string
}

export interface AvailabilitySlot {
  time: string
  status: string
  isAvailable: boolean
}

export interface AvailabilityResponse {
  isAvailable: boolean
  message?: string
  dinnerSlots: AvailabilitySlot[]
  lunchSlots: AvailabilitySlot[]
}

export interface DashboardStats {
  metrics: {
    totalReservationsCount: number
    todayCovers: number
    todayOccupancyPercent: number
    monthEstimatedRevenue: number
    unreadInquiriesCount: number
    totalUsersCount: number
    totalDishesCount: number
  }
  experienceDistribution: Record<string, number>
  recentBookings: ReservationPayload[]
}

export interface ContactPayload {
  name: string
  email: string
  phone?: string
  inquiryType: 'general' | 'private-dining' | 'press' | 'cellar-master' | 'GENERAL' | 'PRIVATE_DINING' | 'CELLAR_MASTER' | 'PRESS'
  guestsCount?: number
  preferredDate?: string
  message: string
}

export type InquiryStatus = 'UNREAD' | 'IN_PROGRESS' | 'RESOLVED'

export interface ContactInquiry {
  id: string
  name: string
  email: string
  phone?: string
  inquiryType: 'GENERAL' | 'PRIVATE_DINING' | 'CELLAR_MASTER' | 'PRESS'
  status: InquiryStatus
  preferredDate?: string
  guestsCount?: number
  message: string
  replyNotes?: string
  createdAt: string
}

export interface CellarItem {
  id: string
  name: string
  vintage?: string
  region?: string
  stockBottles: number
  pairingWith?: string
  allocationStatus?: string
  temperatureZone?: string
  updatedAt: string
}
