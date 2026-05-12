import { useEffect, useState, useCallback } from 'react'
import { IconPlus, IconEdit, IconTrash, IconToggleLeft, IconToggleRight, IconSearch, IconFilter } from '@tabler/icons-react'
import toast from 'react-hot-toast'
import StatusBadge from '@/components/StatusBadge'
import Modal from '@/components/Modal'
import { TableSkeleton, EmptyState } from '@/components/Loading'
import { clientService, Client } from '@/services/clientService'

const EMPTY_FORM = { name: '', email: '', phone: '', company: '', address: '', city: '', state: '', notes: '', status: 'active' as const }

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<Client | null>(null)
  const [editTarget, setEditTarget] = useState<Client | null>(null)
  const [form, setForm] = useState<any>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const loadClients = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const res = await clientService.getAll({ search, status: statusFilter, city: cityFilter, page, limit: 10 })
      setClients(res.data)
      setPagination(res.pagination)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, cityFilter])

  useEffect(() => { loadClients() }, [loadClients])

  const openCreate = () => { setEditTarget(null); setForm(EMPTY_FORM); setModalOpen(true) }
  const openEdit = (c: Client) => { setEditTarget(c); setForm({ name: c.name, email: c.email, phone: c.phone, company: c.company, address: c.address, city: c.city, state: c.state, notes: c.notes, status: c.status }); setModalOpen(true) }

  const handleSave = async () => {
    if (!form.name || !form.email) return toast.error('Name and email are required')
    setSaving(true)
    try {
      if (editTarget) {
        await clientService.update(editTarget._id, form)
        toast.success('Client updated')
      } else {
        await clientService.create(form)
        toast.success('Client created')
      }
      setModalOpen(false)
      loadClients()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal) return
    try {
      await clientService.delete(deleteModal._id)
      toast.success('Client deleted')
      setDeleteModal(null)
      loadClients()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleToggle = async (c: Client) => {
    try {
      await clientService.toggleStatus(c._id)
      toast.success(`Client marked ${c.status === 'active' ? 'inactive' : 'active'}`)
      loadClients()
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
          <input className="input pl-9" placeholder="Search by name, email, company..." value={search} onChange={e => setSearch(e.target.value)} />
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
          <input className="input w-36" placeholder="Filter city..." value={cityFilter} onChange={e => setCityFilter(e.target.value)} />
          <button className="btn-primary" onClick={openCreate}>
            <IconPlus size={16} /> Add Client
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-dark-800">
          <p className="text-sm font-medium text-white">All Clients <span className="text-dark-500 font-normal">({pagination.total})</span></p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-900/50">
              <tr>
                <th className="table-header">Client</th>
                <th className="table-header">Company</th>
                <th className="table-header">City</th>
                <th className="table-header">Phone</th>
                <th className="table-header">Status</th>
                <th className="table-header">Joined</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><TableSkeleton rows={6} cols={7} /></td></tr>
              ) : clients.length === 0 ? (
                <tr><td colSpan={7}><EmptyState message="No clients found. Add your first client!" /></td></tr>
              ) : clients.map((c) => (
                <tr key={c._id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {c.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{c.name}</p>
                        <p className="text-xs text-dark-500">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">{c.company || '—'}</td>
                  <td className="table-cell">{c.city || '—'}</td>
                  <td className="table-cell">{c.phone || '—'}</td>
                  <td className="table-cell"><StatusBadge status={c.status} /></td>
                  <td className="table-cell text-dark-500">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleToggle(c)} title="Toggle status" className={c.status === 'active' ? 'btn-success p-1.5' : 'btn-danger p-1.5'}>
                        {c.status === 'active' ? <IconToggleRight size={16} /> : <IconToggleLeft size={16} />}
                      </button>
                      <button onClick={() => openEdit(c)} className="btn-secondary p-1.5"><IconEdit size={15} /></button>
                      <button onClick={() => setDeleteModal(c)} className="btn-danger p-1.5"><IconTrash size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-dark-800">
            <p className="text-xs text-dark-500">Page {pagination.page} of {pagination.pages}</p>
            <div className="flex gap-2">
              <button className="btn-secondary text-xs py-1.5 px-3" disabled={pagination.page <= 1} onClick={() => loadClients(pagination.page - 1)}>Prev</button>
              <button className="btn-secondary text-xs py-1.5 px-3" disabled={pagination.page >= pagination.pages} onClick={() => loadClients(pagination.page + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Client' : 'Add New Client'}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="label">Full Name *</label>
            <input className="input" placeholder="John Doe" value={form.name} onChange={e => f('name', e.target.value)} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="label">Email *</label>
            <input className="input" type="email" placeholder="john@example.com" value={form.email} onChange={e => f('email', e.target.value)} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="label">Phone</label>
            <input className="input" placeholder="9876543210" value={form.phone} onChange={e => f('phone', e.target.value)} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="label">Company</label>
            <input className="input" placeholder="Acme Corp" value={form.company} onChange={e => f('company', e.target.value)} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="label">City</label>
            <input className="input" placeholder="Mumbai" value={form.city} onChange={e => f('city', e.target.value)} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="label">State</label>
            <input className="input" placeholder="Maharashtra" value={form.state} onChange={e => f('state', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="label">Address</label>
            <input className="input" placeholder="Street address" value={form.address} onChange={e => f('address', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="label">Notes</label>
            <textarea className="input resize-none h-20" placeholder="Any notes..." value={form.notes} onChange={e => f('notes', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={e => f('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6 pt-4 border-t border-dark-800">
          <button className="btn-secondary flex-1" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn-primary flex-1" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : editTarget ? 'Update Client' : 'Create Client'}
          </button>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Client">
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
