import { ChevronLeft, LogOut, Menu, X, LayoutDashboard } from 'lucide-react'
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
}

const allLinks: NavLink[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Tourism', href: '/tourism', icon: LayoutDashboard },
]

interface LayoutProps {
  session?: any
  userType?: 'admin' | 'staff' | null
}

const HEADER_H = 56
const SIDEBAR_FULL = 220
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

  /* route guard for staff */
  useEffect(() => {
    if (userType === 'staff' && session?.allowedRoutes) {
      const allowed = session.allowedRoutes as string[]
      setLinks(allLinks.filter((l) => allowed.includes(l.href)))
      if (!allowed.includes(location.pathname)) navigate({ to: '/' })
    } else {
      setLinks(allLinks)
    }
  }, [userType, session, location.pathname])

  /* track active segment */
  useEffect(() => {
    const seg = location.pathname.split('/')[1]
    setActiveMenu(seg ? `/${seg}` : '/')
  }, [location.pathname])

  /* responsive */
  useEffect(() => {
    const onResize = () => setIsLarge(window.innerWidth >= 1024)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const logoutMutation = useMutation({
    mutationFn: async () => (await _axios.post('/admin/auth/logout')).data,
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

            {(!collapsed || !isLarge) && (
              <div className="overflow-hidden">
                <p className="font-bold tracking-wide text-base text-white">
                  UDAYAM
                  {/* INTERNATIONAL */}
                </p>
              </div>
            )}

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
                      className="w-full flex items-center gap-3 rounded-xl mb-1.5 text-sm font-medium transition-all duration-200"
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
                      <link.icon size={18} />
                      {(!collapsed || !isLarge) && <span>{link.name}</span>}
                    </button>
                  </TooltipTrigger>
                  {collapsed && isLarge && (
                    <TooltipContent side="right">
                      <p>{link.name}</p>
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
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
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
                />
                {!collapsed && <span>Collapse Sidebar</span>}
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
