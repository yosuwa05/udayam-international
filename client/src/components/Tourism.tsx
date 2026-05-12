// import React, { useState, useEffect, useRef } from "react"
// import type { Page } from "./Navbar"

// // ─── shadcn Sheet (inline — no import needed, pure React portal) ─────────────
// // We build our own Sheet since we can't guarantee shadcn is installed
// interface SheetProps {
//   open: boolean
//   onClose: () => void
//   children: React.ReactNode
// }
// const MobileSheet: React.FC<SheetProps> = ({ open, onClose, children }) => {
//   useEffect(() => {
//     document.body.style.overflow = open ? "hidden" : ""
//     return () => {
//       document.body.style.overflow = ""
//     }
//   }, [open])
//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         onClick={onClose}
//         style={{
//           position: "fixed",
//           inset: 0,
//           zIndex: 998,
//           background: "rgba(0,0,0,0.45)",
//           backdropFilter: "blur(2px)",
//           opacity: open ? 1 : 0,
//           pointerEvents: open ? "auto" : "none",
//           transition: "opacity 0.3s ease",
//         }}
//       />
//       {/* Drawer */}
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           bottom: 0,
//           zIndex: 999,
//           width: "min(320px, 88vw)",
//           background: "#fff",
//           boxShadow: "4px 0 32px rgba(0,0,0,0.18)",
//           overflowY: "auto",
//           transform: open ? "translateX(0)" : "translateX(-100%)",
//           transition: "transform 0.35s cubic-bezier(.25,.46,.45,.94)",
//         }}
//       >
//         {/* Close button */}
//         <button
//           onClick={onClose}
//           style={{
//             position: "absolute",
//             top: 16,
//             right: 16,
//             zIndex: 1,
//             width: 36,
//             height: 36,
//             borderRadius: "50%",
//             border: "1.5px solid #E8E4DC",
//             background: "#F7F5F0",
//             cursor: "pointer",
//             fontSize: "1.1rem",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontFamily: "'Inter',sans-serif",
//             color: "#5a5a7a",
//           }}
//         >
//           ×
//         </button>
//         {children}
//       </div>
//     </>
//   )
// }

// // ─── Types ────────────────────────────────────────────────
// interface TourismProps {
//   onNavigate: (page: Page) => void
// }
// interface PackageCard {
//   id: number
//   img: string
//   type: "domestic" | "international"
//   title: string
//   destination: string
//   duration: string
//   pax: string
//   rating: string
//   ratingScore: string
//   reviews: string
//   price: string
//   oldPrice?: string
//   discount?: string
//   label?: string
//   badges: {
//     text: string
//     variant: "domestic" | "intl" | "hot" | "sale" | "new"
//   }[]
//   inclusions: string[]
// }

// // ─── Data ────────────────────────────────────────────────
// const domesticPackages: PackageCard[] = [
//   {
//     id: 1,
//     type: "domestic",
//     img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80",
//     title: "Kerala Backwaters Bliss",
//     destination: "📍 Kerala, India",
//     duration: "5 Days / 4 Nights",
//     pax: "2–8 Pax",
//     rating: "★★★★★",
//     ratingScore: "4.9",
//     reviews: "(312 reviews)",
//     price: "₹18,999",
//     oldPrice: "₹22,499",
//     discount: "15% OFF",
//     badges: [
//       { text: "Domestic", variant: "domestic" },
//       { text: "🔥 Top Pick", variant: "hot" },
//     ],
//     inclusions: ["🏨 Hotel", "🍽 Meals", "🚢 Houseboat", "🚌 Transfers"],
//   },
//   {
//     id: 2,
//     type: "domestic",
//     img: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600&auto=format&fit=crop&q=80",
//     title: "Rajasthan Royal Heritage Tour",
//     destination: "📍 Rajasthan, India",
//     duration: "7 Days / 6 Nights",
//     pax: "2–12 Pax",
//     rating: "★★★★½",
//     ratingScore: "4.7",
//     reviews: "(218 reviews)",
//     price: "₹24,999",
//     oldPrice: "₹29,999",
//     discount: "17% OFF",
//     badges: [
//       { text: "Domestic", variant: "domestic" },
//       { text: "New", variant: "new" },
//     ],
//     inclusions: ["🏰 Palace Stay", "🍽 Meals", "🐪 Camel Safari"],
//   },
//   {
//     id: 3,
//     type: "domestic",
//     img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80",
//     title: "Himachal Mountain Escape",
//     destination: "📍 Himachal Pradesh, India",
//     duration: "6 Days / 5 Nights",
//     pax: "2–10 Pax",
//     rating: "★★★★★",
//     ratingScore: "4.8",
//     reviews: "(145 reviews)",
//     price: "₹15,999",
//     label: "Best Value",
//     badges: [{ text: "Domestic", variant: "domestic" }],
//     inclusions: ["🏔 Trekking", "🏨 Resort", "🚌 Transfers"],
//   },
//   {
//     id: 4,
//     type: "domestic",
//     img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80",
//     title: "Goa Sun, Sand & Serenity",
//     destination: "📍 Goa, India",
//     duration: "4 Days / 3 Nights",
//     pax: "2–6 Pax",
//     rating: "★★★★",
//     ratingScore: "4.5",
//     reviews: "(389 reviews)",
//     price: "₹12,999",
//     oldPrice: "₹16,499",
//     discount: "21% OFF",
//     badges: [
//       { text: "Domestic", variant: "domestic" },
//       { text: "🏷 Sale", variant: "sale" },
//     ],
//     inclusions: ["🏖 Beach Resort", "🍹 Meals", "🛵 Bike Rental"],
//   },
//   {
//     id: 5,
//     type: "domestic",
//     img: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&auto=format&fit=crop&q=80",
//     title: "Andaman Island Retreat",
//     destination: "📍 Andaman Islands, India",
//     duration: "6 Days / 5 Nights",
//     pax: "2–8 Pax",
//     rating: "★★★★★",
//     ratingScore: "4.9",
//     reviews: "(267 reviews)",
//     price: "₹28,999",
//     oldPrice: "₹33,999",
//     discount: "15% OFF",
//     badges: [
//       { text: "Domestic", variant: "domestic" },
//       { text: "🔥 Trending", variant: "hot" },
//     ],
//     inclusions: ["✈ Flights", "🤿 Scuba", "🏨 Resort"],
//   },
//   {
//     id: 6,
//     type: "domestic",
//     img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&auto=format&fit=crop&q=80",
//     title: "Varanasi Spiritual Journey",
//     destination: "📍 Varanasi, India",
//     duration: "3 Days / 2 Nights",
//     pax: "1–20 Pax",
//     rating: "★★★★",
//     ratingScore: "4.6",
//     reviews: "(190 reviews)",
//     price: "₹9,999",
//     label: "Best Budget",
//     badges: [{ text: "Domestic", variant: "domestic" }],
//     inclusions: ["🛕 Temple Tour", "🚢 River Cruise", "🏨 Hotel"],
//   },
// ]
// const intlPackages: PackageCard[] = [
//   {
//     id: 7,
//     type: "international",
//     img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80",
//     title: "Bali Bliss & Temple Escape",
//     destination: "📍 Bali, Indonesia",
//     duration: "7 Days / 6 Nights",
//     pax: "2 Pax+",
//     rating: "★★★★★",
//     ratingScore: "4.9",
//     reviews: "(418 reviews)",
//     price: "₹54,999",
//     oldPrice: "₹64,999",
//     discount: "15% OFF",
//     badges: [
//       { text: "International", variant: "intl" },
//       { text: "🔥 Bestseller", variant: "hot" },
//     ],
//     inclusions: ["✈ Flights", "🏨 Villa", "🍽 Breakfast", "🚌 Transfers"],
//   },
//   {
//     id: 8,
//     type: "international",
//     img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80",
//     title: "Dubai Luxury Weekend Getaway",
//     destination: "📍 Dubai, UAE",
//     duration: "5 Days / 4 Nights",
//     pax: "2 Pax+",
//     rating: "★★★★½",
//     ratingScore: "4.8",
//     reviews: "(302 reviews)",
//     price: "₹72,999",
//     oldPrice: "₹85,999",
//     discount: "15% OFF",
//     badges: [
//       { text: "International", variant: "intl" },
//       { text: "🏷 Sale", variant: "sale" },
//     ],
//     inclusions: ["✈ Flights", "🏨 5-Star Hotel", "🐪 Desert Safari"],
//   },
//   {
//     id: 9,
//     type: "international",
//     img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&auto=format&fit=crop&q=80",
//     title: "Thailand Explorer Package",
//     destination: "📍 Bangkok & Phuket, Thailand",
//     duration: "8 Days / 7 Nights",
//     pax: "2–10 Pax",
//     rating: "★★★★★",
//     ratingScore: "4.9",
//     reviews: "(524 reviews)",
//     price: "₹44,999",
//     label: "Best Value",
//     badges: [
//       { text: "International", variant: "intl" },
//       { text: "New", variant: "new" },
//     ],
//     inclusions: ["✈ Flights", "🏨 Hotel", "🏝 Island Tour"],
//   },
//   {
//     id: 10,
//     type: "international",
//     img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80",
//     title: "Paris Romance & City of Lights",
//     destination: "📍 Paris, France",
//     duration: "9 Days / 8 Nights",
//     pax: "2 Pax",
//     rating: "★★★★★",
//     ratingScore: "5.0",
//     reviews: "(189 reviews)",
//     price: "₹1,24,999",
//     oldPrice: "₹1,44,999",
//     discount: "14% OFF",
//     badges: [
//       { text: "International", variant: "intl" },
//       { text: "🔥 Romantic", variant: "hot" },
//     ],
//     inclusions: ["✈ Flights", "🗼 Eiffel Tour", "🚢 Seine Cruise"],
//   },
//   {
//     id: 11,
//     type: "international",
//     img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&auto=format&fit=crop&q=80",
//     title: "Japan Cherry Blossom Trail",
//     destination: "📍 Tokyo & Kyoto, Japan",
//     duration: "10 Days / 9 Nights",
//     pax: "2–8 Pax",
//     rating: "★★★★★",
//     ratingScore: "4.9",
//     reviews: "(143 reviews)",
//     price: "₹1,04,999",
//     label: "Limited Seats",
//     badges: [
//       { text: "International", variant: "intl" },
//       { text: "Seasonal", variant: "new" },
//     ],
//     inclusions: ["✈ Flights", "🚅 Bullet Train", "🏯 Temple Tour"],
//   },
//   {
//     id: 12,
//     type: "international",
//     img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&auto=format&fit=crop&q=80",
//     title: "Maldives Luxury Overwater Retreat",
//     destination: "📍 Maldives",
//     duration: "6 Days / 5 Nights",
//     pax: "2 Pax",
//     rating: "★★★★★",
//     ratingScore: "5.0",
//     reviews: "(97 reviews)",
//     price: "₹1,89,999",
//     oldPrice: "₹2,19,999",
//     discount: "14% OFF",
//     badges: [
//       { text: "International", variant: "intl" },
//       { text: "💎 Luxury", variant: "hot" },
//     ],
//     inclusions: ["✈ Flights", "🏝 Overwater Villa", "🍽 All Meals"],
//   },
// ]
// const marqueeItems = [
//   "Kerala Backwaters",
//   "Rajasthan Royal",
//   "Bali Escape",
//   "Swiss Alps",
//   "Himachal Adventure",
//   "Dubai Luxury",
//   "Andaman Islands",
//   "Paris Romance",
//   "Goa Beaches",
//   "Thailand Explorer",
// ]
// const destFilters = [
//   { label: "India", count: 48 },
//   { label: "Europe", count: 32 },
//   { label: "South-East Asia", count: 36 },
//   { label: "Middle East", count: 22 },
//   { label: "Americas", count: 18 },
// ]
// const tripTypes = [
//   { label: "Honeymoon", count: 28 },
//   { label: "Family", count: 44 },
//   { label: "Adventure", count: 30 },
//   { label: "Solo Travel", count: 20 },
//   { label: "Luxury", count: 16 },
// ]

// // ─── Badge ───────────────────────────────────────────────
// const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
//   domestic: { bg: "#e8f5e9", color: "#2E7D32" },
//   intl: { bg: "rgba(27,43,107,0.85)", color: "#fff" },
//   hot: { bg: "#E53E3E", color: "#fff" },
//   sale: { bg: "#F59E0B", color: "#fff" },
//   new: { bg: "#1B2B6B", color: "#fff" },
// }

// // ─── Sidebar Content (shared between desktop & mobile sheet)
// interface SidebarContentProps {
//   search: string
//   setSearch: (v: string) => void
//   activeType: "all" | "domestic" | "international"
//   setActiveType: (v: "all" | "domestic" | "international") => void
//   maxPrice: number
//   setMaxPrice: (v: number) => void
//   activeDur: string
//   setActiveDur: (v: string) => void
//   onReset: () => void
// }
// const SidebarContent: React.FC<SidebarContentProps> = ({
//   search,
//   setSearch,
//   activeType,
//   setActiveType,
//   maxPrice,
//   setMaxPrice,
//   activeDur,
//   setActiveDur,
//   onReset,
// }) => {
//   const pricePct = ((maxPrice - 5000) / (200000 - 5000)) * 100
//   const fmtPrice = (v: number) => "₹" + v.toLocaleString("en-IN")
//   const durations = ["Any", "1–3 Days", "4–7 Days", "8–14 Days", "15+ Days"]
//   const f = "'Inter',sans-serif"
//   const lbl = (t: string) => (
//     <div
//       style={{
//         fontFamily: f,
//         fontSize: ".68rem",
//         fontWeight: 700,
//         color: "#9494b0",
//         letterSpacing: ".14em",
//         textTransform: "uppercase" as const,
//         marginBottom: 14,
//       }}
//     >
//       {t}
//     </div>
//   )
//   return (
//     <div
//       style={{ padding: "48px 28px 32px", fontFamily: "'Raleway',sans-serif" }}
//     >
//       {/* Search */}
//       <div style={{ position: "relative", marginBottom: 36 }}>
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search destinations..."
//           style={{
//             width: "100%",
//             padding: "13px 44px 13px 18px",
//             borderRadius: 12,
//             border: "1.5px solid #E8E4DC",
//             fontFamily: "'Raleway',sans-serif",
//             fontSize: ".9rem",
//             color: "#1a1a2e",
//             background: "#FAF8F4",
//             outline: "none",
//           }}
//           onFocus={(e) => (e.target.style.borderColor = "#1B2B6B")}
//           onBlur={(e) => (e.target.style.borderColor = "#E8E4DC")}
//         />
//         <span
//           style={{
//             position: "absolute",
//             right: 14,
//             top: "50%",
//             transform: "translateY(-50%)",
//             color: "#9494b0",
//             fontSize: ".85rem",
//             pointerEvents: "none",
//           }}
//         >
//           🔍
//         </span>
//       </div>

//       {/* Type Toggle */}
//       {lbl("Package Type")}
//       <div
//         style={{
//           display: "flex",
//           background: "#F7F5F0",
//           borderRadius: 12,
//           padding: 4,
//           gap: 4,
//           marginBottom: 32,
//         }}
//       >
//         {(["all", "domestic", "international"] as const).map((t) => (
//           <button
//             key={t}
//             onClick={() => setActiveType(t)}
//             style={{
//               flex: 1,
//               padding: "10px 4px",
//               borderRadius: 9,
//               border: "none",
//               fontFamily: f,
//               fontSize: ".76rem",
//               fontWeight: 600,
//               cursor: "pointer",
//               transition: "all .25s",
//               background: activeType === t ? "#1B2B6B" : "transparent",
//               color: activeType === t ? "#fff" : "#9494b0",
//               boxShadow:
//                 activeType === t ? "0 4px 14px rgba(27,43,107,.2)" : "none",
//               letterSpacing: ".04em",
//             }}
//           >
//             {t === "all" ? "All" : t === "domestic" ? "Domestic" : "Intl"}
//           </button>
//         ))}
//       </div>

//       {/* Destinations */}
//       {lbl("Destinations")}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 10,
//           marginBottom: 32,
//         }}
//       >
//         {destFilters.map((d) => (
//           <label
//             key={d.label}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 10,
//               cursor: "pointer",
//             }}
//           >
//             <input type="checkbox" defaultChecked style={{ display: "none" }} />
//             <div
//               style={{
//                 width: 18,
//                 height: 18,
//                 borderRadius: 5,
//                 border: "1.5px solid #E8E4DC",
//                 background: "#1B2B6B",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexShrink: 0,
//               }}
//             >
//               <span
//                 style={{ color: "#fff", fontSize: ".65rem", fontWeight: 700 }}
//               >
//                 ✓
//               </span>
//             </div>
//             <span
//               style={{
//                 fontFamily: f,
//                 fontSize: ".88rem",
//                 color: "#5a5a7a",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 flex: 1,
//               }}
//             >
//               {d.label}
//               <span
//                 style={{
//                   fontFamily: f,
//                   fontSize: ".72rem",
//                   color: "#9494b0",
//                   background: "#F7F5F0",
//                   padding: "2px 8px",
//                   borderRadius: 999,
//                 }}
//               >
//                 {d.count}
//               </span>
//             </span>
//           </label>
//         ))}
//       </div>

//       {/* Price Range */}
//       {lbl("Budget (₹ per person)")}
//       <div style={{ marginBottom: 32 }}>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             fontFamily: f,
//             fontSize: ".8rem",
//             fontWeight: 600,
//             color: "#1B2B6B",
//             marginBottom: 12,
//           }}
//         >
//           <span>₹5,000</span>
//           <span>{fmtPrice(maxPrice)}</span>
//         </div>
//         <input
//           type="range"
//           min={5000}
//           max={200000}
//           step={5000}
//           value={maxPrice}
//           onChange={(e) => setMaxPrice(+e.target.value)}
//           style={{
//             width: "100%",
//             height: 4,
//             borderRadius: 2,
//             appearance: "none" as any,
//             WebkitAppearance: "none",
//             outline: "none",
//             cursor: "pointer",
//             background: `linear-gradient(to right,#1B2B6B 0%,#1B2B6B ${pricePct}%,#E8E4DC ${pricePct}%,#E8E4DC 100%)`,
//           }}
//         />
//       </div>

//       {/* Duration */}
//       {lbl("Duration")}
//       <div
//         style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}
//       >
//         {durations.map((d) => (
//           <button
//             key={d}
//             onClick={() => setActiveDur(d)}
//             style={{
//               padding: "7px 14px",
//               borderRadius: 999,
//               border: `1.5px solid ${activeDur === d ? "#1B2B6B" : "#E8E4DC"}`,
//               fontFamily: f,
//               fontSize: ".76rem",
//               fontWeight: 500,
//               cursor: "pointer",
//               transition: "all .2s",
//               background: activeDur === d ? "#1B2B6B" : "#fff",
//               color: activeDur === d ? "#fff" : "#5a5a7a",
//             }}
//           >
//             {d}
//           </button>
//         ))}
//       </div>

//       {/* Trip Type */}
//       {lbl("Trip Type")}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 10,
//           marginBottom: 32,
//         }}
//       >
//         {tripTypes.map((t) => (
//           <label
//             key={t.label}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 10,
//               cursor: "pointer",
//             }}
//           >
//             <input type="checkbox" defaultChecked style={{ display: "none" }} />
//             <div
//               style={{
//                 width: 18,
//                 height: 18,
//                 borderRadius: 5,
//                 border: "1.5px solid #1B2B6B",
//                 background: "#1B2B6B",
//                 flexShrink: 0,
//               }}
//             />
//             <span
//               style={{
//                 fontFamily: f,
//                 fontSize: ".88rem",
//                 color: "#5a5a7a",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 flex: 1,
//               }}
//             >
//               {t.label}
//               <span
//                 style={{
//                   fontFamily: f,
//                   fontSize: ".72rem",
//                   color: "#9494b0",
//                   background: "#F7F5F0",
//                   padding: "2px 8px",
//                   borderRadius: 999,
//                 }}
//               >
//                 {t.count}
//               </span>
//             </span>
//           </label>
//         ))}
//       </div>

//       {/* Sort */}
//       {lbl("Sort By")}
//       <select
//         style={{
//           width: "100%",
//           padding: "11px 16px",
//           border: "1.5px solid #E8E4DC",
//           borderRadius: 10,
//           fontFamily: "'Raleway',sans-serif",
//           fontSize: ".88rem",
//           color: "#1a1a2e",
//           background: "#FAF8F4",
//           outline: "none",
//           cursor: "pointer",
//           marginBottom: 16,
//         }}
//       >
//         {[
//           "Most Popular",
//           "Price: Low to High",
//           "Price: High to Low",
//           "Rating",
//           "Duration",
//           "Newest",
//         ].map((o) => (
//           <option key={o}>{o}</option>
//         ))}
//       </select>

//       <button
//         onClick={onReset}
//         style={{
//           width: "100%",
//           padding: "12px",
//           border: "1.5px solid #E8E4DC",
//           borderRadius: 12,
//           fontFamily: f,
//           fontSize: ".82rem",
//           fontWeight: 600,
//           color: "#5a5a7a",
//           background: "#fff",
//           cursor: "pointer",
//           transition: "all .2s",
//         }}
//         onMouseEnter={(e) => {
//           ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#1B2B6B"
//           ;(e.currentTarget as HTMLButtonElement).style.color = "#1B2B6B"
//         }}
//         onMouseLeave={(e) => {
//           ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#E8E4DC"
//           ;(e.currentTarget as HTMLButtonElement).style.color = "#5a5a7a"
//         }}
//       >
//         ↺ &nbsp;Reset All Filters
//       </button>
//     </div>
//   )
// }

// // ─── Package Card ─────────────────────────────────────────
// const PCard: React.FC<{ card: PackageCard }> = ({ card }) => {
//   const [wished, setWished] = useState(false)
//   const ref = useRef<HTMLDivElement>(null)
//   useEffect(() => {
//     const el = ref.current
//     if (!el) return
//     const ob = new IntersectionObserver(
//       ([e]) => {
//         if (e.isIntersecting) {
//           el.style.opacity = "1"
//           el.style.transform = "translateY(0)"
//         }
//       },
//       { threshold: 0.08 }
//     )
//     ob.observe(el)
//     return () => ob.disconnect()
//   }, [])
//   const f = "'Inter',sans-serif"
//   return (
//     <div
//       ref={ref}
//       style={{
//         background: "#fff",
//         borderRadius: 20,
//         overflow: "hidden",
//         border: "1px solid #E8E4DC",
//         transition: "all .38s cubic-bezier(.25,.46,.45,.94)",
//         opacity: 0,
//         transform: "translateY(28px)",
//         cursor: "default",
//       }}
//       onMouseEnter={(e) => {
//         const el = e.currentTarget as HTMLElement
//         el.style.transform = "translateY(-8px)"
//         el.style.boxShadow = "0 28px 72px rgba(27,43,107,.12)"
//         el.style.borderColor = "transparent"
//       }}
//       onMouseLeave={(e) => {
//         const el = e.currentTarget as HTMLElement
//         el.style.transform = "translateY(0)"
//         el.style.boxShadow = "none"
//         el.style.borderColor = "#E8E4DC"
//       }}
//     >
//       {/* Image */}
//       <div style={{ position: "relative", height: 210, overflow: "hidden" }}>
//         <img
//           src={card.img}
//           alt={card.title}
//           loading="lazy"
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             transition: "transform .7s ease",
//             display: "block",
//           }}
//           onMouseEnter={(e) =>
//             ((e.currentTarget as HTMLElement).style.transform = "scale(1.08)")
//           }
//           onMouseLeave={(e) =>
//             ((e.currentTarget as HTMLElement).style.transform = "scale(1)")
//           }
//         />
//         <div
//           style={{
//             position: "absolute",
//             inset: 0,
//             background:
//               "linear-gradient(to top,rgba(15,26,66,.55) 0%,transparent 55%)",
//           }}
//         />
//         {/* Badges */}
//         <div
//           style={{
//             position: "absolute",
//             top: 14,
//             left: 14,
//             display: "flex",
//             gap: 7,
//             flexWrap: "wrap",
//           }}
//         >
//           {card.badges.map((b, i) => {
//             const s = BADGE_STYLES[b.variant] || { bg: "#ccc", color: "#fff" }
//             return (
//               <span
//                 key={i}
//                 style={{
//                   fontFamily: f,
//                   fontSize: ".65rem",
//                   fontWeight: 700,
//                   padding: "4px 11px",
//                   borderRadius: 999,
//                   letterSpacing: ".05em",
//                   background: s.bg,
//                   color: s.color,
//                 }}
//               >
//                 {b.text}
//               </span>
//             )
//           })}
//         </div>
//         {/* Wishlist */}
//         <button
//           onClick={() => setWished((w) => !w)}
//           style={{
//             position: "absolute",
//             top: 14,
//             right: 14,
//             width: 34,
//             height: 34,
//             borderRadius: "50%",
//             background: "rgba(255,255,255,.9)",
//             backdropFilter: "blur(6px)",
//             border: "none",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontSize: ".9rem",
//             cursor: "pointer",
//             transition: "all .2s",
//           }}
//           onMouseEnter={(e) =>
//             ((e.currentTarget as HTMLButtonElement).style.transform =
//               "scale(1.15)")
//           }
//           onMouseLeave={(e) =>
//             ((e.currentTarget as HTMLButtonElement).style.transform =
//               "scale(1)")
//           }
//         >
//           <span
//             style={{
//               color: wished ? "#E53E3E" : "#9494b0",
//               transition: "color .2s",
//             }}
//           >
//             {wished ? "♥" : "♡"}
//           </span>
//         </button>
//         {/* Price */}
//         <div
//           style={{
//             position: "absolute",
//             bottom: 14,
//             right: 14,
//             textAlign: "right",
//           }}
//         >
//           {card.oldPrice && (
//             <div
//               style={{
//                 fontFamily: f,
//                 fontSize: ".68rem",
//                 color: "rgba(255,255,255,.55)",
//                 textDecoration: "line-through",
//               }}
//             >
//               {card.oldPrice}
//             </div>
//           )}
//           <div
//             style={{
//               fontFamily: "'Libre Baskerville',serif",
//               fontSize: "1.3rem",
//               fontWeight: 700,
//               color: "#fff",
//               lineHeight: 1,
//             }}
//           >
//             {card.price}
//           </div>
//         </div>
//       </div>
//       {/* Body */}
//       <div style={{ padding: "20px 22px 22px" }}>
//         <div
//           style={{
//             fontFamily: f,
//             fontSize: ".68rem",
//             fontWeight: 700,
//             color: "#2E7D32",
//             letterSpacing: ".1em",
//             textTransform: "uppercase" as const,
//             marginBottom: 6,
//           }}
//         >
//           {card.destination}
//         </div>
//         <div
//           style={{
//             fontFamily: "'Libre Baskerville',serif",
//             fontSize: "1.05rem",
//             fontWeight: 700,
//             color: "#1B2B6B",
//             marginBottom: 10,
//             lineHeight: 1.3,
//           }}
//         >
//           {card.title}
//         </div>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 14,
//             marginBottom: 14,
//           }}
//         >
//           <span
//             style={{
//               fontFamily: f,
//               fontSize: ".75rem",
//               color: "#9494b0",
//               display: "flex",
//               alignItems: "center",
//               gap: 5,
//             }}
//           >
//             🗓 {card.duration}
//           </span>
//           <span
//             style={{
//               fontFamily: f,
//               fontSize: ".75rem",
//               color: "#9494b0",
//               display: "flex",
//               alignItems: "center",
//               gap: 5,
//             }}
//           >
//             👥 {card.pax}
//           </span>
//         </div>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 5,
//             marginBottom: 14,
//           }}
//         >
//           <span
//             style={{ color: "#F59E0B", fontSize: ".75rem", letterSpacing: 1 }}
//           >
//             {card.rating}
//           </span>
//           <span
//             style={{
//               fontFamily: f,
//               fontSize: ".78rem",
//               fontWeight: 700,
//               color: "#1a1a2e",
//             }}
//           >
//             {card.ratingScore}
//           </span>
//           <span style={{ fontFamily: f, fontSize: ".72rem", color: "#9494b0" }}>
//             {card.reviews}
//           </span>
//         </div>
//         <div
//           style={{
//             display: "flex",
//             gap: 6,
//             flexWrap: "wrap",
//             marginBottom: 18,
//           }}
//         >
//           {card.inclusions.map((inc, i) => (
//             <span
//               key={i}
//               style={{
//                 fontFamily: f,
//                 fontSize: ".66rem",
//                 fontWeight: 500,
//                 color: "#5a5a7a",
//                 background: "#F7F5F0",
//                 borderRadius: 6,
//                 padding: "4px 9px",
//               }}
//             >
//               {inc}
//             </span>
//           ))}
//         </div>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             paddingTop: 14,
//             borderTop: "1px solid #E8E4DC",
//           }}
//         >
//           {card.discount ? (
//             <span
//               style={{
//                 fontFamily: f,
//                 fontSize: ".72rem",
//                 fontWeight: 700,
//                 color: "#E53E3E",
//                 background: "rgba(229,62,62,.08)",
//                 padding: "4px 10px",
//                 borderRadius: 999,
//               }}
//             >
//               {card.discount}
//             </span>
//           ) : (
//             <span
//               style={{
//                 fontFamily: f,
//                 fontSize: ".72rem",
//                 fontWeight: 700,
//                 color:
//                   card.label === "Best Value" || card.label === "Best Budget"
//                     ? "#2E7D32"
//                     : "#9494b0",
//               }}
//             >
//               {card.label}
//             </span>
//           )}
//           <button
//             style={{
//               fontFamily: f,
//               fontSize: ".78rem",
//               fontWeight: 700,
//               background: "#1B2B6B",
//               color: "#fff",
//               padding: "10px 20px",
//               borderRadius: 999,
//               border: "none",
//               cursor: "pointer",
//               transition: "all .25s",
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//             }}
//             onMouseEnter={(e) => {
//               ;(e.currentTarget as HTMLButtonElement).style.background =
//                 "#243590"
//               ;(e.currentTarget as HTMLButtonElement).style.transform =
//                 "translateX(2px)"
//             }}
//             onMouseLeave={(e) => {
//               ;(e.currentTarget as HTMLButtonElement).style.background =
//                 "#1B2B6B"
//               ;(e.currentTarget as HTMLButtonElement).style.transform =
//                 "translateX(0)"
//             }}
//           >
//             Book Now →
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ─── Section Header ───────────────────────────────────────
// const SecHeader: React.FC<{
//   eyebrow: string
//   title: string
//   seeAll?: string
// }> = ({ eyebrow, title, seeAll }) => (
//   <div
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       marginBottom: 24,
//     }}
//   >
//     <div>
//       <div
//         style={{
//           fontFamily: "'Inter',sans-serif",
//           fontSize: ".7rem",
//           fontWeight: 700,
//           color: "#2E7D32",
//           letterSpacing: ".16em",
//           textTransform: "uppercase" as const,
//           display: "flex",
//           alignItems: "center",
//           gap: 8,
//           marginBottom: 4,
//         }}
//       >
//         <span
//           style={{
//             display: "inline-block",
//             width: 20,
//             height: 1.5,
//             background: "#2E7D32",
//           }}
//         />
//         {eyebrow}
//       </div>
//       <div
//         style={{
//           fontFamily: "'Libre Baskerville',serif",
//           fontSize: "1.5rem",
//           fontWeight: 700,
//           color: "#1B2B6B",
//         }}
//       >
//         {title}
//       </div>
//     </div>
//     {seeAll && (
//       <a
//         href="#"
//         style={{
//           fontFamily: "'Inter',sans-serif",
//           fontSize: ".78rem",
//           fontWeight: 600,
//           color: "#1B2B6B",
//           opacity: 0.6,
//           textDecoration: "none",
//           display: "flex",
//           alignItems: "center",
//           gap: 6,
//           transition: "opacity .2s",
//         }}
//         onMouseEnter={(e) =>
//           ((e.currentTarget as HTMLElement).style.opacity = "1")
//         }
//         onMouseLeave={(e) =>
//           ((e.currentTarget as HTMLElement).style.opacity = ".6")
//         }
//       >
//         {seeAll}
//       </a>
//     )}
//   </div>
// )

// // ─── Main ─────────────────────────────────────────────────
// const Tourism: React.FC<TourismProps> = ({ onNavigate }) => {
//   const [search, setSearch] = useState("")
//   const [activeType, setActiveType] = useState<
//     "all" | "domestic" | "international"
//   >("all")
//   const [maxPrice, setMaxPrice] = useState(200000)
//   const [activeDur, setActiveDur] = useState("Any")
//   const [gridView, setGridView] = useState<"grid" | "list">("grid")
//   const [sheetOpen, setSheetOpen] = useState(false)
//   const [loadingMore, setLoadingMore] = useState(false)
//   const [vw, setVw] = useState(
//     typeof window !== "undefined" ? window.innerWidth : 1200
//   )

//   useEffect(() => {
//     const fn = () => setVw(window.innerWidth)
//     window.addEventListener("resize", fn)
//     return () => window.removeEventListener("resize", fn)
//   }, [])

//   const isMobile = vw < 900 // matches original HTML breakpoint
//   const isTablet = vw >= 900 && vw < 1100

//   const filteredDomestic = domesticPackages.filter((c) => {
//     if (activeType === "international") return false
//     return !search || c.title.toLowerCase().includes(search.toLowerCase())
//   })
//   const filteredIntl = intlPackages.filter((c) => {
//     if (activeType === "domestic") return false
//     return !search || c.title.toLowerCase().includes(search.toLowerCase())
//   })
//   const totalVisible = filteredDomestic.length + filteredIntl.length

//   const sidebarProps = {
//     search,
//     setSearch,
//     activeType,
//     setActiveType,
//     maxPrice,
//     setMaxPrice,
//     activeDur,
//     setActiveDur,
//     onReset: () => {
//       setSearch("")
//       setActiveType("all")
//       setMaxPrice(200000)
//       setActiveDur("Any")
//     },
//   }

//   const cardCols =
//     gridView === "list"
//       ? "1fr"
//       : isMobile
//         ? "1fr"
//         : isTablet
//           ? "1fr 1fr"
//           : "repeat(3,1fr)"

//   const NAV_H = 73 // px — height of sticky navbar
//   const f = "'Inter',sans-serif"

//   return (
//     <>
//       <link
//         href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Raleway:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
//         rel="stylesheet"
//       />
//       <style>{`
//         @keyframes fsu{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes mqscroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
//         .t-h1-anim{opacity:0;animation:fsu 1s .35s forwards}
//         .t-eye-anim{opacity:0;animation:fsu .9s .2s forwards}
//         .t-meta-anim{opacity:0;animation:fsu 1s .5s forwards}
//         .mq-run{animation:mqscroll 30s linear infinite}
//         input[type=range]{-webkit-appearance:none;appearance:none;height:4px;border-radius:2px;outline:none;cursor:pointer}
//         input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#1B2B6B;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(27,43,107,.3);cursor:pointer}
//         @media(max-width:540px){
//           .feat-card-inner{grid-template-columns:1fr!important}
//           .feat-card-img{min-height:200px!important}
//           .hero-sect{height:60vh!important;padding:0 20px 48px!important}
//           .fb-img-wrap{display:none!important}
//           .feat-banner-inner{grid-template-columns:1fr!important}
//           .cta-sect{padding:60px 20px!important}
//           .footer-sect{padding:40px 20px 24px!important}
//           .promo-strip-inner{flex-direction:column!important;text-align:center!important}
//         }
//         @media(max-width:900px){
//           .feat-card-inner{grid-template-columns:1fr!important}
//           .feat-card-img{min-height:240px!important}
//         }
//         @media(min-width:900px){
//           .mob-filter-bar{display:none!important}
//         }
//         @media(max-width:899px){
//           .desktop-sidebar{display:none!important}
//         }
//       `}</style>

//       <div
//         style={{
//           fontFamily: "'Raleway',sans-serif",
//           background: "#F7F5F0",
//           color: "#1a1a2e",
//           overflowX: "hidden",
//         }}
//       >
//         {/* ─── HERO ─── */}
//         <section
//           className="hero-sect"
//           style={{
//             position: "relative",
//             overflow: "hidden",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "flex-end",
//             height: "72vh",
//             minHeight: 560,
//             padding: "0 64px 80px",
//           }}
//         >
//           <div
//             style={{
//               position: "absolute",
//               inset: 0,
//               backgroundImage:
//                 "url('https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1800&auto=format&fit=crop&q=80')",
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               transition: "transform 8s ease",
//             }}
//             onMouseEnter={(e) =>
//               ((e.currentTarget as HTMLElement).style.transform = "scale(1.03)")
//             }
//             onMouseLeave={(e) =>
//               ((e.currentTarget as HTMLElement).style.transform = "scale(1)")
//             }
//           />
//           <div
//             style={{
//               position: "absolute",
//               inset: 0,
//               background:
//                 "linear-gradient(180deg,rgba(15,26,66,.25) 0%,rgba(15,26,66,.15) 30%,rgba(15,26,66,.7) 70%,rgba(15,26,66,.92) 100%)",
//             }}
//           />
//           <div style={{ position: "relative", zIndex: 2 }}>
//             <div
//               className="t-eye-anim"
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 10,
//                 fontFamily: f,
//                 fontSize: ".72rem",
//                 fontWeight: 600,
//                 color: "rgba(255,255,255,.5)",
//                 letterSpacing: ".16em",
//                 textTransform: "uppercase",
//                 marginBottom: 18,
//               }}
//             >
//               <span
//                 style={{
//                   display: "inline-block",
//                   width: 30,
//                   height: 1,
//                   background: "rgba(255,255,255,.35)",
//                 }}
//               />
//               Explore · Discover · Experience
//             </div>
//             <h1
//               className="t-h1-anim"
//               style={{
//                 fontFamily: "'Libre Baskerville',serif",
//                 fontSize: "clamp(2.4rem,5.5vw,5.5rem)",
//                 fontWeight: 700,
//                 lineHeight: 1.02,
//                 color: "#fff",
//                 marginBottom: 28,
//               }}
//             >
//               Find Your Perfect
//               <br />
//               <em style={{ fontStyle: "italic", color: "#7ed88a" }}>
//                 Tour Package
//               </em>
//             </h1>
//             <div
//               className="t-meta-anim"
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 24,
//                 flexWrap: "wrap",
//               }}
//             >
//               {[
//                 ["240+", "Curated Packages"],
//                 ["Domestic & International", ""],
//                 ["All Budgets", "Welcome"],
//               ].map(([b, r], i) => (
//                 <React.Fragment key={i}>
//                   {i > 0 && (
//                     <div
//                       style={{
//                         width: 1,
//                         height: 20,
//                         background: "rgba(255,255,255,.2)",
//                       }}
//                     />
//                   )}
//                   <div
//                     style={{
//                       fontFamily: f,
//                       fontSize: ".82rem",
//                       color: "rgba(255,255,255,.55)",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 6,
//                     }}
//                   >
//                     <strong style={{ color: "#fff", fontWeight: 600 }}>
//                       {b}
//                     </strong>
//                     {r && <span>{r}</span>}
//                   </div>
//                 </React.Fragment>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ─── MARQUEE ─── */}
//         <div
//           style={{
//             background: "#1B2B6B",
//             overflow: "hidden",
//             padding: "16px 0",
//           }}
//         >
//           <div
//             className="mq-run"
//             style={{ display: "flex", width: "max-content" }}
//           >
//             {[...marqueeItems, ...marqueeItems].map((item, i) => (
//               <div
//                 key={i}
//                 style={{
//                   fontFamily: f,
//                   fontSize: ".7rem",
//                   fontWeight: 500,
//                   color: "rgba(255,255,255,.38)",
//                   letterSpacing: ".14em",
//                   textTransform: "uppercase",
//                   padding: "0 32px",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 16,
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 4,
//                     height: 4,
//                     borderRadius: "50%",
//                     background: "#43A047",
//                     flexShrink: 0,
//                   }}
//                 />
//                 {item}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ─── MOBILE FILTER BAR ─── */}
//         <div
//           className="mob-filter-bar"
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "12px 20px",
//             background: "#fff",
//             borderBottom: "1px solid #E8E4DC",
//           }}
//         >
//           <span
//             style={{
//               fontFamily: f,
//               fontSize: ".82rem",
//               fontWeight: 600,
//               color: "#1B2B6B",
//             }}
//           >
//             {totalVisible} Packages Found
//           </span>
//           <button
//             onClick={() => setSheetOpen(true)}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               padding: "9px 18px",
//               borderRadius: 999,
//               border: "1.5px solid #E8E4DC",
//               fontFamily: f,
//               fontSize: ".78rem",
//               fontWeight: 600,
//               color: "#1B2B6B",
//               background: "#fff",
//               cursor: "pointer",
//             }}
//           >
//             <span>⚙</span> Filters & Sort
//           </button>
//         </div>

//         {/* ─── MOBILE SHEET ─── */}
//         <MobileSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
//           <div style={{ paddingTop: 8 }}>
//             <div
//               style={{
//                 padding: "20px 28px 12px",
//                 borderBottom: "1px solid #E8E4DC",
//               }}
//             >
//               <div
//                 style={{
//                   fontFamily: "'Libre Baskerville',serif",
//                   fontSize: "1.2rem",
//                   fontWeight: 700,
//                   color: "#1B2B6B",
//                 }}
//               >
//                 Filters & Sort
//               </div>
//               <div
//                 style={{
//                   fontFamily: f,
//                   fontSize: ".78rem",
//                   color: "#9494b0",
//                   marginTop: 2,
//                 }}
//               >
//                 {totalVisible} packages match
//               </div>
//             </div>
//             <SidebarContent {...sidebarProps} />
//           </div>
//         </MobileSheet>

//         {/* ─── PAGE LAYOUT ─── */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "flex-start",
//             minHeight: "100vh",
//           }}
//         >
//           {/* ─── DESKTOP SIDEBAR (sticky) ─── */}
//           <aside
//             className="desktop-sidebar"
//             style={{
//               width: isTablet ? 260 : 300,
//               flexShrink: 0,
//               position: "sticky",
//               top: NAV_H,
//               height: `calc(100vh - ${NAV_H}px)`,
//               overflowY: "auto",
//               background: "#fff",
//               borderRight: "1px solid #E8E4DC",
//               scrollbarWidth: "thin",
//             }}
//           >
//             <SidebarContent {...sidebarProps} />
//           </aside>

//           {/* ─── MAIN CONTENT ─── */}
//           <main
//             style={{
//               flex: 1,
//               minWidth: 0,
//               padding: isMobile
//                 ? "28px 16px"
//                 : isTablet
//                   ? "36px 28px"
//                   : "48px 52px",
//               overflowX: "hidden",
//             }}
//           >
//             {/* Results bar */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: 40,
//                 flexWrap: "wrap",
//                 gap: 12,
//               }}
//             >
//               <div
//                 style={{
//                   fontFamily: "'Libre Baskerville',serif",
//                   fontSize: isMobile ? "1.2rem" : "1.5rem",
//                   fontWeight: 700,
//                   color: "#1B2B6B",
//                 }}
//               >
//                 Showing <span style={{ color: "#2E7D32" }}>{totalVisible}</span>{" "}
//                 Packages
//               </div>
//               <div style={{ display: "flex", gap: 6 }}>
//                 {(["grid", "list"] as const).map((v) => (
//                   <button
//                     key={v}
//                     onClick={() => setGridView(v)}
//                     style={{
//                       width: 36,
//                       height: 36,
//                       borderRadius: 8,
//                       border: `1.5px solid ${gridView === v ? "#1B2B6B" : "#E8E4DC"}`,
//                       background: gridView === v ? "#1B2B6B" : "#fff",
//                       color: gridView === v ? "#fff" : "#9494b0",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       cursor: "pointer",
//                       fontSize: ".85rem",
//                       transition: "all .2s",
//                     }}
//                   >
//                     {v === "grid" ? "⊞" : "☰"}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Featured Banner */}
//             <div
//               className="feat-banner-inner"
//               style={{
//                 background:
//                   "linear-gradient(135deg,#1B2B6B 0%,#243590 50%,#243590 100%)",
//                 borderRadius: 22,
//                 padding: isMobile ? "28px 24px" : "40px 44px",
//                 marginBottom: 36,
//                 display: "grid",
//                 gridTemplateColumns: "1fr auto",
//                 alignItems: "center",
//                 gap: 32,
//                 position: "relative",
//                 overflow: "hidden",
//               }}
//             >
//               <div
//                 style={{
//                   position: "absolute",
//                   right: -60,
//                   top: -60,
//                   width: 280,
//                   height: 280,
//                   borderRadius: "50%",
//                   background:
//                     "radial-gradient(circle,rgba(46,125,50,.2) 0%,transparent 70%)",
//                   pointerEvents: "none",
//                 }}
//               />
//               <div style={{ position: "relative", zIndex: 1 }}>
//                 <div
//                   style={{
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: 7,
//                     background: "rgba(255,255,255,.12)",
//                     border: "1px solid rgba(255,255,255,.18)",
//                     borderRadius: 999,
//                     padding: "6px 16px",
//                     fontFamily: f,
//                     fontSize: ".68rem",
//                     fontWeight: 700,
//                     color: "rgba(255,255,255,.8)",
//                     letterSpacing: ".1em",
//                     textTransform: "uppercase" as const,
//                     marginBottom: 14,
//                   }}
//                 >
//                   ✦ &nbsp;Limited Time Offer
//                 </div>
//                 <div
//                   style={{
//                     fontFamily: "'Libre Baskerville',serif",
//                     fontSize: isMobile ? "1.4rem" : "1.8rem",
//                     fontWeight: 700,
//                     color: "#fff",
//                     lineHeight: 1.2,
//                     marginBottom: 10,
//                   }}
//                 >
//                   Early Bird{" "}
//                   <em style={{ fontStyle: "italic", color: "#7ed88a" }}>
//                     Summer Sale
//                   </em>
//                 </div>
//                 <div
//                   style={{
//                     fontFamily: "'Raleway',sans-serif",
//                     fontSize: ".9rem",
//                     color: "rgba(255,255,255,.55)",
//                     maxWidth: 440,
//                     marginBottom: 20,
//                   }}
//                 >
//                   Book before June 30th and get up to 25% off on all
//                   international packages. Use code HORIZONS25 at checkout.
//                 </div>
//                 <a
//                   href="#"
//                   style={{
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: 8,
//                     fontFamily: f,
//                     fontSize: ".82rem",
//                     fontWeight: 600,
//                     color: "#fff",
//                     background: "rgba(255,255,255,.14)",
//                     border: "1px solid rgba(255,255,255,.2)",
//                     padding: "10px 22px",
//                     borderRadius: 999,
//                     textDecoration: "none",
//                     transition: "all .25s",
//                   }}
//                   onMouseEnter={(e) =>
//                     ((e.currentTarget as HTMLElement).style.background =
//                       "rgba(255,255,255,.22)")
//                   }
//                   onMouseLeave={(e) =>
//                     ((e.currentTarget as HTMLElement).style.background =
//                       "rgba(255,255,255,.14)")
//                   }
//                 >
//                   Explore Offers →
//                 </a>
//               </div>
//               <div
//                 className="fb-img-wrap"
//                 style={{
//                   width: 200,
//                   height: 130,
//                   borderRadius: 16,
//                   overflow: "hidden",
//                   flexShrink: 0,
//                 }}
//               >
//                 <img
//                   src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80"
//                   alt="Offer"
//                   style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                 />
//               </div>
//             </div>

//             {/* Featured Card */}
//             <SecHeader eyebrow="Editor's Pick" title="Featured Package" />
//             <div
//               className="feat-card-inner"
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1.2fr 1fr",
//                 borderRadius: 22,
//                 overflow: "hidden",
//                 border: "1px solid #E8E4DC",
//                 background: "#fff",
//                 marginBottom: 32,
//                 transition: "all .38s ease",
//               }}
//               onMouseEnter={(e) => {
//                 const el = e.currentTarget as HTMLElement
//                 el.style.boxShadow = "0 28px 72px rgba(27,43,107,.12)"
//                 el.style.borderColor = "transparent"
//                 el.style.transform = "translateY(-5px)"
//               }}
//               onMouseLeave={(e) => {
//                 const el = e.currentTarget as HTMLElement
//                 el.style.boxShadow = "none"
//                 el.style.borderColor = "#E8E4DC"
//                 el.style.transform = "translateY(0)"
//               }}
//             >
//               <div
//                 className="feat-card-img"
//                 style={{ position: "relative", minHeight: 340 }}
//               >
//                 <img
//                   src="https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=900&auto=format&fit=crop&q=80"
//                   alt="Switzerland"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                     position: "absolute",
//                     inset: 0,
//                   }}
//                 />
//                 <div
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     background:
//                       "linear-gradient(to right,transparent 60%,rgba(15,26,66,.05))",
//                   }}
//                 />
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: 18,
//                     left: 18,
//                     display: "flex",
//                     gap: 7,
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontFamily: f,
//                       fontSize: ".65rem",
//                       fontWeight: 700,
//                       padding: "4px 11px",
//                       borderRadius: 999,
//                       background: "rgba(27,43,107,0.85)",
//                       color: "#fff",
//                     }}
//                   >
//                     International
//                   </span>
//                   <span
//                     style={{
//                       fontFamily: f,
//                       fontSize: ".65rem",
//                       fontWeight: 700,
//                       padding: "4px 11px",
//                       borderRadius: 999,
//                       background: "#E53E3E",
//                       color: "#fff",
//                     }}
//                   >
//                     🔥 Bestseller
//                   </span>
//                 </div>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   padding: isMobile ? "28px 24px" : "40px 36px",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: 7,
//                     fontFamily: f,
//                     fontSize: ".65rem",
//                     fontWeight: 700,
//                     color: "#2E7D32",
//                     background: "#e8f5e9",
//                     padding: "5px 13px",
//                     borderRadius: 999,
//                     letterSpacing: ".08em",
//                     textTransform: "uppercase" as const,
//                     marginBottom: 16,
//                     width: "fit-content",
//                   }}
//                 >
//                   ✦ Featured Package
//                 </div>
//                 <div
//                   style={{
//                     fontFamily: "'Libre Baskerville',serif",
//                     fontSize: "1.6rem",
//                     fontWeight: 700,
//                     color: "#1B2B6B",
//                     lineHeight: 1.2,
//                     marginBottom: 12,
//                   }}
//                 >
//                   Swiss Alps &{" "}
//                   <em style={{ fontStyle: "italic", color: "#2E7D32" }}>
//                     Zurich
//                   </em>{" "}
//                   Splendour
//                 </div>
//                 <p
//                   style={{
//                     fontFamily: "'Raleway',sans-serif",
//                     fontSize: ".9rem",
//                     lineHeight: 1.75,
//                     color: "#5a5a7a",
//                     marginBottom: 20,
//                   }}
//                 >
//                   Glide through crystal-clear lakes, snow-kissed peaks, and
//                   charming Alpine villages on this 8-day Swiss masterpiece.
//                 </p>
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1fr",
//                     gap: 8,
//                     marginBottom: 24,
//                   }}
//                 >
//                   {[
//                     ["✈", "Return Flights"],
//                     ["🏨", "4-Star Hotels"],
//                     ["🍽", "Daily Breakfast"],
//                     ["🚌", "All Transfers"],
//                     ["📸", "Expert Guide"],
//                     ["🛡", "Travel Insurance"],
//                   ].map(([ico, txt]) => (
//                     <div
//                       key={txt}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 6,
//                         fontFamily: "'Raleway',sans-serif",
//                         fontSize: ".82rem",
//                         color: "#5a5a7a",
//                       }}
//                     >
//                       <span style={{ color: "#2E7D32" }}>{ico}</span>
//                       {txt}
//                     </div>
//                   ))}
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 5,
//                     marginBottom: 12,
//                   }}
//                 >
//                   <span
//                     style={{
//                       color: "#F59E0B",
//                       fontSize: ".75rem",
//                       letterSpacing: 1,
//                     }}
//                   >
//                     ★★★★★
//                   </span>
//                   <span
//                     style={{
//                       fontFamily: f,
//                       fontSize: ".78rem",
//                       fontWeight: 700,
//                       color: "#1a1a2e",
//                     }}
//                   >
//                     5.0
//                   </span>
//                   <span
//                     style={{
//                       fontFamily: f,
//                       fontSize: ".72rem",
//                       color: "#9494b0",
//                     }}
//                   >
//                     (527 reviews)
//                   </span>
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "flex-end",
//                     gap: 10,
//                     marginBottom: 20,
//                   }}
//                 >
//                   <div>
//                     <div
//                       style={{
//                         fontFamily: f,
//                         fontSize: ".7rem",
//                         color: "#9494b0",
//                         marginBottom: 4,
//                       }}
//                     >
//                       Starting from
//                     </div>
//                     <div
//                       style={{
//                         fontFamily: "'Libre Baskerville',serif",
//                         fontSize: "2rem",
//                         fontWeight: 700,
//                         color: "#1B2B6B",
//                       }}
//                     >
//                       ₹1,24,999
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       fontFamily: f,
//                       fontSize: ".88rem",
//                       color: "#9494b0",
//                       textDecoration: "line-through",
//                       marginBottom: 6,
//                     }}
//                   >
//                     ₹1,47,999 &nbsp;
//                     <span
//                       style={{
//                         color: "#E53E3E",
//                         fontWeight: 700,
//                         fontSize: ".82rem",
//                         textDecoration: "none",
//                       }}
//                     >
//                       15% off
//                     </span>
//                   </div>
//                 </div>
//                 <a
//                   href="#"
//                   style={{
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: 8,
//                     fontFamily: f,
//                     fontSize: ".85rem",
//                     fontWeight: 700,
//                     background: "#1B2B6B",
//                     color: "#fff",
//                     padding: "13px 28px",
//                     borderRadius: 999,
//                     textDecoration: "none",
//                     transition: "all .25s",
//                     width: "fit-content",
//                   }}
//                   onMouseEnter={(e) => {
//                     ;(e.currentTarget as HTMLElement).style.background =
//                       "#243590"
//                     ;(e.currentTarget as HTMLElement).style.transform =
//                       "translateY(-2px)"
//                   }}
//                   onMouseLeave={(e) => {
//                     ;(e.currentTarget as HTMLElement).style.background =
//                       "#1B2B6B"
//                     ;(e.currentTarget as HTMLElement).style.transform =
//                       "translateY(0)"
//                   }}
//                 >
//                   View Package →
//                 </a>
//               </div>
//             </div>

//             {/* Promo Strip */}
//             <div
//               className="promo-strip-inner"
//               style={{
//                 background: "linear-gradient(135deg,#2E7D32 0%,#43A047 100%)",
//                 borderRadius: 18,
//                 padding: isMobile ? "24px 20px" : "28px 36px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 gap: 24,
//                 marginBottom: 36,
//                 flexWrap: "wrap",
//               }}
//             >
//               <div>
//                 <h3
//                   style={{
//                     fontFamily: "'Libre Baskerville',serif",
//                     fontSize: "1.2rem",
//                     fontWeight: 700,
//                     color: "#fff",
//                     marginBottom: 4,
//                   }}
//                 >
//                   🎉 Group Discount Alert!
//                 </h3>
//                 <p
//                   style={{
//                     fontFamily: "'Raleway',sans-serif",
//                     fontSize: ".85rem",
//                     color: "rgba(255,255,255,.7)",
//                   }}
//                 >
//                   Travel with 6+ people and get flat 20% off on any package.
//                 </p>
//               </div>
//               <div
//                 style={{
//                   fontFamily: f,
//                   fontSize: "1.1rem",
//                   fontWeight: 700,
//                   color: "#fff",
//                   letterSpacing: ".12em",
//                   padding: "10px 20px",
//                   borderRadius: 10,
//                   background: "rgba(255,255,255,.18)",
//                   border: "1.5px dashed rgba(255,255,255,.4)",
//                 }}
//               >
//                 HORIZONS25
//               </div>
//               <a
//                 href="#"
//                 style={{
//                   fontFamily: f,
//                   fontSize: ".82rem",
//                   fontWeight: 700,
//                   background: "#fff",
//                   color: "#2E7D32",
//                   padding: "12px 24px",
//                   borderRadius: 999,
//                   textDecoration: "none",
//                   whiteSpace: "nowrap",
//                   transition: "all .25s",
//                 }}
//                 onMouseEnter={(e) =>
//                   ((e.currentTarget as HTMLElement).style.transform =
//                     "translateY(-2px)")
//                 }
//                 onMouseLeave={(e) =>
//                   ((e.currentTarget as HTMLElement).style.transform =
//                     "translateY(0)")
//                 }
//               >
//                 Claim Offer →
//               </a>
//             </div>

//             {/* Domestic */}
//             {(activeType === "all" || activeType === "domestic") &&
//               filteredDomestic.length > 0 && (
//                 <>
//                   <SecHeader
//                     eyebrow="Explore India"
//                     title="Domestic Packages"
//                     seeAll="See all 48 →"
//                   />
//                   <div
//                     style={{
//                       display: "grid",
//                       gridTemplateColumns: cardCols,
//                       gap: 22,
//                       marginBottom: 52,
//                     }}
//                   >
//                     {filteredDomestic.map((c) => (
//                       <PCard key={c.id} card={c} />
//                     ))}
//                   </div>
//                 </>
//               )}

//             {/* International */}
//             {(activeType === "all" || activeType === "international") &&
//               filteredIntl.length > 0 && (
//                 <>
//                   <SecHeader
//                     eyebrow="Beyond Borders"
//                     title="International Packages"
//                     seeAll="See all 96 →"
//                   />
//                   <div
//                     style={{
//                       display: "grid",
//                       gridTemplateColumns: cardCols,
//                       gap: 22,
//                       marginBottom: 52,
//                     }}
//                   >
//                     {filteredIntl.map((c) => (
//                       <PCard key={c.id} card={c} />
//                     ))}
//                   </div>
//                 </>
//               )}

//             {/* Empty */}
//             {totalVisible === 0 && (
//               <div style={{ textAlign: "center", padding: "80px 20px" }}>
//                 <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
//                 <h3
//                   style={{
//                     fontFamily: "'Libre Baskerville',serif",
//                     fontSize: "1.3rem",
//                     color: "#1B2B6B",
//                     marginBottom: 8,
//                   }}
//                 >
//                   No packages found
//                 </h3>
//                 <p
//                   style={{
//                     fontFamily: "'Raleway',sans-serif",
//                     fontSize: ".9rem",
//                     color: "#9494b0",
//                   }}
//                 >
//                   Try adjusting your filters or search term.
//                 </p>
//               </div>
//             )}

//             {/* Load More */}
//             {totalVisible > 0 && (
//               <div style={{ textAlign: "center", padding: "16px 0 32px" }}>
//                 <button
//                   onClick={() => {
//                     setLoadingMore(true)
//                     setTimeout(() => setLoadingMore(false), 1500)
//                   }}
//                   style={{
//                     fontFamily: f,
//                     fontSize: ".88rem",
//                     fontWeight: 600,
//                     background: "transparent",
//                     color: "#1B2B6B",
//                     border: "1.5px solid rgba(27,43,107,.2)",
//                     padding: "14px 40px",
//                     borderRadius: 999,
//                     cursor: "pointer",
//                     transition: "all .3s",
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: 8,
//                   }}
//                   onMouseEnter={(e) => {
//                     ;(e.currentTarget as HTMLButtonElement).style.background =
//                       "#1B2B6B"
//                     ;(e.currentTarget as HTMLButtonElement).style.color = "#fff"
//                     ;(e.currentTarget as HTMLButtonElement).style.borderColor =
//                       "#1B2B6B"
//                   }}
//                   onMouseLeave={(e) => {
//                     ;(e.currentTarget as HTMLButtonElement).style.background =
//                       "transparent"
//                     ;(e.currentTarget as HTMLButtonElement).style.color =
//                       "#1B2B6B"
//                     ;(e.currentTarget as HTMLButtonElement).style.borderColor =
//                       "rgba(27,43,107,.2)"
//                   }}
//                 >
//                   {loadingMore ? "Loading..." : "Load More Packages"} ↓
//                 </button>
//               </div>
//             )}
//           </main>
//         </div>

//         {/* ─── CTA ─── */}
//         <section
//           className="cta-sect"
//           style={{
//             background: "#0f1a42",
//             padding: "80px 64px",
//             textAlign: "center",
//             position: "relative",
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%,-50%)",
//               width: 600,
//               height: 600,
//               borderRadius: "50%",
//               background:
//                 "radial-gradient(circle,rgba(46,125,50,.1) 0%,transparent 70%)",
//               pointerEvents: "none",
//             }}
//           />
//           <h2
//             style={{
//               fontFamily: "'Libre Baskerville',serif",
//               fontSize: "clamp(1.8rem,3.5vw,3rem)",
//               fontWeight: 700,
//               color: "#fff",
//               marginBottom: 14,
//               position: "relative",
//               zIndex: 1,
//             }}
//           >
//             Can't Find Your{" "}
//             <em style={{ fontStyle: "italic", color: "#7ed88a" }}>
//               Dream Trip?
//             </em>
//           </h2>
//           <p
//             style={{
//               fontFamily: "'Raleway',sans-serif",
//               fontSize: ".95rem",
//               color: "rgba(255,255,255,.45)",
//               marginBottom: 36,
//               position: "relative",
//               zIndex: 1,
//             }}
//           >
//             Tell us where you want to go and we'll craft a custom itinerary just
//             for you.
//           </p>
//           <div
//             style={{
//               display: "flex",
//               gap: 14,
//               justifyContent: "center",
//               flexWrap: "wrap",
//               position: "relative",
//               zIndex: 1,
//             }}
//           >
//             <a
//               href="#"
//               style={{
//                 fontFamily: f,
//                 fontSize: ".88rem",
//                 fontWeight: 700,
//                 background: "#fff",
//                 color: "#1B2B6B",
//                 padding: "14px 32px",
//                 borderRadius: 999,
//                 textDecoration: "none",
//                 transition: "all .25s",
//               }}
//               onMouseEnter={(e) =>
//                 ((e.currentTarget as HTMLElement).style.transform =
//                   "translateY(-2px)")
//               }
//               onMouseLeave={(e) =>
//                 ((e.currentTarget as HTMLElement).style.transform =
//                   "translateY(0)")
//               }
//             >
//               Request Custom Trip ✈
//             </a>
//             <a
//               href="#"
//               style={{
//                 fontFamily: f,
//                 fontSize: ".88rem",
//                 fontWeight: 700,
//                 background: "transparent",
//                 color: "#fff",
//                 border: "1.5px solid rgba(255,255,255,.3)",
//                 padding: "13px 32px",
//                 borderRadius: 999,
//                 textDecoration: "none",
//                 transition: "all .25s",
//               }}
//               onMouseEnter={(e) => {
//                 ;(e.currentTarget as HTMLElement).style.borderColor = "#fff"
//                 ;(e.currentTarget as HTMLElement).style.transform =
//                   "translateY(-2px)"
//               }}
//               onMouseLeave={(e) => {
//                 ;(e.currentTarget as HTMLElement).style.borderColor =
//                   "rgba(255,255,255,.3)"
//                 ;(e.currentTarget as HTMLElement).style.transform =
//                   "translateY(0)"
//               }}
//             >
//               Talk to an Expert
//             </a>
//           </div>
//         </section>

//         {/* ─── FOOTER ─── */}
//         <footer
//           className="footer-sect"
//           style={{
//             background: "#0f1a42",
//             padding: "48px 64px 32px",
//             borderTop: "1px solid rgba(255,255,255,.04)",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               flexWrap: "wrap",
//               gap: 20,
//             }}
//           >
//             <div
//               style={{
//                 fontFamily: "'Libre Baskerville',serif",
//                 fontSize: "1.1rem",
//                 color: "#fff",
//               }}
//             >
//               ✈ Horizons <span style={{ color: "#7ed88a" }}>Travel</span>
//             </div>
//             <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
//               {["About", "Packages", "Contact", "Privacy"].map((l) => (
//                 <a
//                   key={l}
//                   href="#"
//                   style={{
//                     fontFamily: f,
//                     fontSize: ".75rem",
//                     color: "rgba(255,255,255,.38)",
//                     textDecoration: "none",
//                     transition: "color .2s",
//                   }}
//                   onMouseEnter={(e) =>
//                     ((e.currentTarget as HTMLElement).style.color = "#fff")
//                   }
//                   onMouseLeave={(e) =>
//                     ((e.currentTarget as HTMLElement).style.color =
//                       "rgba(255,255,255,.38)")
//                   }
//                 >
//                   {l}
//                 </a>
//               ))}
//             </div>
//             <div
//               style={{
//                 fontFamily: f,
//                 fontSize: ".72rem",
//                 color: "rgba(255,255,255,.22)",
//               }}
//             >
//               © 2026 Horizons Travel Co. All rights reserved.
//             </div>
//           </div>
//         </footer>
//       </div>
//     </>
//   )
// }

// export default Tourism

import React, { useState, useEffect, useRef } from "react"
import type { Page } from "./Navbar"

// ─── Types ────────────────────────────────────────────────
interface TourismProps {
  onNavigate: (page: Page) => void
}
interface PackageCard {
  id: number
  img: string
  type: "domestic" | "international"
  title: string
  destination: string
  duration: string
  pax: string
  rating: string
  ratingScore: string
  reviews: string
  price: string
  oldPrice?: string
  discount?: string
  label?: string
  badges: {
    text: string
    variant: "domestic" | "intl" | "hot" | "sale" | "new"
  }[]
  inclusions: string[]
}

// ─── Data ────────────────────────────────────────────────
export const domesticPackages: PackageCard[] = [
  {
    id: 1,
    type: "domestic",
    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80",
    title: "Kerala Backwaters Bliss",
    destination: "📍 Kerala, India",
    duration: "5 Days / 4 Nights",
    pax: "2–8 Pax",
    rating: "★★★★★",
    ratingScore: "4.9",
    reviews: "(312 reviews)",
    price: "₹18,999",
    oldPrice: "₹22,499",
    discount: "15% OFF",
    badges: [
      { text: "Domestic", variant: "domestic" },
      { text: "🔥 Top Pick", variant: "hot" },
    ],
    inclusions: ["🏨 Hotel", "🍽 Meals", "🚢 Houseboat", "🚌 Transfers"],
  },
  {
    id: 2,
    type: "domestic",
    img: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600&auto=format&fit=crop&q=80",
    title: "Rajasthan Royal Heritage Tour",
    destination: "📍 Rajasthan, India",
    duration: "7 Days / 6 Nights",
    pax: "2–12 Pax",
    rating: "★★★★½",
    ratingScore: "4.7",
    reviews: "(218 reviews)",
    price: "₹24,999",
    oldPrice: "₹29,999",
    discount: "17% OFF",
    badges: [
      { text: "Domestic", variant: "domestic" },
      { text: "New", variant: "new" },
    ],
    inclusions: ["🏰 Palace Stay", "🍽 Meals", "🐪 Camel Safari"],
  },
  {
    id: 3,
    type: "domestic",
    img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80",
    title: "Himachal Mountain Escape",
    destination: "📍 Himachal Pradesh, India",
    duration: "6 Days / 5 Nights",
    pax: "2–10 Pax",
    rating: "★★★★★",
    ratingScore: "4.8",
    reviews: "(145 reviews)",
    price: "₹15,999",
    label: "Best Value",
    badges: [{ text: "Domestic", variant: "domestic" }],
    inclusions: ["🏔 Trekking", "🏨 Resort", "🚌 Transfers"],
  },
  {
    id: 4,
    type: "domestic",
    img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80",
    title: "Goa Sun, Sand & Serenity",
    destination: "📍 Goa, India",
    duration: "4 Days / 3 Nights",
    pax: "2–6 Pax",
    rating: "★★★★",
    ratingScore: "4.5",
    reviews: "(389 reviews)",
    price: "₹12,999",
    oldPrice: "₹16,499",
    discount: "21% OFF",
    badges: [
      { text: "Domestic", variant: "domestic" },
      { text: "🏷 Sale", variant: "sale" },
    ],
    inclusions: ["🏖 Beach Resort", "🍹 Meals", "🛵 Bike Rental"],
  },
  {
    id: 5,
    type: "domestic",
    img: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&auto=format&fit=crop&q=80",
    title: "Andaman Island Retreat",
    destination: "📍 Andaman Islands, India",
    duration: "6 Days / 5 Nights",
    pax: "2–8 Pax",
    rating: "★★★★★",
    ratingScore: "4.9",
    reviews: "(267 reviews)",
    price: "₹28,999",
    oldPrice: "₹33,999",
    discount: "15% OFF",
    badges: [
      { text: "Domestic", variant: "domestic" },
      { text: "🔥 Trending", variant: "hot" },
    ],
    inclusions: ["✈ Flights", "🤿 Scuba", "🏨 Resort"],
  },
  {
    id: 6,
    type: "domestic",
    img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&auto=format&fit=crop&q=80",
    title: "Varanasi Spiritual Journey",
    destination: "📍 Varanasi, India",
    duration: "3 Days / 2 Nights",
    pax: "1–20 Pax",
    rating: "★★★★",
    ratingScore: "4.6",
    reviews: "(190 reviews)",
    price: "₹9,999",
    label: "Best Budget",
    badges: [{ text: "Domestic", variant: "domestic" }],
    inclusions: ["🛕 Temple Tour", "🚢 River Cruise", "🏨 Hotel"],
  },
]

export const intlPackages: PackageCard[] = [
  {
    id: 7,
    type: "international",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80",
    title: "Bali Bliss & Temple Escape",
    destination: "📍 Bali, Indonesia",
    duration: "7 Days / 6 Nights",
    pax: "2 Pax+",
    rating: "★★★★★",
    ratingScore: "4.9",
    reviews: "(418 reviews)",
    price: "₹54,999",
    oldPrice: "₹64,999",
    discount: "15% OFF",
    badges: [
      { text: "International", variant: "intl" },
      { text: "🔥 Bestseller", variant: "hot" },
    ],
    inclusions: ["✈ Flights", "🏨 Villa", "🍽 Breakfast", "🚌 Transfers"],
  },
  {
    id: 8,
    type: "international",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80",
    title: "Dubai Luxury Weekend Getaway",
    destination: "📍 Dubai, UAE",
    duration: "5 Days / 4 Nights",
    pax: "2 Pax+",
    rating: "★★★★½",
    ratingScore: "4.8",
    reviews: "(302 reviews)",
    price: "₹72,999",
    oldPrice: "₹85,999",
    discount: "15% OFF",
    badges: [
      { text: "International", variant: "intl" },
      { text: "🏷 Sale", variant: "sale" },
    ],
    inclusions: ["✈ Flights", "🏨 5-Star Hotel", "🐪 Desert Safari"],
  },
  {
    id: 9,
    type: "international",
    img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&auto=format&fit=crop&q=80",
    title: "Thailand Explorer Package",
    destination: "📍 Bangkok & Phuket, Thailand",
    duration: "8 Days / 7 Nights",
    pax: "2–10 Pax",
    rating: "★★★★★",
    ratingScore: "4.9",
    reviews: "(524 reviews)",
    price: "₹44,999",
    label: "Best Value",
    badges: [
      { text: "International", variant: "intl" },
      { text: "New", variant: "new" },
    ],
    inclusions: ["✈ Flights", "🏨 Hotel", "🏝 Island Tour"],
  },
  {
    id: 10,
    type: "international",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80",
    title: "Paris Romance & City of Lights",
    destination: "📍 Paris, France",
    duration: "9 Days / 8 Nights",
    pax: "2 Pax",
    rating: "★★★★★",
    ratingScore: "5.0",
    reviews: "(189 reviews)",
    price: "₹1,24,999",
    oldPrice: "₹1,44,999",
    discount: "14% OFF",
    badges: [
      { text: "International", variant: "intl" },
      { text: "🔥 Romantic", variant: "hot" },
    ],
    inclusions: ["✈ Flights", "🗼 Eiffel Tour", "🚢 Seine Cruise"],
  },
  {
    id: 11,
    type: "international",
    img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&auto=format&fit=crop&q=80",
    title: "Japan Cherry Blossom Trail",
    destination: "📍 Tokyo & Kyoto, Japan",
    duration: "10 Days / 9 Nights",
    pax: "2–8 Pax",
    rating: "★★★★★",
    ratingScore: "4.9",
    reviews: "(143 reviews)",
    price: "₹1,04,999",
    label: "Limited Seats",
    badges: [
      { text: "International", variant: "intl" },
      { text: "Seasonal", variant: "new" },
    ],
    inclusions: ["✈ Flights", "🚅 Bullet Train", "🏯 Temple Tour"],
  },
  {
    id: 12,
    type: "international",
    img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&auto=format&fit=crop&q=80",
    title: "Maldives Luxury Overwater Retreat",
    destination: "📍 Maldives",
    duration: "6 Days / 5 Nights",
    pax: "2 Pax",
    rating: "★★★★★",
    ratingScore: "5.0",
    reviews: "(97 reviews)",
    price: "₹1,89,999",
    oldPrice: "₹2,19,999",
    discount: "14% OFF",
    badges: [
      { text: "International", variant: "intl" },
      { text: "💎 Luxury", variant: "hot" },
    ],
    inclusions: ["✈ Flights", "🏝 Overwater Villa", "🍽 All Meals"],
  },
]

const marqueeItems = [
  "Kerala Backwaters",
  "Rajasthan Royal",
  "Bali Escape",
  "Swiss Alps",
  "Himachal Adventure",
  "Dubai Luxury",
  "Andaman Islands",
  "Paris Romance",
  "Goa Beaches",
  "Thailand Explorer",
]

export const destFilters = [
  { label: "India", count: 48 },
  { label: "Europe", count: 32 },
  { label: "South-East Asia", count: 36 },
  { label: "Middle East", count: 22 },
  { label: "Americas", count: 18 },
]
export const tripTypes = [
  { label: "Honeymoon", count: 28 },
  { label: "Family", count: 44 },
  { label: "Adventure", count: 30 },
  { label: "Solo Travel", count: 20 },
  { label: "Luxury", count: 16 },
]

export const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  domestic: { bg: "#e8f5e9", color: "#2E7D32" },
  intl: { bg: "rgba(27,43,107,0.85)", color: "#fff" },
  hot: { bg: "#E53E3E", color: "#fff" },
  sale: { bg: "#F59E0B", color: "#fff" },
  new: { bg: "#1B2B6B", color: "#fff" },
}

// ─── Mobile Sheet ─────────────────────────────────────────
const MobileSheet: React.FC<{
  open: boolean
  onClose: () => void
  children: React.ReactNode
}> = ({ open, onClose, children }) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(2px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 999,
          width: "min(320px,88vw)",
          background: "#fff",
          boxShadow: "4px 0 32px rgba(0,0,0,0.18)",
          overflowY: "auto",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(.25,.46,.45,.94)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1.5px solid #E8E4DC",
            background: "#F7F5F0",
            cursor: "pointer",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#5a5a7a",
          }}
        >
          ×
        </button>
        {children}
      </div>
    </>
  )
}

// ─── Sidebar Content ──────────────────────────────────────
interface SidebarContentProps {
  search: string
  setSearch: (v: string) => void
  activeType: "all" | "domestic" | "international"
  setActiveType: (v: "all" | "domestic" | "international") => void
  maxPrice: number
  setMaxPrice: (v: number) => void
  activeDur: string
  setActiveDur: (v: string) => void
  onReset: () => void
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  search,
  setSearch,
  activeType,
  setActiveType,
  maxPrice,
  setMaxPrice,
  activeDur,
  setActiveDur,
  onReset,
}) => {
  const pricePct = ((maxPrice - 5000) / (200000 - 5000)) * 100
  const fmtPrice = (v: number) => "₹" + v.toLocaleString("en-IN")
  const durations = ["Any", "1–3 Days", "4–7 Days", "8–14 Days", "15+ Days"]
  const f = "'Inter',sans-serif"
  const lbl = (t: string) => (
    <div
      style={{
        fontFamily: f,
        fontSize: ".68rem",
        fontWeight: 700,
        color: "#9494b0",
        letterSpacing: ".14em",
        textTransform: "uppercase" as const,
        marginBottom: 14,
      }}
    >
      {t}
    </div>
  )
  return (
    <div
      style={{ padding: "48px 28px 32px", fontFamily: "'Raleway',sans-serif" }}
    >
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 36 }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search destinations..."
          style={{
            width: "100%",
            padding: "13px 44px 13px 18px",
            borderRadius: 12,
            border: "1.5px solid #E8E4DC",
            fontFamily: "'Raleway',sans-serif",
            fontSize: ".9rem",
            color: "#1a1a2e",
            background: "#FAF8F4",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#1B2B6B")}
          onBlur={(e) => (e.target.style.borderColor = "#E8E4DC")}
        />
        <span
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9494b0",
            fontSize: ".85rem",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
      </div>

      {/* Type Toggle */}
      {lbl("Package Type")}
      <div
        style={{
          display: "flex",
          background: "#F7F5F0",
          borderRadius: 12,
          padding: 4,
          gap: 4,
          marginBottom: 32,
        }}
      >
        {(["all", "domestic", "international"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            style={{
              flex: 1,
              padding: "10px 4px",
              borderRadius: 9,
              border: "none",
              fontFamily: f,
              fontSize: ".76rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all .25s",
              background: activeType === t ? "#1B2B6B" : "transparent",
              color: activeType === t ? "#fff" : "#9494b0",
              boxShadow:
                activeType === t ? "0 4px 14px rgba(27,43,107,.2)" : "none",
              letterSpacing: ".04em",
            }}
          >
            {t === "all" ? "All" : t === "domestic" ? "Domestic" : "Intl"}
          </button>
        ))}
      </div>

      {/* Destinations */}
      {lbl("Destinations")}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 32,
        }}
      >
        {destFilters.map((d) => (
          <label
            key={d.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
          >
            <input type="checkbox" defaultChecked style={{ display: "none" }} />
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                border: "1.5px solid #E8E4DC",
                background: "#1B2B6B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{ color: "#fff", fontSize: ".65rem", fontWeight: 700 }}
              >
                ✓
              </span>
            </div>
            <span
              style={{
                fontFamily: f,
                fontSize: ".88rem",
                color: "#5a5a7a",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              {d.label}
              <span
                style={{
                  fontFamily: f,
                  fontSize: ".72rem",
                  color: "#9494b0",
                  background: "#F7F5F0",
                  padding: "2px 8px",
                  borderRadius: 999,
                }}
              >
                {d.count}
              </span>
            </span>
          </label>
        ))}
      </div>

      {/* Price Range */}
      {lbl("Budget (₹ per person)")}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: f,
            fontSize: ".8rem",
            fontWeight: 600,
            color: "#1B2B6B",
            marginBottom: 12,
          }}
        >
          <span>₹5,000</span>
          <span>{fmtPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={5000}
          max={200000}
          step={5000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(+e.target.value)}
          style={{
            width: "100%",
            height: 4,
            borderRadius: 2,
            appearance: "none" as any,
            WebkitAppearance: "none",
            outline: "none",
            cursor: "pointer",
            background: `linear-gradient(to right,#1B2B6B 0%,#1B2B6B ${pricePct}%,#E8E4DC ${pricePct}%,#E8E4DC 100%)`,
          }}
        />
      </div>

      {/* Duration */}
      {lbl("Duration")}
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}
      >
        {durations.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDur(d)}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: `1.5px solid ${activeDur === d ? "#1B2B6B" : "#E8E4DC"}`,
              fontFamily: f,
              fontSize: ".76rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all .2s",
              background: activeDur === d ? "#1B2B6B" : "#fff",
              color: activeDur === d ? "#fff" : "#5a5a7a",
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Trip Type */}
      {lbl("Trip Type")}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 32,
        }}
      >
        {tripTypes.map((t) => (
          <label
            key={t.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
          >
            <input type="checkbox" defaultChecked style={{ display: "none" }} />
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                border: "1.5px solid #1B2B6B",
                background: "#1B2B6B",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: f,
                fontSize: ".88rem",
                color: "#5a5a7a",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              {t.label}
              <span
                style={{
                  fontFamily: f,
                  fontSize: ".72rem",
                  color: "#9494b0",
                  background: "#F7F5F0",
                  padding: "2px 8px",
                  borderRadius: 999,
                }}
              >
                {t.count}
              </span>
            </span>
          </label>
        ))}
      </div>

      {/* Sort */}
      {lbl("Sort By")}
      <select
        style={{
          width: "100%",
          padding: "11px 16px",
          border: "1.5px solid #E8E4DC",
          borderRadius: 10,
          fontFamily: "'Raleway',sans-serif",
          fontSize: ".88rem",
          color: "#1a1a2e",
          background: "#FAF8F4",
          outline: "none",
          cursor: "pointer",
          marginBottom: 16,
        }}
      >
        {[
          "Most Popular",
          "Price: Low to High",
          "Price: High to Low",
          "Rating",
          "Duration",
          "Newest",
        ].map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>

      <button
        onClick={onReset}
        style={{
          width: "100%",
          padding: "12px",
          border: "1.5px solid #E8E4DC",
          borderRadius: 12,
          fontFamily: f,
          fontSize: ".82rem",
          fontWeight: 600,
          color: "#5a5a7a",
          background: "#fff",
          cursor: "pointer",
          transition: "all .2s",
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#1B2B6B"
          ;(e.currentTarget as HTMLButtonElement).style.color = "#1B2B6B"
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#E8E4DC"
          ;(e.currentTarget as HTMLButtonElement).style.color = "#5a5a7a"
        }}
      >
        ↺ &nbsp;Reset All Filters
      </button>
    </div>
  )
}

// ─── Package Card ─────────────────────────────────────────
export const PCard: React.FC<{ card: PackageCard; listView: boolean }> = ({
  card,
  listView,
}) => {
  const [wished, setWished] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.style.opacity = "1"
          el.style.transform = "translateY(0)"
        }
      },
      { threshold: 0.08 }
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [])
  const f = "'Inter',sans-serif"
  return (
    <div
      ref={ref}
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid #E8E4DC",
        transition: "all .38s cubic-bezier(.25,.46,.45,.94)",
        opacity: 0,
        transform: "translateY(28px)",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = "translateY(-8px)"
        el.style.boxShadow = "0 28px 72px rgba(27,43,107,.12)"
        el.style.borderColor = "transparent"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = "translateY(0)"
        el.style.boxShadow = "none"
        el.style.borderColor = "#E8E4DC"
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          height: listView ? 220 : 210,
          overflow: "hidden",
        }}
      >
        <img
          src={card.img}
          alt={card.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform .7s ease",
            display: "block",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.transform = "scale(1.08)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.transform = "scale(1)")
          }
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top,rgba(15,26,66,.55) 0%,transparent 55%)",
          }}
        />
        {/* Badges */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            display: "flex",
            gap: 7,
            flexWrap: "wrap",
          }}
        >
          {card.badges.map((b, i) => {
            const s = BADGE_STYLES[b.variant] || { bg: "#ccc", color: "#fff" }
            return (
              <span
                key={i}
                style={{
                  fontFamily: f,
                  fontSize: ".65rem",
                  fontWeight: 700,
                  padding: "4px 11px",
                  borderRadius: 999,
                  letterSpacing: ".05em",
                  background: s.bg,
                  color: s.color,
                }}
              >
                {b.text}
              </span>
            )
          })}
        </div>
        {/* Wishlist */}
        <button
          onClick={() => setWished((w) => !w)}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "rgba(255,255,255,.9)",
            backdropFilter: "blur(6px)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: ".9rem",
            cursor: "pointer",
            transition: "all .2s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.transform =
              "scale(1.15)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.transform =
              "scale(1)")
          }
        >
          <span
            style={{
              color: wished ? "#E53E3E" : "#9494b0",
              transition: "color .2s",
            }}
          >
            {wished ? "♥" : "♡"}
          </span>
        </button>
        {/* Price on image */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            right: 14,
            textAlign: "right",
          }}
        >
          {card.oldPrice && (
            <div
              style={{
                fontFamily: f,
                fontSize: ".68rem",
                color: "rgba(255,255,255,.55)",
                textDecoration: "line-through",
              }}
            >
              {card.oldPrice}
            </div>
          )}
          <div
            style={{
              fontFamily: "'Libre Baskerville',serif",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1,
            }}
          >
            {card.price}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 22px 22px" }}>
        <div
          style={{
            fontFamily: f,
            fontSize: ".68rem",
            fontWeight: 700,
            color: "#2E7D32",
            letterSpacing: ".1em",
            textTransform: "uppercase" as const,
            marginBottom: 6,
          }}
        >
          {card.destination}
        </div>
        <div
          style={{
            fontFamily: "'Libre Baskerville',serif",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#1B2B6B",
            marginBottom: 10,
            lineHeight: 1.3,
          }}
        >
          {card.title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontFamily: f,
              fontSize: ".75rem",
              color: "#9494b0",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            🗓 {card.duration}
          </span>
          <span
            style={{
              fontFamily: f,
              fontSize: ".75rem",
              color: "#9494b0",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            👥 {card.pax}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginBottom: 14,
          }}
        >
          <span
            style={{ color: "#F59E0B", fontSize: ".75rem", letterSpacing: 1 }}
          >
            {card.rating}
          </span>
          <span
            style={{
              fontFamily: f,
              fontSize: ".78rem",
              fontWeight: 700,
              color: "#1a1a2e",
            }}
          >
            {card.ratingScore}
          </span>
          <span style={{ fontFamily: f, fontSize: ".72rem", color: "#9494b0" }}>
            {card.reviews}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          {card.inclusions.map((inc, i) => (
            <span
              key={i}
              style={{
                fontFamily: f,
                fontSize: ".66rem",
                fontWeight: 500,
                color: "#5a5a7a",
                background: "#F7F5F0",
                borderRadius: 6,
                padding: "4px 9px",
              }}
            >
              {inc}
            </span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 14,
            borderTop: "1px solid #E8E4DC",
          }}
        >
          {card.discount ? (
            <span
              style={{
                fontFamily: f,
                fontSize: ".72rem",
                fontWeight: 700,
                color: "#E53E3E",
                background: "rgba(229,62,62,.08)",
                padding: "4px 10px",
                borderRadius: 999,
              }}
            >
              {card.discount}
            </span>
          ) : (
            <span
              style={{
                fontFamily: f,
                fontSize: ".72rem",
                fontWeight: 700,
                color:
                  card.label === "Best Value" || card.label === "Best Budget"
                    ? "#2E7D32"
                    : "#9494b0",
              }}
            >
              {card.label}
            </span>
          )}
          <button
            style={{
              fontFamily: f,
              fontSize: ".78rem",
              fontWeight: 700,
              background: "#1B2B6B",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              transition: "all .25s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background =
                "#243590"
              ;(e.currentTarget as HTMLButtonElement).style.transform =
                "translateX(2px)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background =
                "#1B2B6B"
              ;(e.currentTarget as HTMLButtonElement).style.transform =
                "translateX(0)"
            }}
          >
            Book Now →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────
export const SecHeader: React.FC<{
  eyebrow: string
  title: string
  seeAll?: string
}> = ({ eyebrow, title, seeAll }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
    }}
  >
    <div>
      <div
        style={{
          fontFamily: "'Inter',sans-serif",
          fontSize: ".7rem",
          fontWeight: 700,
          color: "#2E7D32",
          letterSpacing: ".16em",
          textTransform: "uppercase" as const,
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 4,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 20,
            height: 1.5,
            background: "#2E7D32",
          }}
        />
        {eyebrow}
      </div>
      <div
        style={{
          fontFamily: "'Libre Baskerville',serif",
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#1B2B6B",
        }}
      >
        {title}
      </div>
    </div>
    {seeAll && (
      <a
        href="#"
        style={{
          fontFamily: "'Inter',sans-serif",
          fontSize: ".78rem",
          fontWeight: 600,
          color: "#1B2B6B",
          opacity: 0.6,
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "opacity .2s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.opacity = "1")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.opacity = ".6")
        }
      >
        {seeAll}
      </a>
    )}
  </div>
)

// ─── Main Component ───────────────────────────────────────
const Tourism: React.FC<TourismProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState("")
  const [activeType, setActiveType] = useState<
    "all" | "domestic" | "international"
  >("all")
  const [maxPrice, setMaxPrice] = useState(200000)
  const [activeDur, setActiveDur] = useState("Any")
  const [gridView, setGridView] = useState<"grid" | "list">("grid")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  )

  useEffect(() => {
    const fn = () => setVw(window.innerWidth)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])

  const isMobile = vw < 900
  const isTablet = vw >= 900 && vw < 1100

  // Measure actual navbar height dynamically
  const [NAV_H, setNavH] = useState(73)
  useEffect(() => {
    const measure = () => {
      const nav =
        document.querySelector("nav") ||
        document.querySelector("header") ||
        document.querySelector("[class*='navbar']") ||
        document.querySelector("[class*='Navbar']")
      if (nav) {
        const h = (nav as HTMLElement).getBoundingClientRect().height
        if (h > 0) setNavH(Math.ceil(h))
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  // Fix parent overflow that kills position:sticky — walk ancestors and remove overflow:hidden/auto/scroll
  const pageWrapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!pageWrapRef.current) return
    const fixed: Array<{ el: HTMLElement; prev: string }> = []
    let el = pageWrapRef.current.parentElement
    while (el && el !== document.body) {
      const ov =
        window.getComputedStyle(el).overflow +
        window.getComputedStyle(el).overflowY +
        window.getComputedStyle(el).overflowX
      if (/auto|scroll|hidden/.test(ov)) {
        fixed.push({ el, prev: el.style.overflow })
        el.style.overflow = "visible"
      }
      el = el.parentElement
    }
    return () => {
      fixed.forEach(({ el, prev }) => {
        el.style.overflow = prev
      })
    }
  }, [])

  const filteredDomestic = domesticPackages.filter((c) => {
    if (activeType === "international") return false
    return !search || c.title.toLowerCase().includes(search.toLowerCase())
  })
  const filteredIntl = intlPackages.filter((c) => {
    if (activeType === "domestic") return false
    return !search || c.title.toLowerCase().includes(search.toLowerCase())
  })
  const totalVisible = filteredDomestic.length + filteredIntl.length

  const sidebarProps = {
    search,
    setSearch,
    activeType,
    setActiveType,
    maxPrice,
    setMaxPrice,
    activeDur,
    setActiveDur,
    onReset: () => {
      setSearch("")
      setActiveType("all")
      setMaxPrice(200000)
      setActiveDur("Any")
    },
  }

  // Grid columns — matches HTML: 3-col default, 2-col on tablet, 1-col list/mobile
  const cardCols =
    gridView === "list"
      ? "1fr"
      : isMobile
        ? "1fr"
        : isTablet
          ? "repeat(2,1fr)"
          : "repeat(3,1fr)"
  const f = "'Inter',sans-serif"

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Raleway:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes fsu{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes mqscroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .t-h1-anim{opacity:0;animation:fsu 1s .35s forwards}
        .t-eye-anim{opacity:0;animation:fsu .9s .2s forwards}
        .t-meta-anim{opacity:0;animation:fsu 1s .5s forwards}
        .mq-run{animation:mqscroll 30s linear infinite}
        input[type=range]{-webkit-appearance:none;appearance:none;height:4px;border-radius:2px;outline:none;cursor:pointer}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#1B2B6B;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(27,43,107,.3);cursor:pointer}
        .tourism-sidebar::-webkit-scrollbar{width:3px}
        .tourism-sidebar::-webkit-scrollbar-thumb{background:#E8E4DC}
        @media(max-width:540px){
          .hero-sect{height:60vh!important;padding:0 20px 48px!important}
          .fb-img-wrap{display:none!important}
          .feat-banner-inner{grid-template-columns:1fr!important}
          .cta-sect{padding:60px 20px!important}
          .footer-sect{padding:40px 20px 24px!important}
          .promo-strip-inner{flex-direction:column!important;text-align:center!important}
        }
        @media(max-width:900px){
          .feat-card-inner{grid-template-columns:1fr!important}
          .feat-card-img{min-height:220px!important}
        }
        @media(min-width:900px){.mob-filter-bar{display:none!important}}
        @media(max-width:899px){.tourism-sidebar{display:none!important}}
      `}</style>

      <div
        style={{
          fontFamily: "'Raleway',sans-serif",
          background: "#F7F5F0",
          color: "#1a1a2e",
          overflowX: "hidden",
        }}
      >
        {/* ─── HERO ─── */}
        <section
          className="hero-sect"
          style={{
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            height: "72vh",
            minHeight: 560,
            padding: "0 64px 80px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "url('https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1800&auto=format&fit=crop&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "transform 8s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.transform = "scale(1)")
            }
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg,rgba(15,26,66,.25) 0%,rgba(15,26,66,.15) 30%,rgba(15,26,66,.7) 70%,rgba(15,26,66,.92) 100%)",
            }}
          />
          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              className="t-eye-anim"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: f,
                fontSize: ".72rem",
                fontWeight: 600,
                color: "rgba(255,255,255,.5)",
                letterSpacing: ".16em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 30,
                  height: 1,
                  background: "rgba(255,255,255,.35)",
                }}
              />
              Explore · Discover · Experience
            </div>
            <h1
              className="t-h1-anim"
              style={{
                fontFamily: "'Libre Baskerville',serif",
                fontSize: "clamp(2.4rem,5.5vw,5.5rem)",
                fontWeight: 700,
                lineHeight: 1.02,
                color: "#fff",
                marginBottom: 28,
              }}
            >
              Find Your Perfect
              <br />
              <em style={{ fontStyle: "italic", color: "#7ed88a" }}>
                Tour Package
              </em>
            </h1>
            <div
              className="t-meta-anim"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              {[
                ["240+", "Curated Packages"],
                ["Domestic & International", ""],
                ["All Budgets", "Welcome"],
              ].map(([b, r], i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <div
                      style={{
                        width: 1,
                        height: 20,
                        background: "rgba(255,255,255,.2)",
                      }}
                    />
                  )}
                  <div
                    style={{
                      fontFamily: f,
                      fontSize: ".82rem",
                      color: "rgba(255,255,255,.55)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <strong style={{ color: "#fff", fontWeight: 600 }}>
                      {b}
                    </strong>
                    {r && <span>{r}</span>}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MARQUEE ─── */}
        {/* <div
          style={{
            background: "#1B2B6B",
            overflow: "hidden",
            padding: "16px 0",
          }}
        >
          <div
            className="mq-run"
            style={{ display: "flex", width: "max-content" }}
          >
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <div
                key={i}
                style={{
                  fontFamily: f,
                  fontSize: ".7rem",
                  fontWeight: 500,
                  color: "rgba(255,255,255,.38)",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  padding: "0 32px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#43A047",
                    flexShrink: 0,
                  }}
                />
                {item}
              </div>
            ))}
          </div>
        </div> */}

        {/* ─── MOBILE FILTER BAR ─── */}
        <div
          className="mob-filter-bar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            background: "#fff",
            borderBottom: "1px solid #E8E4DC",
          }}
        >
          <span
            style={{
              fontFamily: f,
              fontSize: ".82rem",
              fontWeight: 600,
              color: "#1B2B6B",
            }}
          >
            {totalVisible} Packages Found
          </span>
          <button
            onClick={() => setSheetOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 18px",
              borderRadius: 999,
              border: "1.5px solid #E8E4DC",
              fontFamily: f,
              fontSize: ".78rem",
              fontWeight: 600,
              color: "#1B2B6B",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <span>⚙</span> Filters & Sort
          </button>
        </div>

        {/* ─── MOBILE SHEET ─── */}
        <MobileSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
          <div style={{ paddingTop: 8 }}>
            <div
              style={{
                padding: "20px 28px 12px",
                borderBottom: "1px solid #E8E4DC",
              }}
            >
              <div
                style={{
                  fontFamily: "'Libre Baskerville',serif",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#1B2B6B",
                }}
              >
                Filters & Sort
              </div>
              <div
                style={{
                  fontFamily: f,
                  fontSize: ".78rem",
                  color: "#9494b0",
                  marginTop: 2,
                }}
              >
                {totalVisible} packages match
              </div>
            </div>
            <SidebarContent {...sidebarProps} />
          </div>
        </MobileSheet>

        {/* ─── PAGE LAYOUT — grid matches HTML .page-wrap exactly ─── */}
        <div
          ref={pageWrapRef}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
                ? "260px 1fr"
                : "300px 1fr",
            alignItems: "start",
          }}
        >
          {/* ─── SIDEBAR — position:sticky, align-self:start (required for sticky in grid) ─── */}
          <aside
            className="tourism-sidebar"
            style={{
              position: "sticky",
              top: NAV_H,
              alignSelf: "start",
              height: `calc(100vh - ${NAV_H}px)`,
              overflowY: "auto",
              background: "#fff",
              borderRight: "1px solid #E8E4DC",
            }}
          >
            <SidebarContent {...sidebarProps} />
          </aside>

          {/* ─── MAIN CONTENT ─── */}
          <main
            className="bg-white!"
            style={{
              minWidth: 0,
              padding: isMobile
                ? "28px 16px"
                : isTablet
                  ? "36px 28px"
                  : "48px 52px",
              overflowX: "hidden",
            }}
          >
            {/* Results bar */}
            {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 40,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontFamily: "'Libre Baskerville',serif",
                  fontSize: isMobile ? "1.2rem" : "1.5rem",
                  fontWeight: 700,
                  color: "#1B2B6B",
                }}
              >
                Showing <span style={{ color: "#2E7D32" }}>{totalVisible}</span>{" "}
                Packages
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {(["grid", "list"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setGridView(v)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: `1.5px solid ${gridView === v ? "#1B2B6B" : "#E8E4DC"}`,
                      background: gridView === v ? "#1B2B6B" : "#fff",
                      color: gridView === v ? "#fff" : "#9494b0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: ".85rem",
                      transition: "all .2s",
                    }}
                  >
                    {v === "grid" ? "⊞" : "☰"}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Featured Banner */}
            {/* <div
              className="feat-banner-inner"
              style={{
                background:
                  "linear-gradient(135deg,#1B2B6B 0%,#243590 50%,#243590 100%)",
                borderRadius: 22,
                padding: isMobile ? "28px 24px" : "40px 44px",
                marginBottom: 36,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: 32,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: -60,
                  top: -60,
                  width: 280,
                  height: 280,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle,rgba(46,125,50,.2) 0%,transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    background: "rgba(255,255,255,.12)",
                    border: "1px solid rgba(255,255,255,.18)",
                    borderRadius: 999,
                    padding: "6px 16px",
                    fontFamily: f,
                    fontSize: ".68rem",
                    fontWeight: 700,
                    color: "rgba(255,255,255,.8)",
                    letterSpacing: ".1em",
                    textTransform: "uppercase" as const,
                    marginBottom: 14,
                  }}
                >
                  ✦ &nbsp;Limited Time Offer
                </div>
                <div
                  style={{
                    fontFamily: "'Libre Baskerville',serif",
                    fontSize: isMobile ? "1.4rem" : "1.8rem",
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1.2,
                    marginBottom: 10,
                  }}
                >
                  Early Bird{" "}
                  <em style={{ fontStyle: "italic", color: "#7ed88a" }}>
                    Summer Sale
                  </em>
                </div>
                <div
                  style={{
                    fontFamily: "'Raleway',sans-serif",
                    fontSize: ".9rem",
                    color: "rgba(255,255,255,.55)",
                    maxWidth: 440,
                    marginBottom: 20,
                  }}
                >
                  Book before June 30th and get up to 25% off on all
                  international packages. Use code HORIZONS25 at checkout.
                </div>
                <a
                  href="#"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: f,
                    fontSize: ".82rem",
                    fontWeight: 600,
                    color: "#fff",
                    background: "rgba(255,255,255,.14)",
                    border: "1px solid rgba(255,255,255,.2)",
                    padding: "10px 22px",
                    borderRadius: 999,
                    textDecoration: "none",
                    transition: "all .25s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,.22)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,.14)")
                  }
                >
                  Explore Offers →
                </a>
              </div>
              <div
                className="fb-img-wrap"
                style={{
                  width: 200,
                  height: 130,
                  borderRadius: 16,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80"
                  alt="Offer"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div> */}

            {/* Featured Card */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 40,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontFamily: "'Libre Baskerville',serif",
                  fontSize: isMobile ? "1.2rem" : "1.5rem",
                  fontWeight: 700,
                  color: "#1B2B6B",
                }}
              >
                <span style={{ color: "#2E7D32" }}>Featured</span> Packages
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {(["grid", "list"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setGridView(v)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: `1.5px solid ${gridView === v ? "#1B2B6B" : "#E8E4DC"}`,
                      background: gridView === v ? "#1B2B6B" : "#fff",
                      color: gridView === v ? "#fff" : "#9494b0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: ".85rem",
                      transition: "all .2s",
                    }}
                  >
                    {v === "grid" ? "⊞" : "☰"}
                  </button>
                ))}
              </div>
            </div>
            <div
              className="feat-card-inner"
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr",
                borderRadius: 22,
                overflow: "hidden",
                border: "1px solid #E8E4DC",
                background: "#fff",
                marginBottom: 32,
                transition: "all .38s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.boxShadow = "0 28px 72px rgba(27,43,107,.12)"
                el.style.borderColor = "transparent"
                el.style.transform = "translateY(-5px)"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.boxShadow = "none"
                el.style.borderColor = "#E8E4DC"
                el.style.transform = "translateY(0)"
              }}
            >
              <div
                className="feat-card-img"
                style={{ position: "relative", minHeight: 340 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=900&auto=format&fit=crop&q=80"
                  alt="Switzerland"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    inset: 0,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to right,transparent 60%,rgba(15,26,66,.05))",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 18,
                    left: 18,
                    display: "flex",
                    gap: 7,
                  }}
                >
                  <span
                    style={{
                      fontFamily: f,
                      fontSize: ".65rem",
                      fontWeight: 700,
                      padding: "4px 11px",
                      borderRadius: 999,
                      background: "rgba(27,43,107,0.85)",
                      color: "#fff",
                    }}
                  >
                    International
                  </span>
                  <span
                    style={{
                      fontFamily: f,
                      fontSize: ".65rem",
                      fontWeight: 700,
                      padding: "4px 11px",
                      borderRadius: 999,
                      background: "#E53E3E",
                      color: "#fff",
                    }}
                  >
                    🔥 Bestseller
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: isMobile ? "28px 24px" : "40px 36px",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontFamily: f,
                    fontSize: ".65rem",
                    fontWeight: 700,
                    color: "#2E7D32",
                    background: "#e8f5e9",
                    padding: "5px 13px",
                    borderRadius: 999,
                    letterSpacing: ".08em",
                    textTransform: "uppercase" as const,
                    marginBottom: 16,
                    width: "fit-content",
                  }}
                >
                  ✦ Featured Package
                </div>
                <div
                  style={{
                    fontFamily: "'Libre Baskerville',serif",
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "#1B2B6B",
                    lineHeight: 1.2,
                    marginBottom: 12,
                  }}
                >
                  Swiss Alps &{" "}
                  <em style={{ fontStyle: "italic", color: "#2E7D32" }}>
                    Zurich
                  </em>{" "}
                  Splendour
                </div>
                <p
                  style={{
                    fontFamily: "'Raleway',sans-serif",
                    fontSize: ".9rem",
                    lineHeight: 1.75,
                    color: "#5a5a7a",
                    marginBottom: 20,
                  }}
                >
                  Glide through crystal-clear lakes, snow-kissed peaks, and
                  charming Alpine villages on this 8-day Swiss masterpiece.
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    marginBottom: 24,
                  }}
                >
                  {[
                    ["✈", "Return Flights"],
                    ["🏨", "4-Star Hotels"],
                    ["🍽", "Daily Breakfast"],
                    ["🚌", "All Transfers"],
                    ["📸", "Expert Guide"],
                    ["🛡", "Travel Insurance"],
                  ].map(([ico, txt]) => (
                    <div
                      key={txt}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: "'Raleway',sans-serif",
                        fontSize: ".82rem",
                        color: "#5a5a7a",
                      }}
                    >
                      <span style={{ color: "#2E7D32" }}>{ico}</span>
                      {txt}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      color: "#F59E0B",
                      fontSize: ".75rem",
                      letterSpacing: 1,
                    }}
                  >
                    ★★★★★
                  </span>
                  <span
                    style={{
                      fontFamily: f,
                      fontSize: ".78rem",
                      fontWeight: 700,
                      color: "#1a1a2e",
                    }}
                  >
                    5.0
                  </span>
                  <span
                    style={{
                      fontFamily: f,
                      fontSize: ".72rem",
                      color: "#9494b0",
                    }}
                  >
                    (527 reviews)
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: f,
                        fontSize: ".7rem",
                        color: "#9494b0",
                        marginBottom: 4,
                      }}
                    >
                      Starting from
                    </div>
                    <div
                      style={{
                        fontFamily: "'Libre Baskerville',serif",
                        fontSize: "2rem",
                        fontWeight: 700,
                        color: "#1B2B6B",
                      }}
                    >
                      ₹1,24,999
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: f,
                      fontSize: ".88rem",
                      color: "#9494b0",
                      textDecoration: "line-through",
                      marginBottom: 6,
                    }}
                  >
                    ₹1,47,999 &nbsp;
                    <span
                      style={{
                        color: "#E53E3E",
                        fontWeight: 700,
                        fontSize: ".82rem",
                        textDecoration: "none",
                      }}
                    >
                      15% off
                    </span>
                  </div>
                </div>
                <a
                  href="#"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: f,
                    fontSize: ".85rem",
                    fontWeight: 700,
                    background: "#1B2B6B",
                    color: "#fff",
                    padding: "13px 28px",
                    borderRadius: 999,
                    textDecoration: "none",
                    transition: "all .25s",
                    width: "fit-content",
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background =
                      "#243590"
                    ;(e.currentTarget as HTMLElement).style.transform =
                      "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background =
                      "#1B2B6B"
                    ;(e.currentTarget as HTMLElement).style.transform =
                      "translateY(0)"
                  }}
                >
                  View Package →
                </a>
              </div>
            </div>

            {/* Promo Strip */}
            <div
              className="promo-strip-inner"
              style={{
                background: "linear-gradient(135deg,#2E7D32 0%,#43A047 100%)",
                borderRadius: 18,
                padding: isMobile ? "24px 20px" : "28px 36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 24,
                marginBottom: 36,
                flexWrap: "wrap",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "'Libre Baskerville',serif",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 4,
                  }}
                >
                  🎉 Group Discount Alert!
                </h3>
                <p
                  style={{
                    fontFamily: "'Raleway',sans-serif",
                    fontSize: ".85rem",
                    color: "rgba(255,255,255,.7)",
                  }}
                >
                  Travel with 6+ people and get flat 20% off on any package.
                </p>
              </div>
              <div
                style={{
                  fontFamily: f,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: ".12em",
                  padding: "10px 20px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,.18)",
                  border: "1.5px dashed rgba(255,255,255,.4)",
                }}
              >
                HORIZONS25
              </div>
              <a
                href="#"
                style={{
                  fontFamily: f,
                  fontSize: ".82rem",
                  fontWeight: 700,
                  background: "#fff",
                  color: "#2E7D32",
                  padding: "12px 24px",
                  borderRadius: 999,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "all .25s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.transform =
                    "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)")
                }
              >
                Claim Offer →
              </a>
            </div>

            {/* Domestic Packages */}
            {(activeType === "all" || activeType === "domestic") &&
              filteredDomestic.length > 0 && (
                <>
                  <SecHeader
                    eyebrow="Explore India"
                    title="Domestic Packages"
                    seeAll="See all 48 →"
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: cardCols,
                      gap: 22,
                      marginBottom: 52,
                    }}
                  >
                    {filteredDomestic.map((c) => (
                      <PCard
                        key={c.id}
                        card={c}
                        listView={gridView === "list"}
                      />
                    ))}
                  </div>
                </>
              )}

            {/* International Packages */}
            {(activeType === "all" || activeType === "international") &&
              filteredIntl.length > 0 && (
                <>
                  <SecHeader
                    eyebrow="Beyond Borders"
                    title="International Packages"
                    seeAll="See all 96 →"
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: cardCols,
                      gap: 22,
                      marginBottom: 52,
                    }}
                  >
                    {filteredIntl.map((c) => (
                      <PCard
                        key={c.id}
                        card={c}
                        listView={gridView === "list"}
                      />
                    ))}
                  </div>
                </>
              )}

            {/* Empty */}
            {totalVisible === 0 && (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
                <h3
                  style={{
                    fontFamily: "'Libre Baskerville',serif",
                    fontSize: "1.3rem",
                    color: "#1B2B6B",
                    marginBottom: 8,
                  }}
                >
                  No packages found
                </h3>
                <p
                  style={{
                    fontFamily: "'Raleway',sans-serif",
                    fontSize: ".9rem",
                    color: "#9494b0",
                  }}
                >
                  Try adjusting your filters or search term.
                </p>
              </div>
            )}

            {/* Load More */}
            {totalVisible > 0 && (
              <div style={{ textAlign: "center", padding: "16px 0 32px" }}>
                <button
                  onClick={() => {
                    setLoadingMore(true)
                    setTimeout(() => setLoadingMore(false), 1500)
                  }}
                  style={{
                    fontFamily: f,
                    fontSize: ".88rem",
                    fontWeight: 600,
                    background: "transparent",
                    color: "#1B2B6B",
                    border: "1.5px solid rgba(27,43,107,.2)",
                    padding: "14px 40px",
                    borderRadius: 999,
                    cursor: "pointer",
                    transition: "all .3s",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      "#1B2B6B"
                    ;(e.currentTarget as HTMLButtonElement).style.color = "#fff"
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#1B2B6B"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      "transparent"
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      "#1B2B6B"
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(27,43,107,.2)"
                  }}
                >
                  {loadingMore ? "Loading..." : "Load More Packages"} ↓
                </button>
              </div>
            )}
          </main>
        </div>
        {/* end page grid */}

        {/* ─── CTA ─── */}
        <section
          className="cta-sect"
          style={{
            background: "#0f1a42",
            padding: "80px 64px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(46,125,50,.1) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <h2
            style={{
              fontFamily: "'Libre Baskerville',serif",
              fontSize: "clamp(1.8rem,3.5vw,3rem)",
              fontWeight: 700,
              color: "#fff",
              marginBottom: 14,
              position: "relative",
              zIndex: 1,
            }}
          >
            Can't Find Your{" "}
            <em style={{ fontStyle: "italic", color: "#7ed88a" }}>
              Dream Trip?
            </em>
          </h2>
          <p
            style={{
              fontFamily: "'Raleway',sans-serif",
              fontSize: ".95rem",
              color: "rgba(255,255,255,.45)",
              marginBottom: 36,
              position: "relative",
              zIndex: 1,
            }}
          >
            Tell us where you want to go and we'll craft a custom itinerary just
            for you.
          </p>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
              position: "relative",
              zIndex: 1,
            }}
          >
            <a
              href="#"
              style={{
                fontFamily: f,
                fontSize: ".88rem",
                fontWeight: 700,
                background: "#fff",
                color: "#1B2B6B",
                padding: "14px 32px",
                borderRadius: 999,
                textDecoration: "none",
                transition: "all .25s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.transform =
                  "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)")
              }
            >
              Request Custom Trip ✈
            </a>
            <a
              href="#"
              style={{
                fontFamily: f,
                fontSize: ".88rem",
                fontWeight: 700,
                background: "transparent",
                color: "#fff",
                border: "1.5px solid rgba(255,255,255,.3)",
                padding: "13px 32px",
                borderRadius: 999,
                textDecoration: "none",
                transition: "all .25s",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = "#fff"
                ;(e.currentTarget as HTMLElement).style.transform =
                  "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,.3)"
                ;(e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)"
              }}
            >
              Talk to an Expert
            </a>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer
          className="footer-sect"
          style={{
            background: "#0f1a42",
            padding: "48px 64px 32px",
            borderTop: "1px solid rgba(255,255,255,.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <div
              style={{
                fontFamily: "'Libre Baskerville',serif",
                fontSize: "1.1rem",
                color: "#fff",
              }}
            >
              ✈ Horizons <span style={{ color: "#7ed88a" }}>Travel</span>
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {["About", "Packages", "Contact", "Privacy"].map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    fontFamily: f,
                    fontSize: ".75rem",
                    color: "rgba(255,255,255,.38)",
                    textDecoration: "none",
                    transition: "color .2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "#fff")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,.38)")
                  }
                >
                  {l}
                </a>
              ))}
            </div>
            <div
              style={{
                fontFamily: f,
                fontSize: ".72rem",
                color: "rgba(255,255,255,.22)",
              }}
            >
              © 2026 Horizons Travel Co. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Tourism
