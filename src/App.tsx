import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/common/ScrollToTop'
import { Skeleton } from '@/components/common/Skeleton'
import { AuthModal } from '@/components/auth/AuthModal'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { AIConcierge } from '@/components/concierge/AIConcierge'

// Lazy loaded page components for optimal production performance
const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const MenuPage = lazy(() => import('@/pages/MenuPage').then((m) => ({ default: m.MenuPage })))
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
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
)

const PageFallback = () => (
  <div className="min-h-screen pt-36 px-6 max-w-5xl mx-auto space-y-6">
    <Skeleton className="h-12 w-64 mx-auto" />
    <Skeleton className="h-6 w-96 mx-auto" />
    <Skeleton className="h-96 w-full rounded-xl" />
  </div>
)

export function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#08090c] text-[#e3e1dc] flex flex-col justify-between selection:bg-[#c5a059] selection:text-black">
      <ScrollToTop />
      <AuthModal />
      <Navbar />
      <AIConcierge />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <Suspense fallback={<PageFallback />}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/menu/:id" element={<DishDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/reservations" element={<ReservationsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SOMMELIER', 'STAFF']}>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
