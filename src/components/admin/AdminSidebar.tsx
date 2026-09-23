import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  Image as ImageIcon,
  Wine,
  Mail,
  ArrowUpRight,
  LogOut,
  X,
} from 'lucide-react'

export type AdminTab = 'overview' | 'reservations' | 'menu' | 'media' | 'cellar' | 'inquiries'

export const tabPaths: Record<AdminTab, string> = {
  overview: '/admin',
  reservations: '/admin/reservations',
  menu: '/admin/menu',
  media: '/admin/media',
  cellar: '/admin/cellar',
  inquiries: '/admin/inquiries',
}

export const pathToTab = (pathname: string): AdminTab => {
  if (pathname.startsWith('/admin/reservations')) return 'reservations'
  if (pathname.startsWith('/admin/menu')) return 'menu'
  if (pathname.startsWith('/admin/media')) return 'media'
  if (pathname.startsWith('/admin/cellar')) return 'cellar'
  if (pathname.startsWith('/admin/inquiries')) return 'inquiries'
  return 'overview'
}

interface AdminSidebarProps {
  activeTab: AdminTab
  onSelectTab: (tab: AdminTab) => void
  mobileOpen: boolean
  onCloseMobile: () => void
  unreadInquiriesCount?: number
  todayCovers?: number
}

interface NavItem {
  id: AdminTab
  label: string
  icon: React.ElementType
  badge?: string | number
  badgeVariant?: 'gold' | 'emerald' | 'subtle'
}

interface NavSection {
  title: string
  items: NavItem[]
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  unreadInquiriesCount = 3,
  todayCovers = 24,
}) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const sections: NavSection[] = [
    {
      title: 'Operations',
      items: [
        {
          id: 'overview',
          label: 'Executive Overview',
          icon: LayoutDashboard,
        },
        {
          id: 'reservations',
          label: 'Reservations & Sittings',
          icon: CalendarDays,
          badge: `${todayCovers} covers`,
          badgeVariant: 'emerald',
        },
      ],
    },
    {
      title: 'Culinary & Cellar',
      items: [
        {
          id: 'menu',
          label: 'Menu & Course Atelier',
          icon: UtensilsCrossed,
        },
        {
          id: 'media',
          label: 'Media Archive & Upload',
          icon: ImageIcon,
        },
        {
          id: 'cellar',
          label: 'Sommelier & Wine Cellar',
          icon: Wine,
        },
      ],
    },
    {
      title: 'Guest Relations',
      items: [
        {
          id: 'inquiries',
          label: 'VIP & Vault Inquiries',
          icon: Mail,
          badge: unreadInquiriesCount > 0 ? unreadInquiriesCount : undefined,
          badgeVariant: 'gold',
        },
      ],
    },
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#181b24] border-r border-[#262b38] select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#262b38]">
        <div className="flex items-center justify-between">
          <Link
            to="/admin"
            className="flex items-center gap-2.5 group focus:outline-none"
            onClick={() => onCloseMobile()}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#242938] to-[#181b24] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shadow-md shadow-[#c5a059]/10 group-hover:border-[#c5a059] transition-all">
              <span className="font-serif text-base font-light">✦</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl tracking-[0.2em] text-white uppercase font-medium">
                  A U R A
                </span>
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#c5a059] font-mono block font-medium">
                Atelier Console
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-stone-400 hover:text-white p-1 rounded-md hover:bg-[#242938] transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live status badge */}
        <div className="mt-4 flex items-center justify-between px-3 py-2 rounded-md bg-[#1e2330] border border-[#2b3345] text-xs">
          <div className="flex items-center gap-2 text-stone-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-stone-200 uppercase tracking-wider text-[11px]">Service Live</span>
          </div>
          <span className="text-stone-400 font-mono text-[11px]">2 Michelin ★</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-3 text-xs font-mono uppercase tracking-[0.2em] text-stone-400 font-medium">
              {section.title}
            </h3>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id

                return (
                  <Link
                    key={item.id}
                    to={tabPaths[item.id]}
                    onClick={() => {
                      onSelectTab(item.id)
                      onCloseMobile()
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-sans tracking-normal transition-all group relative ${
                      isActive
                        ? 'text-[#101217] bg-[#fcf5df] shadow-md font-semibold'
                        : 'text-stone-300 hover:text-[#fcf5df] hover:bg-[#232836] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4.5 h-4.5 transition-colors ${
                          isActive
                            ? 'text-[#101217]'
                            : 'text-stone-400 group-hover:text-[#c5a059]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-medium ${
                          isActive
                            ? 'bg-[#101217] text-[#fcf5df]'
                            : item.badgeVariant === 'emerald'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                            : item.badgeVariant === 'gold'
                            ? 'bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40'
                            : 'bg-[#282e3d] text-stone-300 border border-[#363e52]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <motion.div
                        layoutId="activeTabGlow"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#c5a059] rounded-r-full"
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer: Staff Identity & Actions */}
      <div className="p-4 border-t border-[#262b38] bg-[#13161f] space-y-3">
        {/* User Card */}
        {user && (
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#1e2330] border border-[#2b3345]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c5a059]/30 to-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/40 flex items-center justify-center text-sm font-bold font-mono shadow-inner">
              {user.firstName[0]}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-medium text-stone-100 truncate">
                {user.firstName} {user.lastName}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30 font-semibold">
                  {user.role}
                </span>
                <span className="text-xs text-stone-400 truncate">{user.email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to="/"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs text-stone-200 hover:text-white bg-[#1e2330] hover:bg-[#282f42] border border-[#2b3345] transition-colors"
            title="Open Patron Dining Experience"
          >
            <span>Patron Site</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs text-rose-300 hover:text-rose-200 bg-rose-950/30 hover:bg-rose-950/50 border border-rose-900/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
            />

            {/* Slide-over Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
