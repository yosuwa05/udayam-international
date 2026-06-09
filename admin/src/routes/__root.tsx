import {
  Outlet,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'
import { useQuery, type QueryClient } from '@tanstack/react-query'
import { _axios } from '@/lib/axios'
import { useEffect } from 'react'
import { NotFound } from '@/components/NotFound'
import Layout from '@/components/Layout'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  const navigate = Route.useNavigate()
  const location = useLocation()
  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.includes(location.pathname)

  const {
    data: session,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        const adminResponse = await _axios.get('/admin/auth/session')
        return { data: adminResponse.data.data, userType: 'admin' as const }
      } catch (adminError) {
        console.log(adminError)
      }
    },
    retry: false,
  })

  useEffect(() => {
    // Don't navigate while checking session
    if (isPending) return

    // If no session (error or null) and not on auth page, redirect to login
    if ((isError || !session) && !isAuthRoute) {
      console.log(isError, session, isAuthRoute)
      console.log('No session, redirecting to login')
      navigate({ to: '/login' })
    }

    // If has session and on auth page, redirect to dashboard
    if (session && !isError && isAuthRoute) {
      console.log('Has session, redirecting to dashboard')
      navigate({ to: '/' })
    }
  }, [session, isPending, isError, isAuthRoute, navigate])

  // Show loading state
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      {isAuthRoute ? (
        <Outlet />
      ) : (
        <Layout session={session?.data} userType={session?.userType} />
      )}
    </>
  )
}
