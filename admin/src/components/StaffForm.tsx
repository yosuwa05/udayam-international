import React, { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Layers,
  User,
  Mail,
  KeyRound,
  ShieldCheck,
  CheckCheck,
  Eye,
  Edit,
  Trash,
} from 'lucide-react'
import { toast } from 'sonner'

export interface RoutePermission {
  route: string
  name: string
  view: boolean
  edit: boolean
  delete: boolean
}

export interface StaffFormValues {
  name: string
  email: string
  password?: string
  active: boolean
  permissions: RoutePermission[]
}

interface StaffFormProps {
  initialValues?: Partial<StaffFormValues>
  onSubmit: (values: StaffFormValues) => void
  isLoading?: boolean
  isEdit?: boolean
}

export const DEFAULT_LAYOUT_MODULES = [
  { route: '/', name: 'Dashboard', description: 'Overview and platform statistics' },
  { route: '/bookings/standard', name: 'Standard Bookings', description: 'Manage bookings and installment stages' },
  { route: '/bookings/customized', name: 'Customized Bookings', description: 'Customized tours, quotations & payments' },
  { route: '/bookings/cancellations', name: 'Cancellation Requests', description: 'Review booking cancellations and process refunds' },
  { route: '/users', name: 'Users', description: 'User accounts and blocking/activation' },
  { route: '/tourism', name: 'Tourism Packages', description: 'Tour packages, itinerary & destinations' },
  { route: '/testimonials', name: 'Testimonials', description: 'Customer reviews and ratings' },
  { route: '/coupons', name: 'Coupons', description: 'Discount codes and limits' },
  { route: '/trip-types', name: 'Trip Types', description: 'Travel styles and categories' },
  { route: '/regions', name: 'Regions', description: 'Geographical tour regions' },
]

export const StaffForm: React.FC<StaffFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
  isEdit = false,
}) => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<StaffFormValues>({
    name: initialValues?.name || '',
    email: initialValues?.email || '',
    password: '',
    active: initialValues?.active !== undefined ? initialValues.active : true,
    permissions: DEFAULT_LAYOUT_MODULES.map((m) => {
      const existing = initialValues?.permissions?.find((p) => p.route === m.route)
      return {
        route: m.route,
        name: m.name,
        view: existing ? existing.view : false,
        edit: existing ? existing.edit : false,
        delete: existing ? existing.delete : false,
      }
    }),
  })

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || '',
        email: initialValues.email || '',
        password: '',
        active: initialValues.active !== undefined ? initialValues.active : true,
        permissions: DEFAULT_LAYOUT_MODULES.map((m) => {
          const existing = initialValues.permissions?.find((p) => p.route === m.route)
          return {
            route: m.route,
            name: m.name,
            view: existing ? existing.view : false,
            edit: existing ? existing.edit : false,
            delete: existing ? existing.delete : false,
          }
        }),
      })
    }
  }, [initialValues])

  // Permission toggles
  const handleTogglePermission = (
    index: number,
    field: 'view' | 'edit' | 'delete'
  ) => {
    setFormData((prev) => {
      const updated = [...prev.permissions]
      const currentVal = updated[index][field]
      const newVal = !currentVal
      updated[index] = { ...updated[index], [field]: newVal }

      // If user enables edit or delete, automatically enable view
      if (newVal && (field === 'edit' || field === 'delete')) {
        updated[index].view = true
      }
      // If user disables view, automatically disable edit and delete
      if (!newVal && field === 'view') {
        updated[index].edit = false
        updated[index].delete = false
      }

      return { ...prev, permissions: updated }
    })
  }

  // Quick permission helpers
  const handleSelectAll = (field?: 'view' | 'edit' | 'delete') => {
    setFormData((prev) => {
      const updated = prev.permissions.map((p) => {
        if (!field) {
          return { ...p, view: true, edit: true, delete: true }
        }
        if (field === 'view') {
          return { ...p, view: true }
        }
        if (field === 'edit') {
          return { ...p, view: true, edit: true }
        }
        if (field === 'delete') {
          return { ...p, view: true, delete: true }
        }
        return p
      })
      return { ...prev, permissions: updated }
    })
  }

  const handleClearAll = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.map((p) => ({
        ...p,
        view: false,
        edit: false,
        delete: false,
      })),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please enter name and a valid email')
      return
    }

    if (!isEdit && (!formData.password || formData.password.trim().length < 6)) {
      toast.error('Password is required and must be at least 6 characters')
      return
    }

    if (isEdit && formData.password && formData.password.trim().length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    const payload: StaffFormValues = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      active: formData.active,
      permissions: formData.permissions,
    }

    if (formData.password?.trim()) {
      payload.password = formData.password.trim()
    }

    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Account Information Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <User size={18} className="text-indigo-600" />
          Staff Account Credentials
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="staff-name" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              Full Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="staff-name"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="staff-email" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              Email Address <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="staff-email"
              type="email"
              placeholder="e.g. staff@udayam.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="staff-password" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              Password {isEdit ? <span className="text-slate-400 font-normal">(Leave blank to keep existing password)</span> : <span className="text-rose-500">*</span>}
            </Label>
            <Input
              id="staff-password"
              type="password"
              placeholder={isEdit ? 'Enter new password to change' : 'Minimum 6 characters'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!isEdit}
              minLength={6}
            />
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-4 sm:pt-6">
            <Label className="text-xs font-semibold text-slate-700 cursor-pointer">Account Status:</Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <span className={`text-xs font-semibold ${formData.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                {formData.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Layout Menus & Permissions Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers size={18} className="text-indigo-600" />
              Role-Based Menu & Permission Management
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Assign specific permissions for each layout route. View allows menu access; Edit allows create and update; Delete allows removal.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleSelectAll()}
              className="text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Grant Full Access
            </button>
            <button
              type="button"
              onClick={() => handleSelectAll('view')}
              className="text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              All View
            </button>
            <button
              type="button"
              onClick={() => handleSelectAll('edit')}
              className="text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              All Edit
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Permissions Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Layout Menu / Route</th>
                <th className="py-3 px-4 text-center w-36">
                  <div className="flex items-center justify-center gap-1 text-emerald-700">
                    <Eye size={13} /> View Permission
                  </div>
                </th>
                <th className="py-3 px-4 text-center w-36">
                  <div className="flex items-center justify-center gap-1 text-blue-700">
                    <Edit size={13} /> Edit Permission
                  </div>
                </th>
                <th className="py-3 px-4 text-center w-36">
                  <div className="flex items-center justify-center gap-1 text-rose-700">
                    <Trash size={13} /> Delete Permission
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {formData.permissions.map((perm, idx) => {
                const meta = DEFAULT_LAYOUT_MODULES.find((m) => m.route === perm.route)
                return (
                  <tr key={perm.route} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-sm text-slate-900">{perm.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{perm.route}</p>
                      {meta?.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{meta.description}</p>
                      )}
                    </td>

                    {/* View Switch */}
                    <td className="py-3 px-4 text-center">
                      <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-200">
                        <input
                          type="checkbox"
                          checked={perm.view}
                          onChange={() => handleTogglePermission(idx, 'view')}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className={`text-xs font-semibold ${perm.view ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {perm.view ? 'Allowed' : 'Restricted'}
                        </span>
                      </label>
                    </td>

                    {/* Edit Switch */}
                    <td className="py-3 px-4 text-center">
                      <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-200">
                        <input
                          type="checkbox"
                          checked={perm.edit}
                          onChange={() => handleTogglePermission(idx, 'edit')}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className={`text-xs font-semibold ${perm.edit ? 'text-blue-700' : 'text-slate-400'}`}>
                          {perm.edit ? 'Allowed' : 'Restricted'}
                        </span>
                      </label>
                    </td>

                    {/* Delete Switch */}
                    <td className="py-3 px-4 text-center">
                      <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-200">
                        <input
                          type="checkbox"
                          checked={perm.delete}
                          onChange={() => handleTogglePermission(idx, 'delete')}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className={`text-xs font-semibold ${perm.delete ? 'text-rose-700' : 'text-slate-400'}`}>
                          {perm.delete ? 'Allowed' : 'Restricted'}
                        </span>
                      </label>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: '/staff' })}
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer px-6"
        >
          {isLoading
            ? 'Saving...'
            : isEdit
            ? 'Update Staff & Permissions'
            : 'Create Staff Account'}
        </Button>
      </div>
    </form>
  )
}

