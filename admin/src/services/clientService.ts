import api from './api'

export interface Client {
  _id: string
  name: string
  email: string
  phone: string
  company: string
  address: string
  city: string
  state: string
  notes: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface ClientFilters {
  status?: string
  search?: string
  city?: string
  page?: number
  limit?: number
}

export interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

export const clientService = {
  getAll: async (filters: ClientFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params.set(k, String(v)) })
    const { data } = await api.get(`/clients?${params}`)
    return data as { data: Client[]; pagination: Pagination }
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/clients/${id}`)
    return data.data as Client
  },

  create: async (payload: Partial<Client>) => {
    const { data } = await api.post('/clients', payload)
    return data.data as Client
  },

  update: async (id: string, payload: Partial<Client>) => {
    const { data } = await api.put(`/clients/${id}`, payload)
    return data.data as Client
  },

  delete: async (id: string) => {
    await api.delete(`/clients/${id}`)
  },

  toggleStatus: async (id: string) => {
    const { data } = await api.patch(`/clients/${id}/toggle-status`)
    return data.data as Client
  },
}
