// import React, { useState, useEffect, useRef } from "react"
// import { useQuery } from "@tanstack/react-query"
// import { _axios } from "@/lib/axios"
// import { useAuth } from "@/lib/useAuth"
// import { toast } from "sonner"
// import { Tag, Copy, Check, ChevronLeft, ChevronRight, Calendar, AlertCircle, Sparkles, Package } from "lucide-react"

// export interface ICoupon {
//   _id: string
//   title: string
//   description?: string
//   couponCode: string
//   bannerImage: string
//   discountType: "PERCENTAGE" | "FIXED_AMOUNT"
//   discountValue: number
//   minimumBookingAmount: number
//   maximumDiscountAmount?: number
//   totalUsageLimit: number
//   perUserUsageLimit: number
//   usedCount: number
//   applicableFor: "ALL" | "STANDARD" | "CUSTOMIZED" | "SELECTED"
//   packageIds?: { _id: string; title: string; destination: string }[]
//   userType: "ALL_USERS" | "NEW_USERS" | "EXISTING_USERS" | "SELECTED_USERS"
//   validFrom: string
//   validTo: string
// }

// export const CouponShowcase: React.FC = () => {
//   const { user } = useAuth()
//   const [activeIndex, setActiveIndex] = useState(0)
//   const [copiedCode, setCopiedCode] = useState<string | null>(null)
//   const touchStartX = useRef<number | null>(null)

//   // Fetch active/applicable coupons dynamically
//   const { data: coupons = [], isLoading, isError } = useQuery<ICoupon[]>({
//     queryKey: ["active-coupons", user?._id],
//     queryFn: async () => {
//       const res = await _axios.get("/coupon/active")
//       return res.data?.data || []
//     },
//   })

//   // Handle auto-sliding
//   useEffect(() => {
//     if (coupons.length <= 1) return
//     const interval = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % coupons.length)
//     }, 6000)
//     return () => clearInterval(interval)
//   }, [activeIndex, coupons.length])

//   // Handle mobile swipe actions
//   const handleTouchStart = (e: React.TouchEvent) => {
//     touchStartX.current = e.touches[0].clientX
//   }

//   const handleTouchEnd = (e: React.TouchEvent) => {
//     if (touchStartX.current === null || coupons.length <= 1) return
//     const touchEndX = e.changedTouches[0].clientX
//     const diffX = touchStartX.current - touchEndX

//     if (diffX > 50) {
//       // Swipe left -> Next coupon
//       setActiveIndex((prev) => (prev + 1) % coupons.length)
//     } else if (diffX < -50) {
//       // Swipe right -> Prev coupon
//       setActiveIndex((prev) => (prev - 1 + coupons.length) % coupons.length)
//     }
//     touchStartX.current = null
//   }

//   const handlePrev = () => {
//     if (coupons.length <= 1) return
//     setActiveIndex((prev) => (prev - 1 + coupons.length) % coupons.length)
//   }

//   const handleNext = () => {
//     if (coupons.length <= 1) return
//     setActiveIndex((prev) => (prev + 1) % coupons.length)
//   }

//   const handleCopyCode = (code: string) => {
//     navigator.clipboard.writeText(code)
//     setCopiedCode(code)
//     toast.success(`Coupon code "${code}" copied to clipboard!`)
//     setTimeout(() => setCopiedCode(null), 2000)
//   }

//   if (isLoading) {
//     return (
//       <div className="w-full flex items-center justify-center p-8 bg-neutral-50 rounded-2xl border border-neutral-200 animate-pulse h-[220px]">
//         <div className="flex flex-col items-center gap-3">
//           <Tag className="w-8 h-8 text-neutral-400 animate-bounce" />
//           <span className="text-sm font-medium text-neutral-400">Loading exclusive offers...</span>
//         </div>
//       </div>
//     )
//   }

//   if (isError || coupons.length === 0) {
//     return null // Do not render component if there are no active coupons
//   }

//   const fontSans = "'Inter', sans-serif"
//   const fontHeading = "'Libre Baskerville', serif"

//   return (
//     <div className="relative w-full mb-9 select-none" style={{ fontFamily: fontSans }}>
//       {/* Slider Container */}
//       <div
//         className="w-full overflow-hidden rounded-2xl shadow-xl shadow-indigo-950/5 relative"
//         onTouchStart={handleTouchStart}
//         onTouchEnd={handleTouchEnd}
//       >
//         <div
//           className="flex transition-transform duration-700 ease-out"
//           style={{
//             transform: `translateX(-${activeIndex * 100}%)`,
//             width: `${coupons.length * 100}%`
//           }}
//         >
//           {coupons.map((coupon) => {
//             const isNewUser = coupon.userType === "NEW_USERS"
//             const formattedDate = new Date(coupon.validTo).toLocaleDateString("en-IN", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric",
//             })

//             return (
//               <div
//                 key={coupon._id}
//                 className="w-full flex-shrink-0"
//                 style={{ width: `${100 / coupons.length}%` }}
//               >
//                 {/* Premium Card Structure */}
//                 <div className="flex flex-col md:flex-row bg-slate-950 text-white min-h-[220px] rounded-2xl overflow-hidden relative border border-slate-800">
//                   {/* Coupon Left Banner (Visual Section) */}
//                   <div className="w-full md:w-[35%] relative h-[140px] md:h-auto overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-800">
//                     {coupon.bannerImage ? (
//                       <img
//                         src={coupon.bannerImage}
//                         alt={coupon.title}
//                         className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
//                       />
//                     ) : (
//                       <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-800 to-slate-900 text-center">
//                         <Tag className="w-10 h-10 text-indigo-400 mb-2" />
//                         <span className="text-xs tracking-widest text-indigo-200 uppercase font-semibold">Special Offer</span>
//                       </div>
//                     )}

//                     {/* Floating Value Tag */}
//                     <div className="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg border border-indigo-400/20">
//                       {coupon.discountType === "PERCENTAGE" ? (
//                         <span>{coupon.discountValue}% OFF</span>
//                       ) : (
//                         <span>₹{coupon.discountValue.toLocaleString("en-IN")} OFF</span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Coupon Right (Details Section) */}
//                   <div className="w-full md:w-[65%] p-5 md:p-6 flex flex-col justify-between relative bg-gradient-to-br from-slate-900 to-slate-950">

//                     {/* Details Header */}
//                     <div>
//                       <div className="flex flex-wrap items-center gap-2 mb-2">
//                         {/* New User Badge */}
//                         {isNewUser && (
//                           <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
//                             <Sparkles className="w-3 h-3" /> New User Only
//                           </span>
//                         )}

//                         {/* Category/Package Restrictions Badge */}
//                         {coupon.applicableFor === "STANDARD" && (
//                           <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-wider">
//                             Standard Packages
//                           </span>
//                         )}
//                         {coupon.applicableFor === "CUSTOMIZED" && (
//                           <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">
//                             Customized Packages
//                           </span>
//                         )}
//                         {coupon.applicableFor === "SELECTED" && (
//                           <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider" title={coupon.packageIds?.map(p => p.title).join(", ")}>
//                             <Package className="w-3 h-3" /> Specific Packages Only
//                           </span>
//                         )}
//                       </div>

//                       <h3
//                         className="text-lg md:text-xl font-bold text-white leading-tight mb-1"
//                         style={{ fontFamily: fontHeading }}
//                       >
//                         {coupon.title}
//                       </h3>

//                       {coupon.description && (
//                         <p className="text-xs text-slate-400 line-clamp-2 mb-3">
//                           {coupon.description}
//                         </p>
//                       )}
//                     </div>

//                     {/* Ticket notch cutouts */}
//                     <div className="hidden md:block absolute -left-[12px] top-[50%] -translate-y-[50%] w-6 h-6 rounded-full bg-[#FAF8F4] border-r border-slate-800 shadow-[inset_-3px_0_3px_rgba(0,0,0,0.06)] z-10"></div>
//                     <div className="hidden md:block absolute -right-[12px] top-[50%] -translate-y-[50%] w-6 h-6 rounded-full bg-[#FAF8F4] border-l border-slate-800 shadow-[inset_3px_0_3px_rgba(0,0,0,0.06)] z-10"></div>

//                     {/* Divider details separator */}
//                     <div className="border-t border-dashed border-slate-800 my-3 relative"></div>

//                     {/* Details Footer Actions */}
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                       {/* Left: Metadata */}
//                       <div className="flex flex-col gap-1.5">
//                         <div className="flex items-center gap-4 text-[11px] text-slate-400">
//                           {coupon.minimumBookingAmount > 0 && (
//                             <span className="flex items-center gap-1">
//                               <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
//                               Min Booking: <strong>₹{coupon.minimumBookingAmount.toLocaleString("en-IN")}</strong>
//                             </span>
//                           )}
//                           {coupon.maximumDiscountAmount !== undefined && coupon.maximumDiscountAmount > 0 && (
//                             <span className="flex items-center gap-1">
//                               <Tag className="w-3.5 h-3.5 text-slate-500" />
//                               Max Discount: <strong>₹{coupon.maximumDiscountAmount.toLocaleString("en-IN")}</strong>
//                             </span>
//                           )}
//                         </div>
//                         <span className="flex items-center gap-1 text-[11px] text-slate-400">
//                           <Calendar className="w-3.5 h-3.5 text-slate-500" />
//                           Valid Until: <strong>{formattedDate}</strong>
//                         </span>
//                       </div>

//                       {/* Right: Code Container & Copy Action */}
//                       <div className="flex items-center gap-2 self-start sm:self-auto">
//                         <div className="flex items-center bg-slate-900 border border-slate-700/60 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300">
//                           <span className="px-3.5 py-2 font-mono font-bold text-xs tracking-wider text-indigo-400 select-all">
//                             {coupon.couponCode}
//                           </span>
//                           <button
//                             onClick={() => handleCopyCode(coupon.couponCode)}
//                             className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 transition-all duration-300 border-l border-slate-700/60 flex items-center justify-center"
//                             title="Copy coupon code"
//                           >
//                             {copiedCode === coupon.couponCode ? (
//                               <Check className="w-3.5 h-3.5 text-emerald-200 animate-scale" />
//                             ) : (
//                               <Copy className="w-3.5 h-3.5" />
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             )
//           })}
//         </div>

//         {/* Carousel controls - left/right arrows */}
//         {coupons.length > 1 && (
//           <>
//             <button
//               onClick={handlePrev}
//               className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-800 text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 md:opacity-100"
//               style={{ contentVisibility: "auto" }}
//             >
//               <ChevronLeft className="w-4 h-4" />
//             </button>
//             <button
//               onClick={handleNext}
//               className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-800 text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 md:opacity-100"
//               style={{ contentVisibility: "auto" }}
//             >
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </>
//         )}
//       </div>

//       {/* Pagination dots */}
//       {coupons.length > 1 && (
//         <div className="flex justify-center items-center gap-1.5 mt-3">
//           {coupons.map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => setActiveIndex(idx)}
//               className={`h-2 rounded-full transition-all duration-300 ${
//                 activeIndex === idx ? "w-6 bg-indigo-600" : "w-2 bg-neutral-300 hover:bg-neutral-400"
//               }`}
//               aria-label={`Go to slide ${idx + 1}`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// import React, { useState, useEffect, useRef, useCallback } from "react"
// import { useQuery } from "@tanstack/react-query"
// import { _axios } from "@/lib/axios"
// import { useAuth } from "@/lib/useAuth"
// import { toast } from "sonner"
// import {
//   Copy,
//   Check,
//   ChevronLeft,
//   ChevronRight,
//   CalendarClock,
//   Sparkles,
//   Package,
//   PlaneTakeoff,
//   Ticket,
// } from "lucide-react"

// export interface ICoupon {
//   _id: string
//   title: string
//   description?: string
//   couponCode: string
//   bannerImage: string
//   discountType: "PERCENTAGE" | "FIXED_AMOUNT"
//   discountValue: number
//   minimumBookingAmount: number
//   maximumDiscountAmount?: number
//   totalUsageLimit: number
//   perUserUsageLimit: number
//   usedCount: number
//   applicableFor: "ALL" | "STANDARD" | "CUSTOMIZED" | "SELECTED"
//   packageIds?: { _id: string; title: string; destination: string }[]
//   userType: "ALL_USERS" | "NEW_USERS" | "EXISTING_USERS" | "SELECTED_USERS"
//   validFrom: string
//   validTo: string
// }

// const SLIDE_DURATION_MS = 6000

// const applicabilityLabel: Record<ICoupon["applicableFor"], string | null> = {
//   ALL: null,
//   STANDARD: "Standard packages",
//   CUSTOMIZED: "Customized packages",
//   SELECTED: "Selected packages",
// }

// export const CouponShowcase: React.FC = () => {
//   const { user } = useAuth()
//   const [activeIndex, setActiveIndex] = useState(0)
//   const [copiedCode, setCopiedCode] = useState<string | null>(null)
//   const [isPaused, setIsPaused] = useState(false)
//   const touchStartX = useRef<number | null>(null)

//   const {
//     data: coupons = [],
//     isLoading,
//     isError,
//   } = useQuery<ICoupon[]>({
//     queryKey: ["active-coupons", user?._id],
//     queryFn: async () => {
//       const res = await _axios.get("/coupon/active")
//       return res.data?.data || []
//     },
//   })

//   const slideCount = coupons.length

//   // Keep the active index valid if the list shrinks/changes
//   useEffect(() => {
//     if (activeIndex >= slideCount && slideCount > 0) {
//       setActiveIndex(0)
//     }
//   }, [slideCount, activeIndex])

//   // Auto-advance every 6s, paused on hover/focus/touch
//   useEffect(() => {
//     if (slideCount <= 1 || isPaused) return
//     const interval = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % slideCount)
//     }, SLIDE_DURATION_MS)
//     return () => clearInterval(interval)
//   }, [slideCount, isPaused, activeIndex])

//   const goTo = useCallback(
//     (index: number) => {
//       if (slideCount === 0) return
//       setActiveIndex(((index % slideCount) + slideCount) % slideCount)
//     },
//     [slideCount]
//   )

//   const handlePrev = () => goTo(activeIndex - 1)
//   const handleNext = () => goTo(activeIndex + 1)

//   const handleTouchStart = (e: React.TouchEvent) => {
//     touchStartX.current = e.touches[0].clientX
//     setIsPaused(true)
//   }

//   const handleTouchEnd = (e: React.TouchEvent) => {
//     if (touchStartX.current === null || slideCount <= 1) {
//       setIsPaused(false)
//       return
//     }
//     const diffX = touchStartX.current - e.changedTouches[0].clientX
//     if (diffX > 50) handleNext()
//     else if (diffX < -50) handlePrev()
//     touchStartX.current = null
//     setIsPaused(false)
//   }

//   const handleCopyCode = (code: string) => {
//     navigator.clipboard.writeText(code)
//     setCopiedCode(code)
//     toast.success(`Coupon code "${code}" copied to clipboard!`)
//     setTimeout(() => setCopiedCode(null), 2000)
//   }

//   const fontSans = "'Inter', sans-serif"
//   const fontDisplay = "'Libre Baskerville', serif"

//   if (isLoading) {
//     return (
//       <div
//         className="flex h-[240px] w-full animate-pulse items-center justify-center rounded-2xl border border-[#1c3d3f]/15 bg-[#0d2b2e]/[0.03]"
//         style={{ fontFamily: fontSans }}
//       >
//         <div className="flex flex-col items-center gap-3">
//           <Ticket className="h-7 w-7 text-[#0d2b2e]/40" />
//           <span className="text-sm font-medium text-[#0d2b2e]/40">
//             Loading exclusive offers…
//           </span>
//         </div>
//       </div>
//     )
//   }

//   if (isError || slideCount === 0) {
//     return null
//   }

//   const coupon = coupons[activeIndex]
//   const isNewUser = coupon.userType === "NEW_USERS"
//   const applicability = applicabilityLabel[coupon.applicableFor]
//   const formattedDate = new Date(coupon.validTo).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   })

//   return (
//     <div
//       className="relative mb-9 w-full select-none"
//       style={{ fontFamily: fontSans }}
//     >
//       <div
//         className="group relative w-full overflow-hidden rounded-[22px] shadow-[0_18px_45px_-20px_rgba(13,43,46,0.55)]"
//         onTouchStart={handleTouchStart}
//         onTouchEnd={handleTouchEnd}
//         onMouseEnter={() => setIsPaused(true)}
//         onMouseLeave={() => setIsPaused(false)}
//         onFocus={() => setIsPaused(true)}
//         onBlur={() => setIsPaused(false)}
//       >
//         {/* Boarding-pass card */}
//         <div className="flex min-h-[230px] flex-col border border-white/5 bg-gradient-to-br from-[#0d2b2e] via-[#123b3f] to-[#0a2224] text-[#f6f1e4] sm:flex-row">
//           {/* ===== Stub (left) ===== */}
//           <div className="relative flex w-full flex-col justify-between bg-[#0a2224]/60 p-5 sm:w-[34%] sm:p-6">
//             <div>
//               <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.2em] text-[#cba135] uppercase">
//                 <PlaneTakeoff className="h-3.5 w-3.5" />
//                 Fare pass
//               </div>

//               <div
//                 className="mt-3 text-3xl leading-none font-bold text-[#f6f1e4] sm:text-4xl"
//                 style={{ fontFamily: fontDisplay }}
//               >
//                 {coupon.discountType === "PERCENTAGE"
//                   ? `${coupon.discountValue}%`
//                   : `₹${coupon.discountValue.toLocaleString("en-IN")}`}
//               </div>
//               <div className="mt-0.5 text-[11px] tracking-wide text-[#f6f1e4]/50 uppercase">
//                 off your booking
//               </div>
//             </div>

//             {/* barcode-style code strip */}
//             <div className="mt-6 sm:mt-0">
//               <div className="mb-1.5 text-[9px] tracking-[0.2em] text-[#f6f1e4]/40 uppercase">
//                 Ticket code
//               </div>
//               <button
//                 onClick={() => handleCopyCode(coupon.couponCode)}
//                 className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#cba135]/30 bg-[#f6f1e4]/[0.06] px-3 py-2.5 transition-colors duration-200 hover:border-[#cba135]/60 hover:bg-[#f6f1e4]/[0.1]"
//                 title="Copy coupon code"
//               >
//                 <span className="font-mono text-[13px] font-bold tracking-[0.15em] text-[#e9d9a8]">
//                   {coupon.couponCode}
//                 </span>
//                 {copiedCode === coupon.couponCode ? (
//                   <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
//                 ) : (
//                   <Copy className="h-3.5 w-3.5 shrink-0 text-[#cba135]" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Perforated divider */}
//           <div className="relative hidden flex-col items-center justify-between py-4 sm:flex">
//             <span className="-mt-2 h-6 w-6 shrink-0 rounded-full bg-[#FAF8F4]" />
//             <span
//               className="flex-1 border-l-2 border-dashed border-[#f6f1e4]/20"
//               aria-hidden="true"
//             />
//             <span className="-mb-2 h-6 w-6 shrink-0 rounded-full bg-[#FAF8F4]" />
//           </div>
//           <div className="flex items-center px-5 sm:hidden" aria-hidden="true">
//             <span className="-ml-7 h-4 w-4 shrink-0 rounded-full bg-[#FAF8F4]" />
//             <span className="flex-1 border-t-2 border-dashed border-[#f6f1e4]/20" />
//             <span className="-mr-7 h-4 w-4 shrink-0 rounded-full bg-[#FAF8F4]" />
//           </div>

//           {/* ===== Main panel (right) ===== */}
//           <div className="flex w-full flex-col justify-between gap-4 p-5 sm:w-[66%] sm:p-6">
//             <div>
//               <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
//                 {isNewUser && (
//                   <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-300 uppercase">
//                     <Sparkles className="h-3 w-3" /> New user only
//                   </span>
//                 )}
//                 {applicability && (
//                   <span
//                     className="inline-flex items-center gap-1 rounded-full border border-[#cba135]/25 bg-[#cba135]/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#e9d9a8] uppercase"
//                     title={
//                       coupon.applicableFor === "SELECTED"
//                         ? coupon.packageIds?.map((p) => p.title).join(", ")
//                         : undefined
//                     }
//                   >
//                     {coupon.applicableFor === "SELECTED" && (
//                       <Package className="h-3 w-3" />
//                     )}
//                     {applicability}
//                   </span>
//                 )}
//               </div>

//               <h3
//                 className="text-lg leading-snug font-bold text-[#f6f1e4] sm:text-xl"
//                 style={{ fontFamily: fontDisplay }}
//               >
//                 {coupon.title}
//               </h3>

//               {coupon.description && (
//                 <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[#f6f1e4]/55">
//                   {coupon.description}
//                 </p>
//               )}
//             </div>

//             <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-white/5 pt-3 text-[11px] text-[#f6f1e4]/50">
//               {coupon.minimumBookingAmount > 0 && (
//                 <span>
//                   Min booking{" "}
//                   <strong className="font-semibold text-[#f6f1e4]/80">
//                     ₹{coupon.minimumBookingAmount.toLocaleString("en-IN")}
//                   </strong>
//                 </span>
//               )}
//               {!!coupon.maximumDiscountAmount && (
//                 <span>
//                   Max discount{" "}
//                   <strong className="font-semibold text-[#f6f1e4]/80">
//                     ₹{coupon.maximumDiscountAmount.toLocaleString("en-IN")}
//                   </strong>
//                 </span>
//               )}
//               <span className="flex items-center gap-1">
//                 <CalendarClock className="h-3.5 w-3.5" />
//                 Valid till{" "}
//                 <strong className="font-semibold text-[#f6f1e4]/80">
//                   {formattedDate}
//                 </strong>
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Countdown bar — ticks down the 6s auto-slide */}
//         {slideCount > 1 && (
//           <div className="h-[3px] w-full overflow-hidden bg-white/5">
//             <div
//               key={`${coupon._id}-${isPaused}`}
//               className="h-full origin-left bg-[#cba135]"
//               style={{
//                 animation: isPaused
//                   ? "none"
//                   : `coupon-progress ${SLIDE_DURATION_MS}ms linear forwards`,
//                 width: isPaused ? "var(--paused-width, 100%)" : undefined,
//               }}
//             />
//           </div>
//         )}

//         {/* Arrows */}
//         {slideCount > 1 && (
//           <>
//             <button
//               onClick={handlePrev}
//               aria-label="Previous coupon"
//               className="absolute top-[46%] left-2.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#0a2224]/70 text-[#f6f1e4] opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:bg-[#0a2224] focus-visible:opacity-100"
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </button>
//             <button
//               onClick={handleNext}
//               aria-label="Next coupon"
//               className="absolute top-[46%] right-2.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#0a2224]/70 text-[#f6f1e4] opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:bg-[#0a2224] focus-visible:opacity-100"
//             >
//               <ChevronRight className="h-4 w-4" />
//             </button>
//           </>
//         )}
//       </div>

//       {/* Pagination dots */}
//       {slideCount > 1 && (
//         <div className="mt-3 flex items-center justify-center gap-1.5">
//           {coupons.map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => goTo(idx)}
//               aria-label={`Go to coupon ${idx + 1}`}
//               aria-current={activeIndex === idx}
//               className={`h-1.5 rounded-full transition-all duration-300 ${
//                 activeIndex === idx
//                   ? "w-6 bg-[#0d2b2e]"
//                   : "w-1.5 bg-[#0d2b2e]/25 hover:bg-[#0d2b2e]/45"
//               }`}
//             />
//           ))}
//         </div>
//       )}

//       <style>{`
//         @keyframes coupon-progress {
//           from { width: 0%; }
//           to { width: 100%; }
//         }
//       `}</style>
//     </div>
//   )
// }

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { _axios } from "@/lib/axios"
import { useAuth } from "@/lib/useAuth"
import { toast } from "sonner"
import {
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Package,
  Ticket,
  Flame,
  CalendarClock,
} from "lucide-react"

export interface ICoupon {
  _id: string
  title: string
  description?: string
  couponCode: string
  bannerImage: string
  discountType: "PERCENTAGE" | "FIXED_AMOUNT"
  discountValue: number
  minimumBookingAmount: number
  maximumDiscountAmount?: number
  totalUsageLimit: number
  perUserUsageLimit: number
  usedCount: number
  applicableFor: "ALL" | "STANDARD" | "CUSTOMIZED" | "SELECTED"
  packageIds?: { _id: string; title: string; destination: string }[]
  userType: "ALL_USERS" | "NEW_USERS" | "EXISTING_USERS" | "SELECTED_USERS"
  validFrom: string
  validTo: string
}

const SLIDE_DURATION_MS = 6000
const EXPIRING_SOON_DAYS = 3

// Brand tokens — matched to the site's navy / forest-green / white system
const NAVY = "#16264A"
const GREEN = "#1F7A4D"
const RED = "#DC4B3F"

const applicabilityLabel: Record<ICoupon["applicableFor"], string | null> = {
  ALL: null,
  STANDARD: "Standard packages",
  CUSTOMIZED: "Customized packages",
  SELECTED: "Selected packages",
}

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", listener)
    return () => mq.removeEventListener("change", listener)
  }, [])
  return reduced
}

const routeLabel = (coupon: ICoupon) => {
  if (coupon.applicableFor === "SELECTED" && coupon.packageIds?.length) {
    const first = coupon.packageIds[0]?.destination
    const extra = coupon.packageIds.length - 1
    return extra > 0 ? `${first} +${extra} more` : first
  }
  if (coupon.applicableFor === "STANDARD") return "Standard trips"
  if (coupon.applicableFor === "CUSTOMIZED") return "Custom trips"
  return "Any destination"
}

export const CouponShowcase: React.FC = () => {
  const { user } = useAuth()
  const [activeIndex, setActiveIndex] = useState(0)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const {
    data: coupons = [],
    isLoading,
    isError,
  } = useQuery<ICoupon[]>({
    queryKey: ["active-coupons", user?._id],
    queryFn: async () => {
      const res = await _axios.get("/coupon/active")
      return res.data?.data || []
    },
  })

  const slideCount = coupons.length

  useEffect(() => {
    if (activeIndex >= slideCount && slideCount > 0) setActiveIndex(0)
  }, [slideCount, activeIndex])

  useEffect(() => {
    if (slideCount <= 1 || isPaused || prefersReducedMotion) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slideCount)
    }, SLIDE_DURATION_MS)
    return () => clearInterval(interval)
  }, [slideCount, isPaused, activeIndex, prefersReducedMotion])

  const goTo = useCallback(
    (index: number) => {
      if (slideCount === 0) return
      setActiveIndex(((index % slideCount) + slideCount) % slideCount)
    },
    [slideCount]
  )

  const handlePrev = () => goTo(activeIndex - 1)
  const handleNext = () => goTo(activeIndex + 1)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      handlePrev()
    }
    if (e.key === "ArrowRight") {
      e.preventDefault()
      handleNext()
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    setIsPaused(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || slideCount <= 1) {
      setIsPaused(false)
      return
    }
    const diffX = touchStartX.current - e.changedTouches[0].clientX
    if (diffX > 50) handleNext()
    else if (diffX < -50) handlePrev()
    touchStartX.current = null
    setIsPaused(false)
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Coupon code "${code}" copied to clipboard!`)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const coupon = slideCount > 0 ? coupons[activeIndex] : null

  const meta = useMemo(() => {
    if (!coupon) return null
    const formattedDate = new Date(coupon.validTo).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    const daysLeft = Math.ceil(
      (new Date(coupon.validTo).getTime() - Date.now()) / 86400000
    )
    const usagePct =
      coupon.totalUsageLimit > 0
        ? Math.min(
            100,
            Math.round((coupon.usedCount / coupon.totalUsageLimit) * 100)
          )
        : null
    return { formattedDate, daysLeft, usagePct }
  }, [coupon])

  if (isLoading) {
    return (
      <div className="flex h-[260px] w-full animate-pulse items-center justify-center rounded-2xl border border-gray-100 bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Ticket className="h-7 w-7 text-gray-300" />
          <span className="text-sm font-medium text-gray-400">
            Loading exclusive offers…
          </span>
        </div>
      </div>
    )
  }

  if (isError || !coupon || !meta) return null

  const isNewUser = coupon.userType === "NEW_USERS"
  const applicability = applicabilityLabel[coupon.applicableFor]
  const isExpiringSoon =
    meta.daysLeft >= 0 && meta.daysLeft <= EXPIRING_SOON_DAYS
  const discountLabel =
    coupon.discountType === "PERCENTAGE"
      ? `${coupon.discountValue}% OFF`
      : `₹${coupon.discountValue.toLocaleString("en-IN")} OFF`

  return (
    <div className="relative mb-9 w-full">
      {/* eyebrow, matches the "— EXPLORE PACKAGES" pattern used elsewhere on the page */}
      <div className="mb-3 flex items-center gap-2">
        <span className="h-px w-4" style={{ backgroundColor: GREEN }} />
        <span
          className="text-[11px] font-bold tracking-[0.15em] uppercase"
          style={{ color: GREEN }}
        >
          Special offer
        </span>
      </div>

      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Available coupons"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-shadow duration-300 outline-none hover:shadow-[0_8px_24px_rgba(16,24,40,0.08)] focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ ["--tw-ring-color" as any]: NAVY }}
        >
          <div
            key={coupon._id}
            className="card-enter flex flex-col sm:flex-row"
          >
            {/* ===== Visual panel ===== */}
            <div className="relative h-[170px] min-h-[220px] w-full shrink-0 overflow-hidden sm:h-auto sm:w-[40%]">
              {coupon.bannerImage ? (
                <img
                  src={coupon.bannerImage}
                  alt={coupon.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${NAVY}, ${GREEN})`,
                  }}
                >
                  <Ticket className="h-14 w-14 text-white/25" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />

              {/* badges, matches "Domestic / Top" tags on the package hero image */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {isNewUser && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-wide text-emerald-700 uppercase shadow-sm">
                    <Sparkles className="h-3 w-3" /> New user
                  </span>
                )}
                {isExpiringSoon && (
                  <span
                    className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase shadow-sm"
                    style={{ backgroundColor: RED }}
                  >
                    <Flame className="h-3 w-3" />{" "}
                    {meta.daysLeft <= 0 ? "Last day" : `${meta.daysLeft}d left`}
                  </span>
                )}
              </div>

              {/* discount overlay, matches the price-on-image treatment on package cards */}
              <div className="absolute bottom-3 left-3">
                <span
                  className="inline-block rounded-lg bg-white/95 px-3 py-1.5 text-base font-extrabold tabular-nums shadow-sm"
                  style={{ color: NAVY }}
                >
                  {discountLabel}
                </span>
              </div>
            </div>

            {/* ===== Content panel ===== */}
            <div className="flex w-full flex-col justify-between gap-4 p-5 sm:w-[60%] sm:p-7">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide uppercase"
                    style={{
                      color: GREEN,
                      backgroundColor: "rgba(31,122,77,0.08)",
                      borderColor: "rgba(31,122,77,0.18)",
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: GREEN }}
                    />
                    Limited offer
                  </span>
                  {applicability && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-500"
                      title={
                        coupon.applicableFor === "SELECTED"
                          ? coupon.packageIds?.map((p) => p.title).join(", ")
                          : undefined
                      }
                    >
                      {coupon.applicableFor === "SELECTED" && (
                        <Package className="h-3 w-3" />
                      )}
                      {applicability}
                    </span>
                  )}
                </div>

                <h3
                  className="text-xl leading-snug font-bold sm:text-2xl"
                  style={{
                    color: NAVY,
                    fontFamily: "'Libre Baskerville', serif",
                  }}
                >
                  {coupon.title}
                </h3>

                {coupon.description && (
                  <p className="mt-1.5 line-clamp-2 max-w-md text-[13px] text-gray-500">
                    {coupon.description}
                  </p>
                )}

                {/* meta bullets, matches "Hotel • Pub / Food" feature list */}
                <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-[13px] text-gray-500 sm:grid-cols-2">
                  {coupon.minimumBookingAmount > 0 && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: GREEN }}
                      />
                      Min booking{" "}
                      <strong className="font-semibold" style={{ color: NAVY }}>
                        ₹{coupon.minimumBookingAmount.toLocaleString("en-IN")}
                      </strong>
                    </span>
                  )}
                  {!!coupon.maximumDiscountAmount && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: GREEN }}
                      />
                      Max discount{" "}
                      <strong className="font-semibold" style={{ color: NAVY }}>
                        ₹{coupon.maximumDiscountAmount.toLocaleString("en-IN")}
                      </strong>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: GREEN }}
                    />
                    {routeLabel(coupon)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    Valid till{" "}
                    <strong className="font-semibold" style={{ color: NAVY }}>
                      {meta.formattedDate}
                    </strong>
                  </span>
                </div>

                {/* {meta.usagePct !== null && (
                  <div className="mt-3 max-w-[240px]">
                    <div className="mb-1 flex items-center justify-between text-[10.5px] text-gray-400">
                      <span>
                        {coupon.usedCount.toLocaleString("en-IN")}/
                        {coupon.totalUsageLimit.toLocaleString("en-IN")} claimed
                      </span>
                      {meta.usagePct >= 80 && (
                        <span className="font-semibold" style={{ color: RED }}>
                          Going fast
                        </span>
                      )}
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(meta.usagePct, 3)}%`,
                          backgroundColor: GREEN,
                        }}
                      />
                    </div>
                  </div>
                )} */}
              </div>

              {/* CTA row, mirrors the Details / Book Now pill pair */}
              <div className="flex items-center gap-3 pt-1">
                {/* <span
                  className="hidden cursor-default items-center rounded-full border px-4 py-2.5 text-xs font-semibold whitespace-nowrap sm:inline-flex"
                  style={{ color: NAVY, borderColor: "rgba(22,38,74,0.18)" }}
                >
                  Use code at checkout
                </span> */}
                <button
                  onClick={() => handleCopyCode(coupon.couponCode)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-colors duration-200 sm:flex-none"
                  style={{
                    backgroundColor:
                      copiedCode === coupon.couponCode ? GREEN : NAVY,
                  }}
                >
                  <span className="font-mono tracking-[0.12em]">
                    {coupon.couponCode}
                  </span>
                  {copiedCode === coupon.couponCode ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Auto-slide progress */}
          {slideCount > 1 && (
            <div className="absolute bottom-0 left-0 h-[3px] w-full overflow-hidden bg-gray-100">
              <div
                key={`${coupon._id}-${isPaused}-${prefersReducedMotion}`}
                className="h-full origin-left"
                style={{
                  backgroundColor: GREEN,
                  animation:
                    isPaused || prefersReducedMotion
                      ? "none"
                      : `coupon-progress ${SLIDE_DURATION_MS}ms linear forwards`,
                  width: isPaused || prefersReducedMotion ? "0%" : undefined,
                }}
              />
            </div>
          )}

          {/* Arrows */}
          {slideCount > 1 && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Previous coupon"
                className="absolute top-[36%] left-2.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 opacity-0 shadow-sm transition-all duration-200 group-hover:opacity-100 hover:border-gray-300 focus-visible:opacity-100 sm:top-1/2"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next coupon"
                className="absolute top-[36%] right-2.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 opacity-0 shadow-sm transition-all duration-200 group-hover:opacity-100 hover:border-gray-300 focus-visible:opacity-100 sm:top-1/2"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pagination dots, matches the dot style under the hero carousel */}
      {slideCount > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {coupons.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Go to coupon ${idx + 1}`}
              aria-current={activeIndex === idx}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: activeIndex === idx ? 24 : 8,
                backgroundColor: activeIndex === idx ? NAVY : "#D1D5DB",
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes coupon-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes card-enter {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .card-enter {
          animation: card-enter 320ms ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .card-enter { animation: none; }
        }
      `}</style>
    </div>
  )
}
