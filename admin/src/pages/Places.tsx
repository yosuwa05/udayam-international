import { useEffect, useState, useCallback } from 'react'
import { IconPlus, IconEdit, IconTrash, IconToggleLeft, IconToggleRight, IconSearch, IconFilter, IconMapPin } from '@tabler/icons-react'
import toast from 'react-hot-toast'
import StatusBadge from '@/components/StatusBadge'
import Modal from '@/components/Modal'
import { TableSkeleton, EmptyState } from '@/components/Loading'
import { placeService, Place, PLACE_CATEGORIES } from '@/services/placeService'

const EMPTY_FORM = {
  name: '', description: '', category: 'other', address: '', city: '', state: '',
  pincode: '', phone: '', email: '', website: '', status: 'active' as const,
}

const CATEGORY_COLORS: Record<string, string> = {
  restaurant: 'text-orange-400 bg-orange-500/10',
  hotel: 'text-blue-400 bg-blue-500/10',
  park: 'text-green-400 bg-green-500/10',
  shop: 'text-pink-400 bg-pink-500/10',
  hospital: 'text-red-400 bg-red-500/10',
  school: 'text-yellow-400 bg-yellow-500/10',
  office: 'text-cyan-400 bg-cyan-500/10',
  other: 'text-dark-400 bg-dark-700/50',
}

export default function Places() {
  const [places, setPlaces] = useState<Place[]>([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<Place | null>(null)
  const [editTarget, setEditTarget] = useState<Place | null>(null)
  const [form, setForm] = useState<any>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const loadPlaces = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const res = await placeService.getAll({ search, status: statusFilter, category: categoryFilter, city: cityFilter, page, limit: 10 })
      setPlaces(res.data)
      setPagination(res.pagination)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, categoryFilter, cityFilter])

  useEffect(() => { loadPlaces() }, [loadPlaces])

  const openCreate = () => { setEditTarget(null); setForm(EMPTY_FORM); setModalOpen(true) }
  const openEdit = (p: Place) => {
    setEditTarget(p)
    setForm({ name: p.name, description: p.description, category: p.category, address: p.address, city: p.city, state: p.state, pincode: p.pincode, phone: p.phone, email: p.email, website: p.website, status: p.status })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.address || !form.city) return toast.error('Name, address and city are required')
    setSaving(true)
    try {
      if (editTarget) {
        await placeService.update(editTarget._id, form)
        toast.success('Place updated')
      } else {
        await placeService.create(form)
        toast.success('Place created')
      }
      setModalOpen(false)
      loadPlaces()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal) return
    try {
      await placeService.delete(deleteModal._id)
      toast.success('Place deleted')
      setDeleteModal(null)
      loadPlaces()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleToggle = async (p: Place) => {
    try {
      await placeService.toggleStatus(p._id)
      toast.success(`Place marked ${p.status === 'active' ? 'inactive' : 'active'}`)
      loadPlaces()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const f = (field: string, val: string) => setForm((p: any) => ({ ...p, [field]: val }))

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <input className="input pl-9" placeholder="Search by name, city, address..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <IconFilter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
            <select className="input pl-8 pr-4 w-36 appearance-none" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <select className="input w-36 appearance-none" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="all">All Category</option>
            {PLACE_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <input className="input w-32" placeholder="Filter city..." value={cityFilter} onChange={e => setCityFilter(e.target.value)} />
          <button className="btn-primary" onClick={openCreate}>
            <IconPlus size={16} /> Add Place
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-dark-800">
          <p className="text-sm font-medium text-white">All Places <span className="text-dark-500 font-normal">({pagination.total})</span></p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-900/50">
              <tr>
                <th className="table-header">Place</th>
                <th className="table-header">Category</th>
                <th className="table-header">City</th>
                <th className="table-header">Phone</th>
                <th className="table-header">Client</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><TableSkeleton rows={6} cols={7} /></td></tr>
              ) : places.length === 0 ? (
                <tr><td colSpan={7}><EmptyState message="No places found. Add your first place!" /></td></tr>
              ) : places.map((p) => (
                <tr key={p._id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                        <IconMapPin size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{p.name}</p>
                        <p className="text-xs text-dark-500 truncate max-w-[160px]">{p.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${CATEGORY_COLORS[p.category] || CATEGORY_COLORS.other}`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="table-cell">{p.city}{p.state ? `, ${p.state}` : ''}</td>
                  <td className="table-cell">{p.phone || '—'}</td>
                  <td className="table-cell">
                    {p.client ? (
                      <span className="text-brand-400 text-xs">{(p.client as any).name}</span>
                    ) : '—'}
                  </td>
                  <td className="table-cell"><StatusBadge status={p.status} /></td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleToggle(p)} title="Toggle status" className={p.status === 'active' ? 'btn-success p-1.5' : 'btn-danger p-1.5'}>
                        {p.status === 'active' ? <IconToggleRight size={16} /> : <IconToggleLeft size={16} />}
                      </button>
                      <button onClick={() => openEdit(p)} className="btn-secondary p-1.5"><IconEdit size={15} /></button>
                      <button onClick={() => setDeleteModal(p)} className="btn-danger p-1.5"><IconTrash size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-dark-800">
            <p className="text-xs text-dark-500">Page {pagination.page} of {pagination.pages}</p>
            <div className="flex gap-2">
              <button className="btn-secondary text-xs py-1.5 px-3" disabled={pagination.page <= 1} onClick={() => loadPlaces(pagination.page - 1)}>Prev</button>
              <button className="btn-secondary text-xs py-1.5 px-3" disabled={pagination.page >= pagination.pages} onClick={() => loadPlaces(pagination.page + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Place' : 'Add New Place'}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Place Name *</label>
            <input className="input" placeholder="e.g. The Grand Bistro" value={form.name} onChange={e => f('name', e.target.value)} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="label">Category</label>
            <select className="input appearance-none" value={form.category} onChange={e => f('category', e.target.value)}>
              {PLACE_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="label">Status</label>
            <select className="input appearance-none" value={form.status} onChange={e => f('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="label">Address *</label>
            <input className="input" placeholder="Street address" value={form.address} onChange={e => f('address', e.target.value)} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="label">City *</label>
            <input className="input" placeholder="Mumbai" value={form.city} onChange={e => f('city', e.target.value)} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="label">State</label>
            <input className="input" placeholder="Maharashtra" value={form.state} onChange={e => f('state', e.target.value)} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="label">Pincode</label>
            <input className="input" placeholder="400001" value={form.pincode} onChange={e => f('pincode', e.target.value)} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="label">Phone</label>
            <input className="input" placeholder="022-12345678" value={form.phone} onChange={e => f('phone', e.target.value)} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="info@place.com" value={form.email} onChange={e => f('email', e.target.value)} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="label">Website</label>
            <input className="input" placeholder="https://..." value={form.website} onChange={e => f('website', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="label">Description</label>
            <textarea className="input resize-none h-20" placeholder="Brief description..." value={form.description} onChange={e => f('description', e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 mt-6 pt-4 border-t border-dark-800">
          <button className="btn-secondary flex-1" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn-primary flex-1" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : editTarget ? 'Update Place' : 'Create Place'}
          </button>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Place">
        <p className="text-sm text-dark-400 mb-1">Are you sure you want to delete:</p>
        <p className="text-base font-semibold text-white mb-5">"{deleteModal?.name}"?</p>
        <p className="text-xs text-red-400 mb-5">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button className="btn-secondary flex-1" onClick={() => setDeleteModal(null)}>Cancel</button>
          <button className="btn-danger flex-1" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  )
}
