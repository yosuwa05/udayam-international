// import { createFileRoute } from '@tanstack/react-router'
// import { useState, useRef } from 'react'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { _axios } from '@/lib/axios'
// import { toast } from 'sonner'
// import { Eye, Pencil, Trash2, Plus, Upload, X, ImagePlus } from 'lucide-react'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Skeleton } from '@/components/ui/skeleton'
// import { Pagination } from '@/components/Pagination'

// export const Route = createFileRoute('/notifications/')({
//   component: NotificationPage,
// })

// // ─── Types ───────────────────────────────────────────────────────
// interface Notification {
//   _id: string
//   date: string
//   time: string
//   scheduleAt: string
//   title: string
//   message: string
//   imgUrl?: string
//   isSent: boolean
// }

// interface NotificationForm {
//   date: string
//   time: string
//   title: string
//   message: string
//   imgUrl: string
// }

// const emptyForm = (): NotificationForm => ({
//   date: new Date().toISOString().split('T')[0],
//   time: '09:00',
//   title: '',
//   message: '',
//   imgUrl: '',
// })

// // ─── Table Skeleton ───────────────────────────────────────────────
// function TableSkeleton() {
//   return (
//     <div className="w-full">
//       {/* header */}
//       <div className="grid grid-cols-[60px_160px_1fr_2fr_120px_100px] gap-4 px-4 py-3 border-b">
//         {[
//           'SI NO',
//           'DATE & TIME',
//           'TITLE / HEADING',
//           'MESSAGE',
//           'IMAGE',
//           'ACTION',
//         ].map((h) => (
//           <Skeleton key={h} className="h-4 w-full" />
//         ))}
//       </div>
//       {/* rows */}
//       {Array.from({ length: 6 }).map((_, i) => (
//         <div
//           key={i}
//           className="grid grid-cols-[60px_160px_1fr_2fr_120px_100px] gap-4 px-4 py-4 border-b items-center"
//         >
//           <Skeleton className="h-4 w-8" />
//           <div className="space-y-1.5">
//             <Skeleton className="h-4 w-24" />
//             <Skeleton className="h-3 w-16" />
//           </div>
//           <Skeleton className="h-4 w-36" />
//           <div className="space-y-1.5">
//             <Skeleton className="h-4 w-full" />
//             <Skeleton className="h-4 w-3/4" />
//           </div>
//           <Skeleton className="h-12 w-16 rounded-md" />
//           <div className="flex gap-2">
//             <Skeleton className="h-7 w-7 rounded" />
//             <Skeleton className="h-7 w-7 rounded" />
//             <Skeleton className="h-7 w-7 rounded" />
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

// // ─── Format date ──────────────────────────────────────────────────
// function formatDate(dateStr: string) {
//   const d = new Date(dateStr)
//   return {
//     date: d.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     }),
//     time: d.toLocaleTimeString('en-GB', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     }),
//   }
// }

// // ─── Main Page ────────────────────────────────────────────────────
// function NotificationPage() {
//   const queryClient = useQueryClient()

//   // pagination
//   const [page, setPage] = useState(1)
//   const [limit, setLimit] = useState(10)

//   // modals
//   const [addOpen, setAddOpen] = useState(false)
//   const [bulkOpen, setBulkOpen] = useState(false)
//   const [viewOpen, setViewOpen] = useState(false)
//   const [editOpen, setEditOpen] = useState(false)
//   const [deleteId, setDeleteId] = useState<string | null>(null)
//   const [viewItem, setViewItem] = useState<Notification | null>(null)
//   const [editItem, setEditItem] = useState<Notification | null>(null)

//   // add form — array of rows
//   const [addForms, setAddForms] = useState<NotificationForm[]>([emptyForm()])

//   // edit form
//   const [editForm, setEditForm] = useState<NotificationForm>(emptyForm())

//   // bulk upload
//   const [bulkFile, setBulkFile] = useState<File | null>(null)
//   const bulkInputRef = useRef<HTMLInputElement>(null)

//   // ── Fetch ──────────────────────────────────────────────────────
//   const { data, isLoading } = useQuery({
//     queryKey: ['notifications', page, limit],
//     queryFn: async () => {
//       const res = await _axios.get('/admin/bulk-notification/notifications', {
//         params: { page, limit },
//       })
//       return res.data
//     },
//   })

//   const notifications: Notification[] = data?.data ?? []
//   const totalPages = data?.pagination?.totalPages ?? 1
//   const totalItems = data?.pagination?.total ?? 0

//   // ── Create (multiple) ──────────────────────────────────────────
//   const createMutation = useMutation({
//     mutationFn: async (items: NotificationForm[]) => {
//       const payload = items.map((f) => ({
//         date: f.date,
//         time: f.time,
//         title: f.title,
//         message: f.message,
//         imgUrl: f.imgUrl,
//       }))
//       return _axios.post('/admin/bulk-notification/create', payload)
//     },
//     onSuccess: (_, items) => {
//       toast.success(
//         `${items.length} notification${items.length > 1 ? 's' : ''} added`,
//       )
//       queryClient.invalidateQueries({ queryKey: ['notifications'] })
//       setAddOpen(false)
//       setAddForms([emptyForm()])
//     },
//     onError: () => toast.error('Failed to add notifications'),
//   })

//   // ── Update ─────────────────────────────────────────────────────
//   const updateMutation = useMutation({
//     mutationFn: async ({ id, data }: { id: string; data: NotificationForm }) =>
//       _axios.put(`/admin/bulk-notification/${id}`, data),
//     onSuccess: () => {
//       toast.success('Notification updated')
//       queryClient.invalidateQueries({ queryKey: ['notifications'] })
//       setEditOpen(false)
//     },
//     onError: () => toast.error('Failed to update'),
//   })

//   // ── Delete ─────────────────────────────────────────────────────
//   const deleteMutation = useMutation({
//     mutationFn: async (id: string) =>
//       _axios.delete(`/admin/bulk-notification/${id}`),
//     onSuccess: () => {
//       toast.success('Notification deleted')
//       queryClient.invalidateQueries({ queryKey: ['notifications'] })
//     },
//     onError: () => toast.error('Failed to delete'),
//   })

//   // ── Bulk upload ────────────────────────────────────────────────
//   const bulkMutation = useMutation({
//     mutationFn: async (file: File) => {
//       const fd = new FormData()
//       fd.append('file', file)
//       return _axios.post('/admin/bulk-notification/upload-excel', fd, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       })
//     },
//     onSuccess: (res) => {
//       toast.success(res.data?.message ?? 'Bulk upload successful')
//       queryClient.invalidateQueries({ queryKey: ['notifications'] })
//       setBulkOpen(false)
//       setBulkFile(null)
//     },
//     onError: () => toast.error('Bulk upload failed'),
//   })

//   // ── Add form helpers ───────────────────────────────────────────
//   const addRow = () => setAddForms((f) => [...f, emptyForm()])
//   const removeRow = (i: number) =>
//     setAddForms((f) => f.filter((_, idx) => idx !== i))
//   const updateRow = (i: number, key: keyof NotificationForm, val: string) =>
//     setAddForms((f) =>
//       f.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)),
//     )

//   const handleAddSubmit = () => {
//     const valid = addForms.filter((f) => f.title && f.date && f.time)
//     if (!valid.length)
//       return toast.error(
//         'Fill at least one notification with title, date & time',
//       )
//     createMutation.mutate(valid)
//   }

//   // ── Edit helpers ───────────────────────────────────────────────
//   const openEdit = (n: Notification) => {
//     setEditItem(n)
//     setEditForm({
//       date: n.date,
//       time: n.time,
//       title: n.title,
//       message: n.message,
//       imgUrl: n.imgUrl ?? '',
//     })
//     setEditOpen(true)
//   }

//   // ── Render ─────────────────────────────────────────────────────
//   return (
//     <div className="flex flex-col min-h-full">
//       {/* ── Page header ── */}
//       <div className="flex items-center justify-between px-6 py-4 border-b">
//         <h2 className="text-xl font-semibold text-gray-800"></h2>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             style={{ color: 'var(--kp-base-font)' }}
//             className="gap-1.5 "
//             onClick={() => setBulkOpen(true)}
//           >
//             <Upload size={15} />
//             Bulk Upload
//           </Button>
//           <Button
//             size="sm"
//             style={{ background: '#EDDCA2', color: 'var(--kp-base-font)' }}
//             onClick={() => {
//               setAddForms([emptyForm()])
//               setAddOpen(true)
//             }}
//           >
//             <Plus size={15} />
//             Add Notification
//           </Button>
//         </div>
//       </div>

//       {/* ── Table ── */}
//       <div className="flex-1 overflow-x-auto  p-4">
//         {isLoading ? (
//           <TableSkeleton />
//         ) : (
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b bg-white">
//                 {[
//                   'SI NO',
//                   'DATE & TIME',
//                   'TITLE / HEADING',
//                   'MESSAGE',
//                   'ACTION',
//                 ].map((h) => (
//                   <th
//                     key={h}
//                     className="px-4 py-3 text-left text-xs font-semibold tracking-wide bg-[#F8F8F8]"
//                     style={{ color: 'var(--kp-base-font)' }}
//                   >
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {notifications.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="text-center py-16 text-gray-400 text-sm"
//                   >
//                     No notifications found
//                   </td>
//                 </tr>
//               ) : (
//                 notifications.map((n, idx) => {
//                   const { date, time } = formatDate(n.scheduleAt)
//                   const siNo = (page - 1) * limit + idx + 1
//                   return (
//                     <tr
//                       key={n._id}
//                       className="border-b hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-4 py-4 text-gray-500 ">{siNo}</td>
//                       <td className="px-4 py-4 whitespace-nowrap">
//                         <div className="font-medium text-gray-800">
//                           {date} {time}
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 font-medium text-gray-800">
//                         {n.title}
//                       </td>
//                       <td className="px-4 py-4 text-gray-600 max-w-xs">
//                         <p className="line-clamp-2 leading-snug">{n.message}</p>
//                       </td>

//                       <td className="px-4 py-4">
//                         <div className="flex items-center gap-1.5">
//                           {/* View */}
//                           <button
//                             onClick={() => {
//                               setViewItem(n)
//                               setViewOpen(true)
//                             }}
//                             className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
//                             title="View"
//                           >
//                             <Eye size={15} />
//                           </button>
//                           {/* Edit */}
//                           <button
//                             onClick={() => openEdit(n)}
//                             className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-teal-700 transition-colors"
//                             title="Edit"
//                           >
//                             <Pencil size={15} />
//                           </button>
//                           {/* Delete */}
//                           <button
//                             onClick={() => setDeleteId(n._id)}
//                             className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
//                             title="Delete"
//                           >
//                             <Trash2 size={15} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                 })
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* ── Pagination ── */}
//       {!isLoading && (
//         <Pagination
//           currentPage={page}
//           totalPages={totalPages}
//           totalItems={totalItems}
//           itemsPerPage={limit}
//           onPageChange={setPage}
//           onLimitChange={(l) => {
//             setLimit(l)
//             setPage(1)
//           }}
//           className="p-4 bg-gray-50 border-t"
//         />
//       )}

//       {/* ════════════════════════════════════════════
//           ADD NOTIFICATION DIALOG
//       ════════════════════════════════════════════ */}
//       <Dialog open={addOpen} onOpenChange={setAddOpen}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center justify-between">
//               <div>
//                 <p className="text-base font-semibold">
//                   Add Customer Notification
//                 </p>
//                 <p className="text-xs text-gray-400 font-normal mt-0.5">
//                   {new Date().toLocaleDateString('en-GB', {
//                     day: '2-digit',
//                     month: 'short',
//                     year: 'numeric',
//                   })}
//                 </p>
//               </div>
//             </DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4 mt-2">
//             {addForms.map((form, i) => (
//               <div
//                 key={i}
//                 className="border rounded-lg p-4 relative bg-gray-50"
//               >
//                 {addForms.length > 1 && (
//                   <button
//                     onClick={() => removeRow(i)}
//                     className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors"
//                   >
//                     <X size={14} />
//                   </button>
//                 )}

//                 <div className="grid grid-cols-2 gap-3 mb-3">
//                   {/* Heading */}
//                   <div className="space-y-1">
//                     <Label className="text-xs text-gray-600">
//                       Heading Text <span className="text-red-400">*</span>
//                     </Label>
//                     <Input
//                       placeholder="Notification title"
//                       value={form.title}
//                       onChange={(e) => updateRow(i, 'title', e.target.value)}
//                       className="h-9 text-sm"
//                     />
//                   </div>
//                   {/* Message */}
//                   <div className="space-y-1">
//                     <Label className="text-xs text-gray-600">Message</Label>
//                     <Input
//                       placeholder="Short message"
//                       value={form.message}
//                       onChange={(e) => updateRow(i, 'message', e.target.value)}
//                       className="h-9 text-sm"
//                     />
//                   </div>
//                   {/* Date */}
//                   <div className="space-y-1">
//                     <Label className="text-xs text-gray-600">
//                       Date <span className="text-red-400">*</span>
//                     </Label>
//                     <Input
//                       type="date"
//                       value={form.date}
//                       onChange={(e) => updateRow(i, 'date', e.target.value)}
//                       className="h-9 text-sm"
//                     />
//                   </div>
//                   {/* Time */}
//                   <div className="space-y-1">
//                     <Label className="text-xs text-gray-600">
//                       Time <span className="text-red-400">*</span>
//                     </Label>
//                     <Input
//                       type="time"
//                       value={form.time}
//                       onChange={(e) => updateRow(i, 'time', e.target.value)}
//                       className="h-9 text-sm"
//                     />
//                   </div>
//                 </div>

//                 {/* Image URL */}
//                 <div className="space-y-1">
//                   <Label className="text-xs text-gray-600">Image URL</Label>
//                   <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white text-sm text-gray-400 cursor-text">
//                     <Upload size={14} />
//                     <input
//                       className="flex-1 outline-none bg-transparent text-gray-700 placeholder:text-gray-400 text-sm"
//                       placeholder="https://..."
//                       value={form.imgUrl}
//                       onChange={(e) => updateRow(i, 'imgUrl', e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {/* Add another row */}
//             <button
//               onClick={addRow}
//               className="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-gray-400 hover:border-teal-300 hover:text-teal-600 transition-colors flex items-center justify-center gap-1.5"
//             >
//               <Plus size={14} />
//               Add another notification
//             </button>
//           </div>

//           <div className="flex justify-end gap-2 pt-2 border-t mt-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setAddOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               size="sm"
//               disabled={createMutation.isPending}
//               onClick={handleAddSubmit}
//               style={{
//                 background: 'var(--kp-gold)',
//                 color: '#1a1a1a',
//                 border: 'none',
//               }}
//             >
//               {createMutation.isPending
//                 ? 'Adding…'
//                 : `+ Add${addForms.length > 1 ? ` (${addForms.length})` : ''}`}
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* ════════════════════════════════════════════
//           BULK UPLOAD DIALOG
//       ════════════════════════════════════════════ */}
//       <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Bulk Upload Notifications</DialogTitle>
//           </DialogHeader>

//           <div className="mt-2 space-y-4">
//             <p className="text-xs text-gray-500">
//               Upload an Excel file (.xlsx / .xls) with columns:
//               <span className="font-mono bg-gray-100 px-1 rounded ml-1">
//                 Date, Time, Title, Message, ImgUrl
//               </span>
//             </p>

//             {/* Drop zone */}
//             <div
//               onClick={() => bulkInputRef.current?.click()}
//               className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-teal-400 hover:bg-teal-50"
//               style={{ borderColor: bulkFile ? 'var(--kp-gold)' : '' }}
//             >
//               <Upload size={28} className="mx-auto text-gray-300 mb-3" />
//               {bulkFile ? (
//                 <div>
//                   <p className="text-sm font-medium text-gray-700">
//                     {bulkFile.name}
//                   </p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     {(bulkFile.size / 1024).toFixed(1)} KB
//                   </p>
//                 </div>
//               ) : (
//                 <div>
//                   <p className="text-sm text-gray-500">
//                     Click to select Excel file
//                   </p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     .xlsx or .xls only
//                   </p>
//                 </div>
//               )}
//               <input
//                 ref={bulkInputRef}
//                 type="file"
//                 accept=".xlsx,.xls"
//                 className="hidden"
//                 onChange={(e) => setBulkFile(e.target.files?.[0] ?? null)}
//               />
//             </div>

//             {bulkFile && (
//               <button
//                 onClick={() => setBulkFile(null)}
//                 className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
//               >
//                 <X size={12} /> Remove file
//               </button>
//             )}
//           </div>

//           <div className="flex justify-end gap-2 pt-2 border-t mt-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => {
//                 setBulkOpen(false)
//                 setBulkFile(null)
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               size="sm"
//               disabled={!bulkFile || bulkMutation.isPending}
//               onClick={() => bulkFile && bulkMutation.mutate(bulkFile)}
//               style={{
//                 background: 'var(--kp-gold)',
//                 color: '#1a1a1a',
//                 border: 'none',
//               }}
//             >
//               {bulkMutation.isPending ? 'Uploading…' : 'Upload'}
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* ════════════════════════════════════════════
//           VIEW DIALOG
//       ════════════════════════════════════════════ */}
//       <Dialog open={viewOpen} onOpenChange={setViewOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Notification Details</DialogTitle>
//           </DialogHeader>
//           {viewItem && (
//             <div className="space-y-3 mt-2 text-sm">
//               {viewItem.imgUrl && (
//                 <img
//                   src={viewItem.imgUrl}
//                   alt=""
//                   className="w-full h-40 object-cover rounded-lg border"
//                 />
//               )}
//               <div>
//                 <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
//                   Title
//                 </p>
//                 <p className="font-semibold text-gray-800">{viewItem.title}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
//                   Message
//                 </p>
//                 <p className="text-gray-600 leading-relaxed">
//                   {viewItem.message || '—'}
//                 </p>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
//                     Date
//                   </p>
//                   <p className="text-gray-700">{viewItem.date}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
//                     Time
//                   </p>
//                   <p className="text-gray-700">{viewItem.time}</p>
//                 </div>
//               </div>
//               <div>
//                 <span
//                   className={`inline-flex text-xs px-2.5 py-1 rounded-full font-medium ${
//                     viewItem.isSent
//                       ? 'bg-green-100 text-green-700'
//                       : 'bg-yellow-100 text-yellow-700'
//                   }`}
//                 >
//                   {viewItem.isSent ? 'Sent' : 'Pending'}
//                 </span>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* ════════════════════════════════════════════
//           EDIT DIALOG
//       ════════════════════════════════════════════ */}
//       <Dialog open={editOpen} onOpenChange={setEditOpen}>
//         <DialogContent className="max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Edit Notification</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-3 mt-2">
//             <div className="grid grid-cols-2 gap-3">
//               <div className="space-y-1">
//                 <Label className="text-xs text-gray-600">Heading Text</Label>
//                 <Input
//                   value={editForm.title}
//                   onChange={(e) =>
//                     setEditForm((f) => ({ ...f, title: e.target.value }))
//                   }
//                   className="h-9 text-sm"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <Label className="text-xs text-gray-600">Message</Label>
//                 <Input
//                   value={editForm.message}
//                   onChange={(e) =>
//                     setEditForm((f) => ({ ...f, message: e.target.value }))
//                   }
//                   className="h-9 text-sm"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <Label className="text-xs text-gray-600">Date</Label>
//                 <Input
//                   type="date"
//                   value={editForm.date}
//                   onChange={(e) =>
//                     setEditForm((f) => ({ ...f, date: e.target.value }))
//                   }
//                   className="h-9 text-sm"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <Label className="text-xs text-gray-600">Time</Label>
//                 <Input
//                   type="time"
//                   value={editForm.time}
//                   onChange={(e) =>
//                     setEditForm((f) => ({ ...f, time: e.target.value }))
//                   }
//                   className="h-9 text-sm"
//                 />
//               </div>
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-gray-600">Image URL</Label>
//               <Input
//                 placeholder="https://..."
//                 value={editForm.imgUrl}
//                 onChange={(e) =>
//                   setEditForm((f) => ({ ...f, imgUrl: e.target.value }))
//                 }
//                 className="h-9 text-sm"
//               />
//             </div>
//           </div>
//           <div className="flex justify-end gap-2 pt-2 border-t mt-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setEditOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               size="sm"
//               disabled={updateMutation.isPending}
//               onClick={() =>
//                 editItem &&
//                 updateMutation.mutate({ id: editItem._id, data: editForm })
//               }
//               style={{
//                 background: 'var(--kp-gold)',
//                 color: '#1a1a1a',
//                 border: 'none',
//               }}
//             >
//               {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* ════════════════════════════════════════════
//           DELETE CONFIRM
//       ════════════════════════════════════════════ */}
//       <AlertDialog
//         open={!!deleteId}
//         onOpenChange={(o) => !o && setDeleteId(null)}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Notification</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will permanently delete this notification. This action cannot
//               be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               className="bg-red-600 hover:bg-red-700 text-white"
//               disabled={deleteMutation.isPending}
//               onClick={() => {
//                 if (deleteId) {
//                   deleteMutation.mutate(deleteId, {
//                     onSettled: () => setDeleteId(null),
//                   })
//                 }
//               }}
//             >
//               {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   )
// }
import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { _axios } from '@/lib/axios'
import { toast } from 'sonner'
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Upload,
  X,
  ExternalLink,
  Calendar,
  Search,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination } from '@/components/Pagination'
import * as XLSX from 'xlsx'

export const Route = createFileRoute('/notifications/')({
  component: NotificationPage,
})

// ─── Types ────────────────────────────────────────────────────────
interface Notification {
  _id: string
  date: string
  time: string
  scheduleAt: string
  title: string
  message: string
  imgUrl?: string
  isSent: boolean
}

interface NotificationForm {
  date: string
  time: string
  title: string
  message: string
  imgUrl: string
}

// today string for min date
const todayStr = () => new Date().toISOString().split('T')[0]

const emptyForm = (): NotificationForm => ({
  date: todayStr(),
  time: '09:00',
  title: '',
  message: '',
  imgUrl: '',
})

// ─── Table Skeleton ───────────────────────────────────────────────
function TableSkeleton() {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-[#F8F8F8] border-b">
          {['SI NO', 'DATE & TIME', 'TITLE / HEADING', 'MESSAGE', 'ACTION'].map(
            (h) => (
              <th key={h} className="px-3 py-2 text-left">
                <Skeleton className="h-3.5 w-20" />
              </th>
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 6 }).map((_, i) => (
          <tr key={i} className="border-b">
            <td className="px-3 py-2">
              <Skeleton className="h-3.5 w-6" />
            </td>
            <td className="px-3 py-2">
              <Skeleton className="h-3.5 w-28" />
            </td>
            <td className="px-3 py-2">
              <Skeleton className="h-3.5 w-32" />
            </td>
            <td className="px-3 py-2">
              <Skeleton className="h-3.5 w-full" />
            </td>
            <td className="px-3 py-2">
              <div className="flex gap-1.5">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-6 rounded" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ─── Format date ──────────────────────────────────────────────────
function formatScheduleAt(scheduleAt: string) {
  const d = new Date(scheduleAt)
  const date = d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata', // ← add this
  })
  const time = d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata', // ← add this
  })
  return `${date} ${time}`
}

// ─── Download sample Excel ────────────────────────────────────────
function downloadSampleExcel() {
  const sample = [
    {
      Date: '5/27/2026',
      Time: '10:41:33 AM',
      Title: 'Sample Notification',
      Message: 'This is a sample message',
      ImgUrl: 'https://example.com/img.jpg',
    },
    {
      Date: '5/27/2026',
      Time: '10:41:33 AM',
      Title: 'Sample Notification',
      Message: 'This is a sample message',
      ImgUrl: 'https://example.com/img.jpg',
    },
    {
      Date: '5/27/2026',
      Time: '10:41:33 AM',
      Title: 'Sample Notification',
      Message: 'This is a sample message',
      ImgUrl: '',
    },
  ]
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(sample, {
    header: ['Date', 'Time', 'Title', 'Message', 'ImgUrl'],
  })
  ws['!cols'] = [
    { wch: 14 },
    { wch: 12 },
    { wch: 24 },
    { wch: 36 },
    { wch: 36 },
  ]
  XLSX.utils.book_append_sheet(wb, ws, 'Notifications')
  XLSX.writeFile(wb, 'notification_sample.xlsx')
}

// ─── Main Page ────────────────────────────────────────────────────
function NotificationPage() {
  const queryClient = useQueryClient()

  // pagination
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  // date range filter
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // modals
  const [addOpen, setAddOpen] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [viewItem, setViewItem] = useState<Notification | null>(null)
  const [editItem, setEditItem] = useState<Notification | null>(null)

  // add form — array of rows
  const [addForms, setAddForms] = useState<NotificationForm[]>([emptyForm()])

  // edit form
  const [editForm, setEditForm] = useState<NotificationForm>(emptyForm())

  // bulk upload
  const [bulkFile, setBulkFile] = useState<File | null>(null)
  const bulkInputRef = useRef<HTMLInputElement>(null)

  // ── Fetch ──────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ['notifications', page, limit, fromDate, toDate],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(limit),
      }
      if (fromDate) params.fromDate = fromDate
      if (toDate) params.toDate = toDate
      const res = await _axios.get('/admin/bulk-notification/notifications', {
        params,
      })
      return res.data
    },
  })

  const notifications: Notification[] = data?.data ?? []
  const totalPages = data?.pagination?.totalPages ?? 1
  const totalItems = data?.pagination?.total ?? 0

  // ── Create ────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (items: NotificationForm[]) =>
      _axios.post(
        '/admin/bulk-notification/create',
        items.map((f) => ({
          date: f.date,
          time: f.time,
          title: f.title,
          message: f.message,
          imgUrl: f.imgUrl,
        })),
      ),
    onSuccess: (_, items) => {
      toast.success(
        `${items.length} notification${items.length > 1 ? 's' : ''} added`,
      )
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      setAddOpen(false)
      setAddForms([emptyForm()])
    },
    onError: () => toast.error('Failed to add notifications'),
  })

  // ── Update ────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: NotificationForm }) =>
      _axios.put(`/admin/bulk-notification/${id}`, data),
    onSuccess: () => {
      toast.success('Notification updated')
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      setEditOpen(false)
    },
    onError: () => toast.error('Failed to update'),
  })

  // ── Delete ────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => _axios.delete(`/admin/bulk-notification/${id}`),
    onSuccess: () => {
      toast.success('Notification deleted')
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: () => toast.error('Failed to delete'),
  })

  // ── Bulk upload ───────────────────────────────────────────────
  const bulkMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData()
      fd.append('file', file)
      return _axios.post('/admin/bulk-notification/upload-excel', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: (res) => {
      toast.success(res.data?.message ?? 'Bulk upload successful')
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      setBulkOpen(false)
      setBulkFile(null)
    },
    onError: () => toast.error('Bulk upload failed'),
  })

  // ── Add form helpers ──────────────────────────────────────────
  const addRow = () => setAddForms((f) => [...f, emptyForm()])
  const removeRow = (i: number) =>
    setAddForms((f) => f.filter((_, idx) => idx !== i))
  const updateRow = (i: number, key: keyof NotificationForm, val: string) =>
    setAddForms((f) =>
      f.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)),
    )

  const handleAddSubmit = () => {
    const valid = addForms.filter((f) => f.title && f.date && f.time)
    if (!valid.length)
      return toast.error(
        'Fill at least one notification with title, date & time',
      )
    createMutation.mutate(valid)
  }

  const openEdit = (n: Notification) => {
    setEditItem(n)
    setEditForm({
      date: n.date,
      time: n.time,
      title: n.title,
      message: n.message,
      imgUrl: n.imgUrl ?? '',
    })
    setEditOpen(true)
  }

  const handleClearFilter = () => {
    setFromDate('')
    setToDate('')
    setPage(1)
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-full">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b gap-3 flex-wrap">
        <h2 className="text-base font-semibold text-gray-800 hidden"></h2>

        {/* Date range filter */}
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <div className="flex items-center gap-1.5 bg-gray-50 border rounded-lg px-3 py-1.5">
            <Calendar size={13} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-400 shrink-0">From</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value)
                setPage(1)
              }}
              className="text-xs text-gray-700 bg-transparent border-none outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 border rounded-lg px-3 py-1.5">
            <Calendar size={13} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-400 shrink-0">To</span>
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => {
                setToDate(e.target.value)
                setPage(1)
              }}
              className="text-xs text-gray-700 bg-transparent border-none outline-none"
            />
          </div>
          {(fromDate || toDate) && (
            <button
              onClick={handleClearFilter}
              className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
            >
              <X size={11} /> Clear
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs h-8 cursor-pointer"
            style={{ color: 'var(--kp-base-font)' }}
            onClick={() => setBulkOpen(true)}
          >
            <Upload size={13} />
            Bulk Upload
          </Button>
          <Button
            size="sm"
            className="gap-1.5 text-xs h-8 cursor-pointer"
            style={{
              background: '#EDDCA2',
              color: 'var(--kp-base-font)',
              border: 'none',
            }}
            onClick={() => {
              setAddForms([emptyForm()])
              setAddOpen(true)
            }}
          >
            <Plus size={13} />
            Add Notification
          </Button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-x-auto">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#F8F8F8] border-b">
                {[
                  'SI NO',
                  'DATE & TIME',
                  'TITLE / HEADING',
                  'MESSAGE',
                  'ACTION',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left text-xs font-semibold tracking-wide whitespace-nowrap"
                    style={{ color: 'var(--kp-base-font, #c9a227)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notifications.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-14 text-gray-400 text-sm"
                  >
                    No notifications found
                  </td>
                </tr>
              ) : (
                notifications.map((n, idx) => {
                  const siNo = (page - 1) * limit + idx + 1
                  return (
                    <tr
                      key={n._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      {/* SI NO */}
                      <td className="px-3 py-1.5 text-gray-500 text-xs w-12 whitespace-nowrap">
                        {siNo}
                      </td>
                      {/* DATE & TIME */}
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-700 w-40">
                        {formatScheduleAt(n.scheduleAt)}
                      </td>
                      {/* TITLE */}
                      <td className="px-3 py-1.5 text-xs font-medium text-gray-800 w-48">
                        <p className="line-clamp-1">{n.title}</p>
                      </td>
                      {/* MESSAGE — wider, 2 lines */}
                      <td
                        className="px-3 py-1.5 text-xs text-gray-600"
                        style={{ minWidth: 280 }}
                      >
                        <p className="line-clamp-2 leading-relaxed">
                          {n.message || '—'}
                        </p>
                      </td>
                      {/* ACTION */}
                      <td className="px-3 py-1.5 w-24">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setViewItem(n)
                              setViewOpen(true)
                            }}
                            className="p-1 rounded cursor-pointer  hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => openEdit(n)}
                            className="p-1 cursor-pointer   rounded hover:bg-gray-100 text-gray-400 hover:text-teal-700 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteId(n._id)}
                            className="p-1 rounded cursor-pointer  hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ── */}
      {!isLoading && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={limit}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l)
            setPage(1)
          }}
          className="p-4 bg-gray-50 border-t"
        />
      )}

      {/* ════════════════════════════════════════════
          ADD NOTIFICATION DIALOG
      ════════════════════════════════════════════ */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              <p className="text-base font-semibold">
                Add Customer Notification
              </p>
              <p className="text-xs text-gray-400 font-normal mt-0.5">
                {new Date().toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            {addForms.map((form, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 relative bg-gray-50 space-y-3"
              >
                {addForms.length > 1 && (
                  <button
                    onClick={() => removeRow(i)}
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={13} />
                  </button>
                )}

                {/* Row 1: Date + Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">
                      Date <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={form.date}
                      min={todayStr()} // ← disable past dates
                      onChange={(e) => updateRow(i, 'date', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">
                      Time <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      type="time"
                      value={form.time}
                      onChange={(e) => updateRow(i, 'time', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                {/* Row 2: Title */}
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">
                    Heading Text <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    placeholder="Notification title"
                    value={form.title}
                    onChange={(e) => updateRow(i, 'title', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                {/* Row 3: Message as textarea */}
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Message</Label>
                  <Textarea
                    placeholder="Write the notification message..."
                    value={form.message}
                    onChange={(e) => updateRow(i, 'message', e.target.value)}
                    className="text-xs min-h-[72px] resize-none"
                  />
                </div>

                {/* Row 4: Image URL + open link button */}
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Image URL</Label>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-2 border rounded-md px-3 py-1.5 bg-white flex-1">
                      <Upload size={12} className="text-gray-400 shrink-0" />
                      <input
                        className="flex-1 outline-none bg-transparent text-gray-700 placeholder:text-gray-400 text-xs"
                        placeholder="https://..."
                        value={form.imgUrl}
                        onChange={(e) => updateRow(i, 'imgUrl', e.target.value)}
                      />
                    </div>
                    {/* Open in new tab */}
                    <button
                      type="button"
                      disabled={!form.imgUrl}
                      onClick={() =>
                        form.imgUrl && window.open(form.imgUrl, '_blank')
                      }
                      className="p-1.5 border rounded-md hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Open image in new tab"
                    >
                      <ExternalLink size={13} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add another row */}
            <button
              onClick={addRow}
              className="w-full border-2 border-dashed border-gray-200 rounded-lg py-2.5 text-xs text-gray-400 hover:border-teal-300 hover:text-teal-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus size={13} />
              Add another notification
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t mt-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 cursor-pointer"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="text-xs h-8 cursor-pointer"
              disabled={createMutation.isPending}
              onClick={handleAddSubmit}
              style={{
                background: 'var(--kp-gold)',
                color: '#1a1a1a',
                border: 'none',
              }}
            >
              {createMutation.isPending
                ? 'Adding…'
                : `+ Add${addForms.length > 1 ? ` (${addForms.length})` : ''}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════
          BULK UPLOAD DIALOG
      ════════════════════════════════════════════ */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Upload Notifications</DialogTitle>
          </DialogHeader>

          <div className="mt-2 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs text-gray-500 leading-relaxed">
                Upload an Excel file with columns:
                <span className="font-mono bg-gray-100 px-1 rounded ml-1">
                  Date, Time, Title, Message, ImgUrl
                </span>
              </p>
              {/* Download sample */}
              <button
                onClick={downloadSampleExcel}
                className="shrink-0 flex cursor-pointer  items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50 whitespace-nowrap"
                style={{
                  color: 'var(--kp-gold, #c9a227)',
                  borderColor: 'var(--kp-gold, #c9a227)',
                }}
              >
                <Upload size={11} />
                Sample Excel
              </button>
            </div>

            {/* Drop zone */}
            <div
              onClick={() => bulkInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-teal-400 hover:bg-teal-50"
              style={{ borderColor: bulkFile ? 'var(--kp-gold)' : '' }}
            >
              <Upload size={26} className="mx-auto text-gray-300 mb-3" />
              {bulkFile ? (
                <>
                  <p className="text-sm font-medium text-gray-700">
                    {bulkFile.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {(bulkFile.size / 1024).toFixed(1)} KB
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-500">
                    Click to select Excel file
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    .xlsx or .xls only
                  </p>
                </>
              )}
              <input
                ref={bulkInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => setBulkFile(e.target.files?.[0] ?? null)}
              />
            </div>

            {bulkFile && (
              <button
                onClick={() => setBulkFile(null)}
                className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
              >
                <X size={11} /> Remove file
              </button>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t mt-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 cursor-pointer"
              onClick={() => {
                setBulkOpen(false)
                setBulkFile(null)
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="text-xs h-8 cursor-pointer"
              disabled={!bulkFile || bulkMutation.isPending}
              onClick={() => bulkFile && bulkMutation.mutate(bulkFile)}
              style={{
                background: 'var(--kp-gold)',
                color: '#1a1a1a',
                border: 'none',
              }}
            >
              {bulkMutation.isPending ? 'Uploading…' : 'Upload'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════
          VIEW DIALOG
      ════════════════════════════════════════════ */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-3 mt-2 text-sm">
              {viewItem.imgUrl && (
                <img
                  src={viewItem.imgUrl}
                  alt=""
                  className="w-full h-40 object-cover rounded-lg border"
                />
              )}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Title
                </p>
                <p className="font-semibold text-gray-800">{viewItem.title}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Message
                </p>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {viewItem.message || '—'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Date
                  </p>
                  <p className="text-gray-700 text-xs">{viewItem.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Time
                  </p>
                  <p className="text-gray-700 text-xs">{viewItem.time}</p>
                </div>
              </div>
              <span
                className={`inline-flex text-xs px-2.5 py-1 rounded-full font-medium ${viewItem.isSent ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
              >
                {viewItem.isSent ? 'Sent' : 'Pending'}
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════
          EDIT DIALOG
      ════════════════════════════════════════════ */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-gray-600">Date</Label>
                <Input
                  type="date"
                  disabled={editOpen}
                  value={editForm.date}
                  min={todayStr()}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, date: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-600">Time</Label>
                <Input
                  type="time"
                  disabled={editOpen}
                  value={editForm.time}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, time: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-600">Heading Text</Label>
              <Input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, title: e.target.value }))
                }
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-600">Message</Label>
              <Textarea
                value={editForm.message}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, message: e.target.value }))
                }
                className="text-xs min-h-[72px] resize-none"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-600">Image URL</Label>
              <div className="flex items-center gap-1.5">
                <Input
                  placeholder="https://..."
                  value={editForm.imgUrl}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, imgUrl: e.target.value }))
                  }
                  className="h-8 text-xs flex-1"
                />
                <button
                  type="button"
                  disabled={!editForm.imgUrl}
                  onClick={() =>
                    editForm.imgUrl && window.open(editForm.imgUrl, '_blank')
                  }
                  className="p-1.5 border rounded-md hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Open image in new tab"
                >
                  <ExternalLink size={13} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t mt-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 cursor-pointer"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="text-xs h-8 cursor-pointer"
              disabled={updateMutation.isPending}
              onClick={() =>
                editItem &&
                updateMutation.mutate({ id: editItem._id, data: editForm })
              }
              style={{
                background: 'var(--kp-gold)',
                color: '#1a1a1a',
                border: 'none',
              }}
            >
              {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════
          DELETE CONFIRM
      ════════════════════════════════════════════ */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this notification. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleteId &&
                deleteMutation.mutate(deleteId, {
                  onSettled: () => setDeleteId(null),
                })
              }
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
