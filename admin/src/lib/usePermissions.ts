import { useQuery } from '@tanstack/react-query'
import { _axios } from '@/lib/axios'

export interface RoutePermission {
  route: string
  name: string
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
}

export function usePermissions() {
  const { data: sessionData } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await _axios.get('/admin-auth/session')
      const role = res.data?.data?.role?.toUpperCase()
      const userType = role === 'STAFF' ? ('staff' as const) : ('admin' as const)
      return { data: res.data?.data, userType }
    },
    staleTime: 1000 * 60 * 5,
  })

  const user = sessionData?.data
  const role = user?.role?.toUpperCase()
  const isAdmin = role === 'ADMIN'
  const isStaff = role === 'STAFF'
  const permissions: RoutePermission[] = user?.permissions || []

  const getPermission = (route: string): RoutePermission | undefined => {
    return permissions.find((p) => p.route === route)
  }

  const canView = (route: string, bookingType?: 'standard' | 'customized'): boolean => {
    if (isAdmin) return true
    if (route.startsWith('/bookings')) {
      if (route === '/bookings/cancellations' || route.startsWith('/bookings/cancellations')) {
        return (
          (getPermission('/bookings/cancellations')?.view ?? false) ||
          (getPermission('/bookings/standard')?.view ?? false)
        )
      }
      if (bookingType === 'customized') return getPermission('/bookings/customized')?.view ?? false
      if (bookingType === 'standard') return getPermission('/bookings/standard')?.view ?? false
      return (
        (getPermission('/bookings/standard')?.view ?? false) ||
        (getPermission('/bookings/customized')?.view ?? false) ||
        (getPermission('/bookings/cancellations')?.view ?? false)
      )
    }
    const perm = getPermission(route)
    return perm?.view ?? false
  }

  const canCreate = (route: string, bookingType?: 'standard' | 'customized'): boolean => {
    if (isAdmin) return true
    if (route.startsWith('/bookings')) {
      if (bookingType === 'customized') {
        const perm = getPermission('/bookings/customized')
        return perm?.create !== undefined ? perm.create : (perm?.edit ?? false)
      }
      if (bookingType === 'standard') {
        const perm = getPermission('/bookings/standard')
        return perm?.create !== undefined ? perm.create : (perm?.edit ?? false)
      }
      const std = getPermission('/bookings/standard')
      const cust = getPermission('/bookings/customized')
      const stdCreate = std?.create !== undefined ? std.create : (std?.edit ?? false)
      const custCreate = cust?.create !== undefined ? cust.create : (cust?.edit ?? false)
      return stdCreate || custCreate
    }
    const perm = getPermission(route)
    return perm?.create !== undefined ? perm.create : (perm?.edit ?? false)
  }

  const canEdit = (route: string, bookingType?: 'standard' | 'customized'): boolean => {
    if (isAdmin) return true
    if (route.startsWith('/bookings')) {
      if (route === '/bookings/cancellations' || route.startsWith('/bookings/cancellations')) {
        return (
          (getPermission('/bookings/cancellations')?.edit ?? false) ||
          (getPermission('/bookings/standard')?.edit ?? false)
        )
      }
      if (bookingType === 'customized') return getPermission('/bookings/customized')?.edit ?? false
      if (bookingType === 'standard') return getPermission('/bookings/standard')?.edit ?? false
      return (
        (getPermission('/bookings/standard')?.edit ?? false) ||
        (getPermission('/bookings/customized')?.edit ?? false) ||
        (getPermission('/bookings/cancellations')?.edit ?? false)
      )
    }
    const perm = getPermission(route)
    return perm?.edit ?? false
  }

  const canDelete = (route: string, bookingType?: 'standard' | 'customized'): boolean => {
    if (isAdmin) return true
    if (route.startsWith('/bookings')) {
      if (route === '/bookings/cancellations' || route.startsWith('/bookings/cancellations')) {
        return (
          (getPermission('/bookings/cancellations')?.delete ?? false) ||
          (getPermission('/bookings/standard')?.delete ?? false)
        )
      }
      if (bookingType === 'customized') return getPermission('/bookings/customized')?.delete ?? false
      if (bookingType === 'standard') return getPermission('/bookings/standard')?.delete ?? false
      return (
        (getPermission('/bookings/standard')?.delete ?? false) ||
        (getPermission('/bookings/customized')?.delete ?? false) ||
        (getPermission('/bookings/cancellations')?.delete ?? false)
      )
    }
    const perm = getPermission(route)
    return perm?.delete ?? false
  }

  return {
    user,
    role,
    isAdmin,
    isStaff,
    permissions,
    getPermission,
    canView,
    canCreate,
    canEdit,
    canDelete,
  }
}

