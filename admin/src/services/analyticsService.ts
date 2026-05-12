import api from './api'

export const analyticsService = {
  getSummary: async () => {
    const { data } = await api.get('/analytics/summary')
    return data.data as {
      clients: { total: number; active: number; inactive: number }
      places: { total: number; active: number; inactive: number }
    }
  },

  getClientsByMonth: async () => {
    const { data } = await api.get('/analytics/clients-by-month')
    return data.data as { month: string; year: number; count: number }[]
  },

  getPlacesByCategory: async () => {
    const { data } = await api.get('/analytics/places-by-category')
    return data.data as { category: string; count: number }[]
  },

  getPlacesByMonth: async () => {
    const { data } = await api.get('/analytics/places-by-month')
    return data.data as { month: string; year: number; count: number }[]
  },

  getRecentActivity: async () => {
    const { data } = await api.get('/analytics/recent-activity')
    return data.data as {
      recentClients: { _id: string; name: string; email: string; status: string; createdAt: string }[]
      recentPlaces: { _id: string; name: string; city: string; category: string; status: string; createdAt: string }[]
    }
  },
}
