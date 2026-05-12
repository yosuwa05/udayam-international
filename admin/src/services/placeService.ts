import api from './api'

export interface Place {
  _id: string
  name: string
  description: string
  category: string
  address: string
  city: string
  state: string
  pincode: string
  lat: number | null
  lng: number | null
  phone: string
  email: string
  website: string
  images: string[]
  status: 'active' | 'inactive'
  client: { _id: string; name: string; email: string } | null
  createdAt: string
  updatedAt: string
}

export interface PlaceFilters {
  status?: string
  search?: string
  city?: string
  category?: string
  page?: number
  limit?: number
}

export const PLACE_CATEGORIES = ['restaurant', 'hotel', 'park', 'shop', 'hospital', 'school', 'office', 'other']

export const placeService = {
  getAll: async (filters: PlaceFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params.set(k, String(v)) })
    const { data } = await api.get(`/places?${params}`)
    return data as { data: Place[]; pagination: { total: number; page: number; limit: number; pages: number } }
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/places/${id}`)
    return data.data as Place
  },

  create: async (payload: Partial<Place>) => {
    const { data } = await api.post('/places', payload)
    return data.data as Place
  },

  update: async (id: string, payload: Partial<Place>) => {
    const { data } = await api.put(`/places/${id}`, payload)
    return data.data as Place
  },

  delete: async (id: string) => {
    await api.delete(`/places/${id}`)
  },

  toggleStatus: async (id: string) => {
    const { data } = await api.patch(`/places/${id}/toggle-status`)
    return data.data as Place
  },
}
