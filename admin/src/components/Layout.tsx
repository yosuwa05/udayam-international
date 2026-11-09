import {
  ChevronLeft,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  MapIcon,
  MessageSquare,
  TicketPercent,
  CalendarCheck,
  Users,
  Sparkles,
  Tag,
  Globe,
  ShieldCheck,
  Activity,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { _axios } from '@/lib/axios'

interface NavLink {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  adminOnly?: boolean
}

const allLinks: NavLink[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  {
    name: 'Standard Bookings',
    href: '/bookings/standard',
    icon: CalendarCheck,
  },
  { name: 'Customized Bookings', href: '/bookings/customized', icon: Sparkles },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Tourism', href: '/tourism', icon: MapIcon },
  { name: 'Testimonials', href: '/testimonials', icon: MessageSquare },
  { name: 'Coupons', href: '/coupons', icon: TicketPercent },
  { name: 'Trip Types', href: '/trip-types', icon: Tag },
  { name: 'Regions', href: '/regions', icon: Globe },
  { name: 'Staff Management', href: '/staff', icon: ShieldCheck, adminOnly: true },
  { name: 'Activity Logs', href: '/staff-logs', icon: Activity, adminOnly: true },
]

interface LayoutProps {
  session?: any
  userType?: 'admin' | 'staff' | null
}

const HEADER_H = 56
const SIDEBAR_FULL = 250
const SIDEBAR_ICON = 64

export default function Layout({ session, userType }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLarge, setIsLarge] = useState(true)
  const [activeMenu, setActiveMenu] = useState('/')
  const [links, setLinks] = useState<NavLink[]>(allLinks)

  /* route guard and menu filtering for staff and admin */
  useEffect(() => {
    if (userType === 'staff') {
      const permissions = session?.permissions || []
      const allowedRoutes = permissions
        .filter((p: any) => p.view)
        .map((p: any) => p.route)

      const permittedLinks = allLinks.filter(
        (l) => !l.adminOnly && allowedRoutes.includes(l.href)
      )
      setLinks(permittedLinks)

      // Guard: if on an admin-only page (/staff, /staff-logs), redirect
      const isStaffOrLogs = location.pathname.startsWith('/staff')
      if (isStaffOrLogs) {
        toast.error('Access restricted: Admin only section.')
        if (permittedLinks.length > 0) {
          navigate({ to: permittedLinks[0].href })
        }
        return
      }

      // Check if current route is allowed
      const currentPath = location.pathname
      let isAllowed = false

      if (currentPath === '/' && allowedRoutes.includes('/')) {
        isAllowed = true
      } else if (currentPath.startsWith('/bookings')) {
        // Bookings can be /bookings/standard, /bookings/customized, or /bookings/:id
        const search = location.search as any
        const typeParam = (
          typeof search === 'object' && search !== null
            ? search.type
            : new URLSearchParams(search || '').get('type')
        )?.toLowerCase()

        if (currentPath === '/bookings/standard' || currentPath.startsWith('/bookings/standard/')) {
          isAllowed = allowedRoutes.includes('/bookings/standard')
        } else if (currentPath === '/bookings/customized' || currentPath.startsWith('/bookings/customized/')) {
          isAllowed = allowedRoutes.includes('/bookings/customized')
        } else if (typeParam === 'customized') {
          isAllowed = allowedRoutes.includes('/bookings/customized')
        } else if (typeParam === 'standard') {
          isAllowed = allowedRoutes.includes('/bookings/standard')
        } else {
          // If no specific type param on /bookings/:id, allow if user has permission for either
          isAllowed =
            allowedRoutes.includes('/bookings/standard') ||
            allowedRoutes.includes('/bookings/customized')
        }
      } else {
        isAllowed = allowedRoutes.some(
          (r: string) => r !== '/' && (currentPath === r || currentPath.startsWith(r + '/'))
        )
      }

      if (!isAllowed && permittedLinks.length > 0) {
        toast.error('Access restricted: You do not have view permission for this page.')
        navigate({ to: permittedLinks[0].href })
      }
    } else {
      setLinks(allLinks)
    }
  }, [userType, session, location.pathname, location.search, navigate])

  /* track active segment */
  useEffect(() => {
    const parts = location.pathname.split('/')
    if (parts[1] === 'bookings') {
      const search = location.search as any
      const typeParam =
        typeof search === 'object' && search !== null
          ? search.type
          : new URLSearchParams(search || '').get('type')

      if (parts[2] === 'customized' || typeParam === 'customized') {
        setActiveMenu('/bookings/customized')
      } else {
        setActiveMenu('/bookings/standard')
      }
    } else {
      setActiveMenu(parts[1] ? `/${parts[1]}` : '/')
    }
  }, [location.pathname, location.search])

  /* responsive */
  useEffect(() => {
    const onResize = () => setIsLarge(window.innerWidth >= 1024)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const logoutMutation = useMutation({
    mutationFn: async () => (await _axios.post('/admin-auth/logout')).data,
    onSuccess: () => {
      toast.success('Logged out successfully')
      queryClient.invalidateQueries({ queryKey: ['session'] })
      navigate({ to: '/login' })
    },
    onError: () => toast.error('Logout failed. Please try again.'),
  })

  const handleNav = (path: string) => {
    navigate({ to: path })
    setMobileOpen(false)
  }

  const pageTitle = location.pathname.split('/')[1]
    ? location.pathname.split('/')[1].replace(/-/g, ' ')
    : 'Dashboard'

  const desktopSidebarW = collapsed ? SIDEBAR_ICON : SIDEBAR_FULL

  return (
    <TooltipProvider>
      <div
        className="min-h-screen"
        style={{ background: 'var(--ui-content-bg)' }}
      >
        {/* Mobile Backdrop */}
        {!isLarge && mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className="fixed top-0 left-0 bottom-0 z-50 flex flex-col overflow-hidden transition-all duration-300"
          style={{
            width: isLarge ? desktopSidebarW : SIDEBAR_FULL,
            background: 'var(--ui-sidebar-bg)',
            transform: isLarge
              ? 'translateX(0)'
              : mobileOpen
                ? 'translateX(0)'
                : `translateX(-${SIDEBAR_FULL}px)`,
          }}
        >
          {/* Logo Header */}
          <div
            className="flex items-center gap-3 shrink-0 px-4"
            style={{
              height: HEADER_H,
              background: 'var(--ui-header-bg)',
            }}
          >
            {/* <img
              src="/UdayamLogo.png" // ← Change to your logo
              className="w-10 h-10 object-contain"
              alt="Udayam International"
              loading="lazy"
            /> */}

            <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
              collapsed && isLarge ? 'max-w-0 opacity-0' : 'max-w-48 opacity-100'
            }`}>
              <p className="font-bold tracking-wide text-base text-white">
                UDAYAM
              </p>
            </div>

            {!isLarge && (
              <button
                className="ml-auto"
                style={{ color: 'var(--ui-header-fg)' }}
                onClick={() => setMobileOpen(false)}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {links.map((link) => {
              const isActive = activeMenu === link.href
              return (
                <Tooltip key={link.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleNav(link.href)}
                      className="w-full flex items-center gap-3 rounded-xl mb-1.5 text-sm font-medium transition-all duration-200 cursor-pointer"
                      style={{
                        padding: collapsed && isLarge ? '12px 0' : '12px 16px',
                        justifyContent:
                          collapsed && isLarge ? 'center' : 'flex-start',
                        background: isActive
                          ? 'var(--ui-sidebar-active-bg)'
                          : 'transparent',
                        color: isActive
                          ? 'var(--ui-sidebar-active-fg)'
                          : 'var(--ui-sidebar-fg)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          e.currentTarget.style.background =
                            'var(--ui-sidebar-hover-bg)'
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <link.icon size={18} className="shrink-0" />
                      <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                        collapsed && isLarge ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-48 opacity-100'
                      }`}>
                        {link.name}
                      </span>
                    </button>
                  </TooltipTrigger>
                  {collapsed && isLarge && (
                    <TooltipContent
                      className="!bg-slate-900 !text-slate-100 !border-slate-800 border shadow-md py-1.5 px-3 rounded-lg text-xs font-semibold"
                      style={{
                        backgroundColor: '#0f172a',
                        color: '#f8fafc',
                        border: '1px solid #1e293b'
                      }}
                      side="right"
                    >
                      <p style={{ color: '#f8fafc' }}>{link.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </nav>

          {/* Collapse Toggle */}
          {isLarge && (
            <div className="p-3 border-t border-[var(--ui-sidebar-border)]">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors cursor-pointer"
                style={{
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  color: 'var(--ui-sidebar-muted)',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    'var(--ui-sidebar-hover-bg)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'transparent')
                }
              >
                <ChevronLeft
                  size={18}
                  style={{
                    transform: collapsed ? 'rotate(180deg)' : 'none',
                    transition: 'transform 280ms',
                  }}
                  className="shrink-0"
                />
                <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                  collapsed ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-48 opacity-100'
                }`}>
                  Collapse Sidebar
                </span>
              </button>
            </div>
          )}
        </aside>

        {/* HEADER */}
        <header
          className="fixed top-0 right-0 z-40 flex items-center justify-between px-6 transition-all duration-300"
          style={{
            left: isLarge ? desktopSidebarW : 0,
            height: HEADER_H,
            background: 'var(--ui-header-bg)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div className="flex items-center gap-4">
            {!isLarge && (
              <button
                style={{ color: 'var(--ui-header-fg)' }}
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={24} />
              </button>
            )}
            <h1 className="text-xl font-semibold text-white capitalize tracking-tight">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            {/* <div
              className="hidden md:flex items-center gap-2 rounded-full px-4 py-2 text-sm"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'var(--ui-header-fg)',
              }}
            >
              <Search size={16} />
              <input
                placeholder="Search bookings, customers..."
                className="bg-transparent border-none outline-none w-52 placeholder:text-slate-400"
              />
            </div>

            <button
              className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: 'var(--ui-header-fg)' }}
            >
              <Bell size={20} />
            </button>

            <button
              className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all hover:brightness-110"
              style={{
                background: 'var(--ui-accent)',
                color: '#0f172a',
              }}
            >
              <Plus size={18} />
              New Booking
            </button> */}

            {/* Role & User Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${
                  userType === 'staff'
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                    : 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/30'
                }`}
              >
                {userType === 'staff' ? 'Staff' : 'Admin'}
              </span>
              {session?.name && (
                <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                  {session.name}
                </span>
              )}
            </div>

            {/* Logout */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/10 rounded-full transition-colors"
                  style={{ color: 'var(--ui-header-fg)' }}
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to log out?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => logoutMutation.mutate()}>
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main
          className="transition-all duration-300"
          style={{
            marginLeft: isLarge ? desktopSidebarW : 0,
            paddingTop: HEADER_H,
            minHeight: '100vh',
            background: 'var(--ui-content-bg)',
          }}
        >
          <div
            className="min-h-[calc(100vh-56px)]"
            style={{
              background: '#ffffff',
              borderTop: '1px solid var(--ui-table-border)',
            }}
          >
            <Outlet />
          </div>
          <Toaster position="top-right" />
        </main>
      </div>
    </TooltipProvider>
  )
}
