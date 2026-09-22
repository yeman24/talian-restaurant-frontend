import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/common/ScrollToTop'
import { Skeleton } from '@/components/common/Skeleton'
import { AuthModal } from '@/components/auth/AuthModal'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { AIConcierge } from '@/components/concierge/AIConcierge'
import { AdminLoginPage } from '@/pages/AdminLoginPage'

// Lazy loaded page components for optimal production performance
const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const loadMenuPage = () => import('@/pages/MenuPage')
const MenuPage = lazy(() => loadMenuPage().then((m) => ({ default: m.MenuPage })))
const DishDetailPage = lazy(() =>
  import('@/pages/DishDetailPage').then((m) => ({ default: m.DishDetailPage }))
)
const AboutPage = lazy(() => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const GalleryPage = lazy(() =>
  import('@/pages/GalleryPage').then((m) => ({ default: m.GalleryPage }))
)
const ReservationsPage = lazy(() =>
  import('@/pages/ReservationsPage').then((m) => ({ default: m.ReservationsPage }))
)
const ContactPage = lazy(() =>
  import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage }))
)
const AdminPage = lazy(() =>
  import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage }))
)
const AdminLayout = lazy(() =>
  import('@/components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout }))
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
)

const PageFallback = () => (
  <div
    className="mx-auto max-w-7xl px-6 pb-20 pt-36"
    aria-busy="true"
    aria-label="Loading page"
  >
    <div className="mx-auto max-w-5xl space-y-4">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-12 w-full max-w-2xl" />
      <Skeleton className="h-4 w-full max-w-xl" />
    </div>
  </div>
)

export function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'AURA Edinburgh | Contemporary Scottish Fine Dining',
      '/menu': 'Tasting Menus | AURA Edinburgh',
      '/about': 'Our Story & Terroir | AURA Edinburgh',
      '/gallery': 'The Gallery | AURA Edinburgh',
      '/reservations': 'Reserve an Experience | AURA Edinburgh',
      '/contact': 'Contact & Location | AURA Edinburgh',
      '/admin/login': 'Staff Login | AURA Edinburgh',
    }
    document.title = titles[location.pathname] || (location.pathname.startsWith('/menu/') ? 'Dish Detail | AURA Edinburgh' : 'AURA Edinburgh')
  }, [location.pathname])

  return (
    <div
      className="min-h-screen bg-[#fcf5df] text-[#12141a] flex flex-col justify-between selection:bg-[#12141a] selection:text-[#fcf5df]"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-[#12141a] focus:px-4 focus:py-3 focus:text-sm focus:text-[#fcf5df]"
      >
        Skip to main content
      </a>
      <ScrollToTop />
      {!isAdminRoute && <AuthModal />}
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <AIConcierge />}

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/menu/:id" element={<DishDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SOMMELIER', 'STAFF']}>
                  <AdminLayout>
                    <AdminPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  )
}
