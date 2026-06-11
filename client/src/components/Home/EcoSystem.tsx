// "use client"

// import React, { useEffect, useRef } from "react"
// import TourismLogo from "../../assets/TourismLogo.jpeg"
// import Homelogo from "../../assets/home/HomeLogo.jpeg"
// import MedicalLogo from "../../assets/MedicalLogo.jpeg"
// import TradeLogo from "../../assets/TradeLogo.jpeg"
// import RecruitmentLogo from "../../assets/RecruitmentLogo.jpeg"
// import TravelLogo from "../../assets/TravelLogo.jpeg"
// import EducationLogo from "../../assets/EducationLogo.jpeg"
// const UdayamEcosystem: React.FC = () => {
//   const connectorRef = useRef<SVGSVGElement>(null)
//   const mapRef = useRef<HTMLDivElement>(null)

//   const drawConnectors = () => {
//     if (!connectorRef.current || window.innerWidth <= 768) return

//     const svg = connectorRef.current
//     const container = mapRef.current
//     if (!container) return

//     svg.innerHTML = ""

//     const hub = document.getElementById("hubCenter") as HTMLDivElement
//     const cards = {
//       wings: document.getElementById("cardWings"),
//       holidays: document.getElementById("cardHolidays"),
//       pathways: document.getElementById("cardPathways"),
//       placements: document.getElementById("cardPlacements"),
//       commerce: document.getElementById("cardCommerce"),
//       tnc: document.getElementById("cardTnc"),
//     }

//     const containerRect = container.getBoundingClientRect()
//     const hubRect = hub.getBoundingClientRect()
//     const hubCX = hubRect.left - containerRect.left + hubRect.width / 2
//     const hubCY = hubRect.top - containerRect.top + hubRect.height / 2

//     const getCardCenter = (el: HTMLElement) => {
//       const r = el.getBoundingClientRect()
//       return {
//         x: r.left - containerRect.left + r.width / 2,
//         y: r.top - containerRect.top + r.height / 2,
//       }
//     }

//     const addLine = (
//       x1: number,
//       y1: number,
//       x2: number,
//       y2: number,
//       delay: number
//     ) => {
//       const line = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "line"
//       )
//       line.setAttribute("x1", x1.toString())
//       line.setAttribute("y1", y1.toString())
//       line.setAttribute("x2", x2.toString())
//       line.setAttribute("y2", y2.toString())
//       line.setAttribute("stroke", "rgba(27,43,107,0.14)")
//       line.setAttribute("stroke-width", "1.5")
//       line.setAttribute("stroke-dasharray", "5 7")
//       line.style.animation = `dashFlow 3s linear infinite`
//       line.style.animationDelay = `${delay}s`
//       svg.appendChild(line)
//       ;[
//         { x: x1, y: y1 },
//         { x: x2, y: y2 },
//       ].forEach((pt) => {
//         const circle = document.createElementNS(
//           "http://www.w3.org/2000/svg",
//           "circle"
//         )
//         circle.setAttribute("cx", pt.x.toString())
//         circle.setAttribute("cy", pt.y.toString())
//         circle.setAttribute("r", "4")
//         circle.setAttribute("fill", "#1B2B6B")
//         circle.setAttribute("opacity", "0.25")
//         svg.appendChild(circle)
//       })
//     }

//     const delays = [0, 0.3, 0.6, 0.9, 1.2, 1.5]
//     let i = 0

//     Object.values(cards).forEach((card) => {
//       if (card) {
//         const c = getCardCenter(card)
//         addLine(hubCX, hubCY, c.x, c.y, delays[i++])
//       }
//     })
//   }

//   useEffect(() => {
//     setTimeout(drawConnectors, 300)
//     window.addEventListener("resize", drawConnectors)
//     return () => window.removeEventListener("resize", drawConnectors)
//   }, [])

//   return (
//     <div className="relative min-h-screen overflow-x-hidden bg-[#e8edf7] font-sans">
//       {/* Background */}
//       <div className="bg-[radial-gradient(ellipse_60%_50%_at_15%_20%,rgba(27,43,107,0.07)_0%,transparent_60%),radial-gradient(ellipse_50%_40%_at_85%_80%,rgba(46,125,50,0.05)_0%,transparent_55%),radial-gradient(ellipse_40%_40%_at_50%_50%,rgba(255,255,255,0.4)_0%,transparent_70%),linear-gradient(160deg,#e0e6f5_0%,#e8edf7_50%,#dde8e4_100%) pointer-events-none fixed inset-0 z-0" />
//       <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle,rgba(27,43,107,0.18)_1px,transparent_1px)] bg-[length:28px_28px] opacity-40" />

//       <div className="page relative z-10 px-6 py-12 md:py-16">
//         {/* Header */}
//         {/* <div className="mb-12 text-center md:mb-14">
//           <div className="mb-4 inline-flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-[#2E7D32] uppercase">
//             <div className="h-px w-7 bg-[#2E7D32]/60" />
//             OUR ECOSYSTEM
//             <div className="h-px w-7 bg-[#2E7D32]/60" />
//           </div>
//           <h1 className="text-4xl leading-tight font-bold text-[#1B2B6B] md:text-5xl lg:text-6xl">
//             Udayam <span className="text-[#2E7D32] italic">International</span>
//           </h1>
//           <p className="mx-auto mt-4 max-w-md text-[15px] text-[#6b7494]">
//             A global ecosystem connecting opportunities across travel,
//             education, healthcare, and commerce.
//           </p>
//         </div> */}

//         {/* Desktop Ecosystem Map */}
//         <div
//           className="relative mx-auto hidden max-w-[1100px] md:block"
//           ref={mapRef}
//         >
//           <div
//             className="grid grid-cols-1 items-center gap-0 md:grid-cols-3"
//             id="ecoMap"
//           >
//             {/* Top Row */}
//             <BrandCard
//               id="cardWings"
//               className="mr-10 mb-7 justify-self-end"
//               color="orange"
//               name="UV Wings"
//               tag="Fly Confidently"
//               desc="Air ticketing & travel bookings worldwide"
//             />
//             <BrandCard
//               id="cardHolidays"
//               className="mb-7 justify-self-center"
//               color="orange"
//               name="UV Holidays"
//               tag="Endless Memories"
//               desc="Curated holidays & leisure travel packages"
//             />
//             <BrandCard
//               id="cardPathways"
//               className="mb-7 ml-10 justify-self-start"
//               color="navy"
//               name="UV Pathways"
//               tag="Overseas Education"
//               desc="Overseas education & university counselling"
//             />

//             {/* Middle Row */}
//             <BrandCard
//               id="cardPlacements"
//               className="mr-10 justify-self-end"
//               color="green"
//               name="UV Placements"
//               tag="Placing Talent Worldwide"
//               desc="Global talent placement & recruitment"
//             />
//             <div id="hubCenter" className="z-20 justify-self-center">
//               <HubCenter />
//             </div>
//             <BrandCard
//               id="cardCommerce"
//               className="ml-10 justify-self-start"
//               color="green"
//               name="UV Commerce"
//               tag="Borderless Trade"
//               desc="International trade & borderless commerce"
//             />

//             {/* Bottom Row */}
//             <div className="col-start-2 mt-7">
//               <BrandCard
//                 id="cardTnc"
//                 color="green"
//                 name="UV Travel N Cure"
//                 tag="Healing Beyond Borders"
//                 desc="Medical tourism & global healthcare access"
//               />
//             </div>
//           </div>

//           {/* SVG Connectors */}
//           <svg
//             ref={connectorRef}
//             className="pointer-events-none absolute inset-0 z-10 h-full w-full"
//             aria-hidden="true"
//           />
//         </div>

//         {/* Mobile Ecosystem */}
//         <div className="space-y-8 md:hidden">
//           <MobileHub />
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//             <MobileBrandCard
//               name="UV Wings"
//               tag="Fly Confidently"
//               desc="Air ticketing & travel bookings worldwide"
//               color="orange"
//             />
//             <MobileBrandCard
//               name="UV Holidays"
//               tag="Endless Memories"
//               desc="Curated holidays & leisure travel packages"
//               color="orange"
//             />
//             <MobileBrandCard
//               name="UV Pathways"
//               tag="Overseas Education"
//               desc="Overseas education & university counselling"
//               color="navy"
//             />
//             <MobileBrandCard
//               name="UV Placements"
//               tag="Placing Talent Worldwide"
//               desc="Global talent placement & recruitment"
//               color="green"
//             />
//             <MobileBrandCard
//               name="UV Commerce"
//               tag="Borderless Trade"
//               desc="International trade & borderless commerce"
//               color="green"
//             />
//             <MobileBrandCard
//               name="UV Travel N Cure"
//               tag="Healing Beyond Borders"
//               desc="Medical tourism & global healthcare access"
//               color="green"
//               fullWidth
//             />
//           </div>
//         </div>

//         {/* Bottom Tagline */}
//         {/* <div className="mt-16 text-center">
//           <p className="font-serif text-lg text-[#6b7494] italic md:text-xl">
//             Connecting{" "}
//             <strong className="font-bold text-[#1B2B6B] not-italic">
//               People
//             </strong>{" "}
//             to Opportunities, the World, and Beyond.
//           </p>
//         </div> */}
//       </div>
//     </div>
//   )
// }

// export default UdayamEcosystem

// /* ====================== Reusable Components ====================== */

// const BrandCard = ({ id, className = "", color, name, tag, desc }: any) => {
//   const logoSrc =
//     {
//       wings: TourismLogo,
//       holidays: MedicalLogo,
//       pathways: EducationLogo,
//       placements: RecruitmentLogo,
//       commerce: TravelLogo,
//       tnc: TradeLogo,
//     }[id.replace("card", "").toLowerCase()] || "/logos/default.png"

//   return (
//     <div
//       id={id}
//       className={`brand-card group cursor-pointer rounded-3xl border border-white/80 bg-white p-7 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${className}`}
//     >
//       <div className="mb-4">
//         <img src={logoSrc} alt={name} className="h-12 w-auto object-contain" />
//         <div
//           className={`mt-1 text-sm font-medium tracking-widest ${color === "orange" ? "text-[#e07830]" : color === "green" ? "text-[#2E7D32]" : "text-[#243585]"}`}
//         >
//           {tag}
//         </div>
//       </div>

//       <div
//         className={`my-4 h-2 w-2 rounded-full ${color === "orange" ? "bg-[#e07830]" : color === "green" ? "bg-[#2E7D32]" : "bg-[#1B2B6B]"}`}
//       />

//       <p className="text-sm leading-relaxed text-[#6b7494]">{desc}</p>

//       <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#dde4f5] px-5 py-2.5 text-xs font-semibold text-[#1B2B6B] opacity-0 transition-all group-hover:opacity-100">
//         Explore
//         <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//           <path
//             d="M2.5 6h7M6.5 3l3 3-3 3"
//             stroke="#1B2B6B"
//             strokeWidth="1.3"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         </svg>
//       </div>
//     </div>
//   )
// }

// const HubCenter = () => (
//   <div className="relative h-[220px] w-[220px] md:h-[240px] md:w-[240px]">
//     <div
//       className="absolute inset-0 animate-spin rounded-full border border-dashed border-[#1B2B6B]/15"
//       style={{ animationDuration: "30s" }}
//     />
//     <div
//       className="absolute inset-[-28px] animate-spin rounded-full border border-dashed border-[#1B2B6B]/10"
//       style={{ animationDuration: "50s", animationDirection: "reverse" }}
//     />

//     <div className="relative z-10 flex h-full w-full items-center justify-center rounded-full border-8 border-white bg-white shadow-2xl">
//       {/* Replace with your actual logo */}
//       <img
//         src={Homelogo}
//         alt="Udayam International"
//         className="h-32 w-32 object-contain drop-shadow-lg"
//       />
//     </div>

//     <div className="mt-4 text-center">
//       {/* <div className="font-serif text-xl leading-tight font-bold text-[#1B2B6B]">
//         Udayam
//         <br />
//         International
//       </div> */}
//       {/* <div className="text-[10px] font-medium tracking-widest text-[#6b7494] uppercase">
//         The Parent Brand
//       </div> */}
//     </div>
//   </div>
// )

// const MobileHub = () => (
//   <div className="mb-8 flex flex-col items-center">
//     <div className="relative h-36 w-36">
//       <div
//         className="absolute inset-0 animate-spin rounded-full border border-dashed border-[#1B2B6B]/20"
//         style={{ animationDuration: "25s" }}
//       />
//       <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-white shadow-xl">
//         <img
//           src="/logos/udayam-international.png"
//           alt="Udayam"
//           className="h-16 w-16"
//         />
//       </div>
//     </div>
//     <div className="mt-4 text-center">
//       <div className="font-serif text-lg font-bold">Udayam International</div>
//       <div className="text-xs tracking-widest text-gray-500 uppercase">
//         The Parent Brand
//       </div>
//     </div>
//     <div className="my-4 h-8 w-1 bg-gradient-to-b from-[#1B2B6B]/30 to-transparent" />
//   </div>
// )

// const MobileBrandCard = ({
//   name,
//   tag,
//   desc,
//   color,
//   fullWidth = false,
// }: any) => (
//   <div
//     className={`rounded-3xl bg-white p-6 shadow ${fullWidth ? "col-span-1 sm:col-span-2" : ""}`}
//   >
//     <div className="flex items-center gap-3">
//       <div
//         className={`h-2.5 w-2.5 rounded-full ${color === "orange" ? "bg-[#e07830]" : "bg-[#2E7D32]"}`}
//       />
//       <div>
//         <div className="text-lg font-semibold">{name}</div>
//         <div
//           className={`text-xs font-medium ${color === "orange" ? "text-[#e07830]" : "text-[#2E7D32]"}`}
//         >
//           {tag}
//         </div>
//       </div>
//     </div>
//     <p className="mt-4 text-sm text-gray-600">{desc}</p>
//   </div>
// )
// "use client"

// import React, { useEffect, useRef } from "react"
// import TourismLogo from "../../assets/TourismLogo.jpeg"
// import Homelogo from "../../assets/home/HomeLogo.jpeg"
// import MedicalLogo from "../../assets/MedicalLogo.jpeg"
// import TradeLogo from "../../assets/TradeLogo.jpeg"
// import RecruitmentLogo from "../../assets/RecruitmentLogo.jpeg"
// import TravelLogo from "../../assets/TravelLogo.jpeg"
// import EducationLogo from "../../assets/EducationLogo.jpeg"

// const UdayamEcosystem: React.FC = () => {
//   const connectorRef = useRef<SVGSVGElement>(null)
//   const mapRef = useRef<HTMLDivElement>(null)
//   const resizeTimeoutRef = useRef<NodeJS.Timeout>()

//   const drawConnectors = () => {
//     if (!connectorRef.current || window.innerWidth <= 768) return

//     const svg = connectorRef.current
//     const container = mapRef.current
//     if (!container) return

//     svg.innerHTML = ""

//     const hub = document.getElementById("hubCenter") as HTMLDivElement
//     const cards = {
//       wings: document.getElementById("cardWings"),
//       holidays: document.getElementById("cardHolidays"),
//       pathways: document.getElementById("cardPathways"),
//       placements: document.getElementById("cardPlacements"),
//       commerce: document.getElementById("cardCommerce"),
//       tnc: document.getElementById("cardTnc"),
//     }

//     const containerRect = container.getBoundingClientRect()
//     const hubRect = hub.getBoundingClientRect()
//     const hubCX = hubRect.left - containerRect.left + hubRect.width / 2
//     const hubCY = hubRect.top - containerRect.top + hubRect.height / 2

//     const getCardCenter = (el: HTMLElement) => {
//       const r = el.getBoundingClientRect()
//       return {
//         x: r.left - containerRect.left + r.width / 2,
//         y: r.top - containerRect.top + r.height / 2,
//       }
//     }

//     const addLine = (
//       x1: number,
//       y1: number,
//       x2: number,
//       y2: number,
//       delay: number
//     ) => {
//       const line = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "line"
//       )
//       line.setAttribute("x1", x1.toString())
//       line.setAttribute("y1", y1.toString())
//       line.setAttribute("x2", x2.toString())
//       line.setAttribute("y2", y2.toString())
//       line.setAttribute("stroke", "rgba(27,43,107,0.14)")
//       line.setAttribute("stroke-width", "1.5")
//       line.setAttribute("stroke-dasharray", "5 7")
//       line.style.animation = `dashFlow 3s linear infinite`
//       line.style.animationDelay = `${delay}s`
//       svg.appendChild(line)
//       ;[
//         { x: x1, y: y1 },
//         { x: x2, y: y2 },
//       ].forEach((pt) => {
//         const circle = document.createElementNS(
//           "http://www.w3.org/2000/svg",
//           "circle"
//         )
//         circle.setAttribute("cx", pt.x.toString())
//         circle.setAttribute("cy", pt.y.toString())
//         circle.setAttribute("r", "4")
//         circle.setAttribute("fill", "#1B2B6B")
//         circle.setAttribute("opacity", "0.25")
//         svg.appendChild(circle)
//       })
//     }

//     const delays = [0, 0.3, 0.6, 0.9, 1.2, 1.5]
//     let i = 0

//     Object.values(cards).forEach((card) => {
//       if (card) {
//         const c = getCardCenter(card)
//         addLine(hubCX, hubCY, c.x, c.y, delays[i++])
//       }
//     })
//   }

//   useEffect(() => {
//     // Add CSS keyframes to document
//     const styleSheet = document.createElement("style")
//     styleSheet.textContent = `
//       @keyframes dashFlow {
//         0% {
//           stroke-dashoffset: 24;
//         }
//         100% {
//           stroke-dashoffset: 0;
//         }
//       }
//     `
//     document.head.appendChild(styleSheet)

//     // Initial draw with delay to ensure DOM is ready
//     const initialTimeout = setTimeout(drawConnectors, 300)

//     // Debounced resize handler
//     const handleResize = () => {
//       if (resizeTimeoutRef.current) {
//         clearTimeout(resizeTimeoutRef.current)
//       }
//       resizeTimeoutRef.current = setTimeout(drawConnectors, 150)
//     }

//     window.addEventListener("resize", handleResize)

//     return () => {
//       clearTimeout(initialTimeout)
//       if (resizeTimeoutRef.current) {
//         clearTimeout(resizeTimeoutRef.current)
//       }
//       window.removeEventListener("resize", handleResize)
//       document.head.removeChild(styleSheet)
//     }
//   }, [])

//   return (
//     <div className="relative min-h-screen overflow-x-hidden bg-[#e8edf7] font-sans">
//       {/* Background */}
//       <div className="bg-[radial-gradient(ellipse_60%_50%_at_15%_20%,rgba(27,43,107,0.07)_0%,transparent_60%),radial-gradient(ellipse_50%_40%_at_85%_80%,rgba(46,125,50,0.05)_0%,transparent_55%),radial-gradient(ellipse_40%_40%_at_50%_50%,rgba(255,255,255,0.4)_0%,transparent_70%),linear-gradient(160deg,#e0e6f5_0%,#e8edf7_50%,#dde8e4_100%) pointer-events-none fixed inset-0 z-0" />
//       <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle,rgba(27,43,107,0.18)_1px,transparent_1px)] bg-[length:28px_28px] opacity-40" />

//       <div className="page relative z-10 px-6 py-12 md:py-16">
//         {/* Desktop Ecosystem Map */}
//         <div
//           className="relative mx-auto hidden max-w-[1100px] md:block"
//           ref={mapRef}
//         >
//           <div
//             className="grid grid-cols-1 items-center gap-0 md:grid-cols-3"
//             id="ecoMap"
//           >
//             {/* Top Row */}
//             <BrandCard
//               id="cardWings"
//               className="mr-10 mb-7 justify-self-end"
//               color="orange"
//               name="UV Wings"
//               tag="Fly Confidently"
//               desc="Air ticketing & travel bookings worldwide"
//             />
//             <BrandCard
//               id="cardHolidays"
//               className="mb-7 justify-self-center"
//               color="orange"
//               name="UV Holidays"
//               tag="Endless Memories"
//               desc="Curated holidays & leisure travel packages"
//             />
//             <BrandCard
//               id="cardPathways"
//               className="mb-7 ml-10 justify-self-start"
//               color="navy"
//               name="UV Pathways"
//               tag="Overseas Education"
//               desc="Overseas education & university counselling"
//             />

//             {/* Middle Row */}
//             <BrandCard
//               id="cardPlacements"
//               className="mr-10 justify-self-end"
//               color="green"
//               name="UV Placements"
//               tag="Placing Talent Worldwide"
//               desc="Global talent placement & recruitment"
//             />
//             <div id="hubCenter" className="z-20 justify-self-center">
//               <HubCenter />
//             </div>
//             <BrandCard
//               id="cardCommerce"
//               className="ml-10 justify-self-start"
//               color="green"
//               name="UV Commerce"
//               tag="Borderless Trade"
//               desc="International trade & borderless commerce"
//             />

//             {/* Bottom Row */}
//             <div className="col-start-2 mt-7">
//               <BrandCard
//                 id="cardTnc"
//                 color="green"
//                 name="UV Travel N Cure"
//                 tag="Healing Beyond Borders"
//                 desc="Medical tourism & global healthcare access"
//               />
//             </div>
//           </div>

//           {/* SVG Connectors */}
//           <svg
//             ref={connectorRef}
//             className="pointer-events-none absolute inset-0 z-10 h-full w-full"
//             aria-hidden="true"
//           />
//         </div>

//         {/* Mobile Ecosystem */}
//         <div className="space-y-8 md:hidden">
//           <MobileHub />
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//             <MobileBrandCard
//               name="UV Wings"
//               tag="Fly Confidently"
//               desc="Air ticketing & travel bookings worldwide"
//               color="orange"
//             />
//             <MobileBrandCard
//               name="UV Holidays"
//               tag="Endless Memories"
//               desc="Curated holidays & leisure travel packages"
//               color="orange"
//             />
//             <MobileBrandCard
//               name="UV Pathways"
//               tag="Overseas Education"
//               desc="Overseas education & university counselling"
//               color="navy"
//             />
//             <MobileBrandCard
//               name="UV Placements"
//               tag="Placing Talent Worldwide"
//               desc="Global talent placement & recruitment"
//               color="green"
//             />
//             <MobileBrandCard
//               name="UV Commerce"
//               tag="Borderless Trade"
//               desc="International trade & borderless commerce"
//               color="green"
//             />
//             <MobileBrandCard
//               name="UV Travel N Cure"
//               tag="Healing Beyond Borders"
//               desc="Medical tourism & global healthcare access"
//               color="green"
//               fullWidth
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default UdayamEcosystem

// /* ====================== Reusable Components ====================== */

// const BrandCard = ({ id, className = "", color, name, tag, desc }: any) => {
//   const logoSrc =
//     {
//       wings: TourismLogo,
//       holidays: MedicalLogo,
//       pathways: EducationLogo,
//       placements: RecruitmentLogo,
//       commerce: TravelLogo,
//       tnc: TradeLogo,
//     }[id.replace("card", "").toLowerCase()] || TourismLogo

//   return (
//     <div
//       id={id}
//       className={`brand-card group cursor-pointer rounded-3xl border border-white/80 bg-white p-7 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${className}`}
//     >
//       <div className="mb-4">
//         <img src={logoSrc} alt={name} className="h-12 w-auto object-contain" />
//         <div
//           className={`mt-1 text-sm font-medium tracking-widest ${
//             color === "orange"
//               ? "text-[#e07830]"
//               : color === "green"
//                 ? "text-[#2E7D32]"
//                 : "text-[#243585]"
//           }`}
//         >
//           {tag}
//         </div>
//       </div>

//       <div
//         className={`my-4 h-2 w-2 rounded-full ${
//           color === "orange"
//             ? "bg-[#e07830]"
//             : color === "green"
//               ? "bg-[#2E7D32]"
//               : "bg-[#1B2B6B]"
//         }`}
//       />

//       <p className="text-sm leading-relaxed text-[#6b7494]">{desc}</p>

//       <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#dde4f5] px-5 py-2.5 text-xs font-semibold text-[#1B2B6B] opacity-0 transition-all group-hover:opacity-100">
//         Explore
//         <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//           <path
//             d="M2.5 6h7M6.5 3l3 3-3 3"
//             stroke="#1B2B6B"
//             strokeWidth="1.3"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         </svg>
//       </div>
//     </div>
//   )
// }

// const HubCenter = () => (
//   <div className="relative h-[220px] w-[220px] md:h-[240px] md:w-[240px]">
//     <div
//       className="absolute inset-0 animate-spin rounded-full border border-dashed border-[#1B2B6B]/15"
//       style={{ animationDuration: "30s" }}
//     />
//     <div
//       className="absolute inset-[-28px] animate-spin rounded-full border border-dashed border-[#1B2B6B]/10"
//       style={{ animationDuration: "50s", animationDirection: "reverse" }}
//     />

//     <div className="relative z-10 flex h-full w-full items-center justify-center rounded-full border-8 border-white bg-white shadow-2xl">
//       <img
//         src={Homelogo}
//         alt="Udayam International"
//         className="h-32 w-32 object-contain drop-shadow-lg"
//       />
//     </div>
//   </div>
// )

// const MobileHub = () => (
//   <div className="mb-8 flex flex-col items-center">
//     <div className="relative h-36 w-36">
//       <div
//         className="absolute inset-0 animate-spin rounded-full border border-dashed border-[#1B2B6B]/20"
//         style={{ animationDuration: "25s" }}
//       />
//       <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-white shadow-xl">
//         <img src={Homelogo} alt="Udayam" className="h-16 w-16 object-contain" />
//       </div>
//     </div>
//     <div className="mt-4 text-center">
//       <div className="font-serif text-lg font-bold text-[#1B2B6B]">
//         Udayam International
//       </div>
//       <div className="text-xs tracking-widest text-gray-500 uppercase">
//         The Parent Brand
//       </div>
//     </div>
//     <div className="my-4 h-8 w-1 bg-gradient-to-b from-[#1B2B6B]/30 to-transparent" />
//   </div>
// )

// const MobileBrandCard = ({
//   name,
//   tag,
//   desc,
//   color,
//   fullWidth = false,
// }: any) => (
//   <div
//     className={`rounded-3xl bg-white p-6 shadow ${
//       fullWidth ? "col-span-1 sm:col-span-2" : ""
//     }`}
//   >
//     <div className="flex items-center gap-3">
//       <div
//         className={`h-2.5 w-2.5 rounded-full ${
//           color === "orange"
//             ? "bg-[#e07830]"
//             : color === "navy"
//               ? "bg-[#1B2B6B]"
//               : "bg-[#2E7D32]"
//         }`}
//       />
//       <div>
//         <div className="text-lg font-semibold text-[#1B2B6B]">{name}</div>
//         <div
//           className={`text-xs font-medium ${
//             color === "orange"
//               ? "text-[#e07830]"
//               : color === "navy"
//                 ? "text-[#1B2B6B]"
//                 : "text-[#2E7D32]"
//           }`}
//         >
//           {tag}
//         </div>
//       </div>
//     </div>
//     <p className="mt-4 text-sm text-gray-600">{desc}</p>
//   </div>
// )

// import { useEffect, useRef, useState } from "react"
// import TourismLogo from "../../assets/TourismLogo.jpeg"
// import Homelogo from "../../assets/home/HomeLogo.jpeg"
// import MedicalLogo from "../../assets/MedicalLogo.jpeg"
// import TradeLogo from "../../assets/TradeLogo.jpeg"
// import RecruitmentLogo from "../../assets/RecruitmentLogo.jpeg"
// import TravelLogo from "../../assets/TravelLogo.jpeg"
// import EducationLogo from "../../assets/EducationLogo.jpeg"
// /* ── DATA ── */
// const brands = [
//   {
//     id: "wings",
//     name: TourismLogo,
//     nameJsx: (
//       <>
//         UV W
//         <span className="mx-px inline-block -translate-y-px align-middle">
//           <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//             <path
//               d="M12 5.5L2 2l1.5 3.5H2l4 2-4 2h1.5L2 13l10-3.5-2-2 2-2z"
//               fill="#1B2B6B"
//             />
//           </svg>
//         </span>
//         ngs
//       </>
//     ),
//     taglineColor: "text-[#e07830]",
//     pos: "col-start-1 row-start-1 justify-self-end self-end mb-7 mr-10",
//   },
//   {
//     id: "holidays",
//     name: MedicalLogo,

//     nameJsx: (
//       <>
//         UV H
//         <span className="mx-px inline-block -translate-y-px align-middle">
//           <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//             <circle
//               cx="7"
//               cy="7"
//               r="5"
//               fill="none"
//               stroke="#e07830"
//               strokeWidth="1.2"
//             />
//             <circle cx="7" cy="7" r="2" fill="#e07830" opacity="0.5" />
//             <path
//               d="M7 2v10M2 7h10"
//               stroke="#e07830"
//               strokeWidth="1"
//               strokeDasharray="1.5 1.5"
//             />
//           </svg>
//         </span>
//         lidays
//       </>
//     ),
//     tagline: "Endless Memories",
//     taglineColor: "text-[#e07830]",
//     dotColor: "bg-[#e07830]",
//     desc: "Curated holidays & leisure travel packages",
//     pos: "col-start-2 row-start-1 justify-self-center self-end mb-7",
//   },
//   {
//     id: "pathways",
//     name: TradeLogo,
//     nameJsx: <>UV Pathways</>,
//     tagline: "Overseas Education",
//     taglineColor: "text-[#e07830]",
//     dotColor: "bg-[#1b2b6b]",
//     desc: "Overseas education & university counselling",
//     pos: "col-start-3 row-start-1 justify-self-start self-end mb-7 ml-10",
//   },
//   {
//     id: "placements",
//     name: EducationLogo,
//     nameJsx: (
//       <>
//         UV P
//         <span className="mx-px inline-block -translate-y-px align-middle">
//           <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
//             <circle
//               cx="6.5"
//               cy="4"
//               r="2.5"
//               stroke="#1B2B6B"
//               strokeWidth="1.2"
//             />
//             <path
//               d="M1 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
//               stroke="#1B2B6B"
//               strokeWidth="1.2"
//               strokeLinecap="round"
//             />
//           </svg>
//         </span>
//         lacements
//       </>
//     ),
//     tagline: "Placing Talent Worldwide",
//     taglineColor: "text-[#2e7d32]",
//     dotColor: "bg-[#2e7d32]",
//     desc: "Global talent placement & recruitment",
//     pos: "col-start-1 row-start-2 justify-self-end self-center mr-10",
//   },
//   {
//     id: "commerce",
//     name: RecruitmentLogo,
//     nameJsx: (
//       <>
//         UV C
//         <span className="mx-px inline-block -translate-y-px align-middle">
//           <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//             <circle
//               cx="7"
//               cy="7"
//               r="5"
//               stroke="#e07830"
//               strokeWidth="1.2"
//               fill="none"
//             />
//             <path
//               d="M5 9.5c0-1.5 1-2.5 2-2.5s2 1 2 2.5M7 4v2"
//               stroke="#e07830"
//               strokeWidth="1.1"
//               strokeLinecap="round"
//             />
//           </svg>
//         </span>
//         mmerce
//       </>
//     ),
//     tagline: "Borderless Trade",
//     taglineColor: "text-[#2e7d32]",
//     dotColor: "bg-[#2e7d32]",
//     desc: "International trade & borderless commerce",
//     pos: "col-start-3 row-start-2 justify-self-start self-center ml-10",
//   },
//   {
//     id: "tnc",
//     name: TravelLogo,
//     nameJsx: (
//       <>
//         UV Travel N C
//         <span className="mx-px inline-block -translate-y-px align-middle">
//           <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//             <path
//               d="M7 2a4 4 0 014 4c0 3-4 7-4 7S3 9 3 6a4 4 0 014-4z"
//               stroke="#2E7D32"
//               strokeWidth="1.2"
//               fill="none"
//             />
//             <circle cx="7" cy="6" r="1.5" fill="#2E7D32" opacity="0.6" />
//           </svg>
//         </span>
//         re
//       </>
//     ),
//     tagline: "Healing Beyond Borders",
//     taglineColor: "text-[#2e7d32]",
//     dotColor: "bg-[#2e7d32]",
//     desc: "Medical tourism & global healthcare access",
//     pos: "col-start-2 row-start-3 justify-self-center self-start mt-7",
//   },
// ]

// /* ── HUB SVG LOGO ── */
// function HubLogo({ size = 80 }) {
//   return (
//     <svg
//       width={size}
//       height={(size * 90) / 80}
//       viewBox="0 0 80 90"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <defs>
//         <linearGradient
//           id="shieldGrad"
//           x1="8"
//           y1="4"
//           x2="72"
//           y2="86"
//           gradientUnits="userSpaceOnUse"
//         >
//           <stop offset="0%" stopColor="#2a4aaa" />
//           <stop offset="60%" stopColor="#1B2B6B" />
//           <stop offset="100%" stopColor="#0d1a40" />
//         </linearGradient>
//         <radialGradient
//           id="globeGrad"
//           cx="40"
//           cy="42"
//           r="20"
//           gradientUnits="userSpaceOnUse"
//         >
//           <stop offset="0%" stopColor="#3a60c8" />
//           <stop offset="100%" stopColor="#1B2B6B" />
//         </radialGradient>
//       </defs>
//       <path
//         d="M40 4L8 18v24c0 20 14 36 32 44 18-8 32-24 32-44V18L40 4z"
//         fill="url(#shieldGrad)"
//         stroke="rgba(255,255,255,0.3)"
//         strokeWidth="0.5"
//       />
//       <circle
//         cx="40"
//         cy="42"
//         r="20"
//         fill="url(#globeGrad)"
//         stroke="rgba(255,255,255,0.2)"
//         strokeWidth="0.5"
//       />
//       <ellipse
//         cx="40"
//         cy="42"
//         rx="8"
//         ry="20"
//         stroke="rgba(255,255,255,0.4)"
//         strokeWidth="0.7"
//         fill="none"
//       />
//       <line
//         x1="20"
//         y1="42"
//         x2="60"
//         y2="42"
//         stroke="rgba(255,255,255,0.4)"
//         strokeWidth="0.7"
//       />
//       <line
//         x1="22"
//         y1="34"
//         x2="58"
//         y2="34"
//         stroke="rgba(255,255,255,0.25)"
//         strokeWidth="0.5"
//       />
//       <line
//         x1="22"
//         y1="50"
//         x2="58"
//         y2="50"
//         stroke="rgba(255,255,255,0.25)"
//         strokeWidth="0.5"
//       />
//       <path
//         d="M28 42L40 36l12 2-10 4 2 6-4-2-6 4 2-4-6-4z"
//         fill="rgba(255,255,255,0.9)"
//       />
//       <path
//         d="M24 56 Q40 68 58 52"
//         stroke="#43a047"
//         strokeWidth="2.5"
//         fill="none"
//         strokeLinecap="round"
//       />
//       <path d="M55 48l4 5-6 1z" fill="#43a047" />
//       <rect
//         x="8"
//         y="8"
//         width="10"
//         height="18"
//         rx="1"
//         fill="rgba(27,43,107,0.6)"
//       />
//       <rect
//         x="62"
//         y="8"
//         width="10"
//         height="18"
//         rx="1"
//         fill="rgba(27,43,107,0.6)"
//       />
//     </svg>
//   )
// }

// /* ── BRAND CARD ── */
// function BrandCard({ brand }) {
//   const [hovered, setHovered] = useState(false)
//   return (
//     <div
//       id={`card-${brand.id}`}
//       className={`${brand.pos} group relative z-[3] w-[310px] cursor-pointer overflow-hidden rounded-[28px] border border-white/80 bg-white p-5 shadow-[0_8px_40px_rgba(27,43,107,0.12)] transition-all duration-[350ms] ease-out`}
//       style={{
//         transform: hovered ? "translateY(-6px) scale(1.01)" : "none",
//         boxShadow: hovered
//           ? "0 20px 60px rgba(27,43,107,0.16)"
//           : "0 8px 40px rgba(27,43,107,0.12)",
//         zIndex: hovered ? 10 : 3,
//       }}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       {/* Top accent bar */}
//       <div
//         className="absolute top-0 right-0 left-0 h-[3px] origin-left rounded-t-[28px] transition-transform duration-[400ms]"
//         style={{
//           background: "linear-gradient(90deg, #1b2b6b, #2e7d32)",
//           transform: hovered ? "scaleX(1)" : "scaleX(0)",
//         }}
//       />
//       {/* Glow overlay */}
//       <div
//         className="pointer-events-none absolute inset-0 rounded-[28px] transition-opacity duration-300"
//         style={{
//           background:
//             "radial-gradient(ellipse at top left, rgba(27,43,107,0.04), transparent 60%)",
//           opacity: hovered ? 1 : 0,
//         }}
//       />

//       {/* Logo area */}
//       <div className="mb-4 flex flex-col items-start gap-0.5">
//         <img src={brand.name} alt={brand.name} />
//       </div>
//     </div>
//   )
// }

// /* ── CONNECTOR LINES SVG ── */
// function ConnectorLines({ containerRef, hubRef, cardRefs }) {
//   const [lines, setLines] = useState([])

//   useEffect(() => {
//     function compute() {
//       if (!containerRef.current || !hubRef.current) return
//       const containerRect = containerRef.current.getBoundingClientRect()
//       const hubRect = hubRef.current.getBoundingClientRect()
//       const hubCX = hubRect.left - containerRect.left + hubRect.width / 2
//       const hubCY = hubRect.top - containerRect.top + hubRect.height / 2

//       const newLines = []
//       cardRefs.current.forEach((el, i) => {
//         if (!el) return
//         const r = el.getBoundingClientRect()
//         const cx = r.left - containerRect.left + r.width / 2
//         const cy = r.top - containerRect.top + r.height / 2
//         newLines.push({ x1: hubCX, y1: hubCY, x2: cx, y2: cy, delay: i * 0.3 })
//       })
//       setLines(newLines)
//     }

//     const timer = setTimeout(compute, 200)
//     window.addEventListener("resize", compute)
//     return () => {
//       clearTimeout(timer)
//       window.removeEventListener("resize", compute)
//     }
//   }, [containerRef, hubRef, cardRefs])

//   return (
//     <svg
//       className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
//       style={{ zIndex: 2 }}
//       aria-hidden="true"
//     >
//       <defs>
//         <style>{`
//           @keyframes dashFlow {
//             from { stroke-dashoffset: 0; }
//             to { stroke-dashoffset: -48; }
//           }
//         `}</style>
//       </defs>
//       {lines.map((l, i) => (
//         <g key={i}>
//           <line
//             x1={l.x1}
//             y1={l.y1}
//             x2={l.x2}
//             y2={l.y2}
//             stroke="rgba(27,43,107,0.14)"
//             strokeWidth="1.5"
//             strokeDasharray="5 7"
//             fill="none"
//             style={{
//               animation: `dashFlow 3s linear ${l.delay}s infinite`,
//             }}
//           />
//           <circle cx={l.x1} cy={l.y1} r="4" fill="#1b2b6b" opacity="0.25" />
//           <circle cx={l.x2} cy={l.y2} r="4" fill="#1b2b6b" opacity="0.25" />
//         </g>
//       ))}
//     </svg>
//   )
// }

// /* ── MOBILE CARD ── */
// function MobileBrandCard({ brand }) {
//   return (
//     <div
//       className={`relative rounded-[20px] border border-white/80 bg-white p-2 shadow-[0_8px_40px_rgba(27,43,107,0.12)] overflow-hidden${brand.id === "tnc" ? "col-span-2" : ""}`}
//     >
//       <div className="mb-3">
//         <img src={brand.name} />
//       </div>
//     </div>
//   )
// }

// /* ── MAIN COMPONENT ── */
// export default function UdayamEcosystem() {
//   const containerRef = useRef(null)
//   const hubRef = useRef(null)
//   const cardRefs = useRef([])

//   // Populate cardRefs after mount
//   useEffect(() => {
//     cardRefs.current = brands.map((b) =>
//       document.getElementById(`card-${b.id}`)
//     )
//   }, [])

//   return (
//     <>
//       {/* Google Fonts */}
//       <link
//         href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap"
//         rel="stylesheet"
//       />

//       <style>{`
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         @keyframes spinRev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
//         @keyframes fadeUp { from { opacity:0; transform:translateY(36px); } to { opacity:1; transform:none; } }
//         @keyframes fadeScale { from { opacity:0; transform:scale(0.7); } to { opacity:1; transform:scale(1); } }
//         @keyframes fadeLeft { from { opacity:0; transform:translateX(36px); } to { opacity:1; transform:none; } }
//         @keyframes fadeRight { from { opacity:0; transform:translateX(-36px); } to { opacity:1; transform:none; } }
//         @keyframes fadeDown { from { opacity:0; transform:translateY(-36px); } to { opacity:1; transform:none; } }
//       `}</style>

//       <div
//         className="relative overflow-hidden px-6 pt-12 pb-16"
//         style={{
//           background: "#e8edf7",
//           fontFamily: "'DM Sans', sans-serif",
//           color: "#1a2040",
//         }}
//       >
//         {/* Background */}
//         <div
//           className="pointer-events-none fixed inset-0 z-0"
//           // style={{
//           //   background: `
//           //     radial-gradient(ellipse 60% 50% at 15% 20%, rgba(27,43,107,0.07) 0%, transparent 60%),
//           //     radial-gradient(ellipse 50% 40% at 85% 80%, rgba(46,125,50,0.05) 0%, transparent 55%),
//           //     radial-gradient(ellipse 40% 40% at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 70%),
//           //     linear-gradient(160deg, #e0e6f5 0%, #e8edf7 50%, #dde8e4 100%)
//           //   `,
//           // }}
//         />
//         <div
//           className="pointer-events-none fixed inset-0 z-0 opacity-40"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle, rgba(27,43,107,0.18) 1px, transparent 1px)",
//             backgroundSize: "28px 28px",
//           }}
//         />

//         {/* Section Header */}
//         <div
//           className="relative z-[2] mb-[52px] text-center"
//           style={{
//             animation: "fadeUp 0.8s 0.1s cubic-bezier(0.16,1,0.3,1) both",
//           }}
//         >
//           {/* <div className="mb-3.5 inline-flex items-center gap-2.5 font-['DM_Sans'] text-[11px] font-semibold tracking-[0.28em] text-[#2e7d32] uppercase">
//             <span className="block h-px w-7 bg-[#2e7d32] opacity-60" />
//             Our Ecosystem
//             <span className="block h-px w-7 bg-[#2e7d32] opacity-60" />
//           </div>
//           <h1
//             className="mb-3 font-['Playfair_Display'] leading-[1.1] font-bold tracking-tight text-[#1b2b6b]"
//             style={{ fontSize: "clamp(28px, 5vw, 52px)" }}
//           >
//             One Brand, <em className="text-[#2e7d32] italic">Many Worlds</em>
//           </h1>
//           <p className="mx-auto max-w-[480px] font-['DM_Sans'] text-[15px] leading-[1.65] text-[#6b7494]">
//             Six specialised ventures, one shared mission — connecting people to
//             opportunities across the globe.
//           </p> */}
//         </div>

//         {/* ── DESKTOP MAP ── */}
//         <div
//           className="relative z-[2] mx-auto hidden max-w-[1100px] md:block"
//           ref={containerRef}
//         >
//           {/* Grid */}
//           <div
//             className="grid items-center justify-items-center gap-0"
//             style={{
//               gridTemplateColumns: "1fr 280px 1fr",
//               gridTemplateRows: "auto auto auto",
//             }}
//           >
//             {brands.map((brand) => (
//               <BrandCard key={brand.id} brand={brand} />
//             ))}

//             {/* CENTER HUB */}
//             <div
//               id="hub-center"
//               ref={hubRef}
//               className="relative z-[3] col-start-2 row-start-2"
//               style={{
//                 animation:
//                   "fadeScale 0.9s 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
//               }}
//             >
//               <div
//                 className="relative flex h-[220px] w-[220px] cursor-default flex-col items-center justify-center rounded-full bg-white p-5 text-center transition-transform duration-[400ms] hover:scale-[1.04]"
//                 style={{
//                   boxShadow:
//                     "0 32px 80px rgba(27,43,107,0.2), 0 0 0 12px rgba(255,255,255,0.5), 0 0 0 24px rgba(27,43,107,0.06)",
//                 }}
//               >
//                 {/* Rings */}
//                 <div
//                   className="absolute rounded-full border border-dashed border-[rgba(27,43,107,0.15)]"
//                   style={{
//                     inset: "-14px",
//                     animation: "spin 30s linear infinite",
//                   }}
//                 />
//                 <div
//                   className="absolute rounded-full border border-dashed border-[rgba(27,43,107,0.07)]"
//                   style={{
//                     inset: "-28px",
//                     animation: "spinRev 50s linear infinite",
//                   }}
//                 />
//                 <img src={Homelogo} className="h-20 w-20" />
//                 <div className="mt-2.5 font-['Playfair_Display'] text-[15px] leading-tight font-bold text-[#1b2b6b]">
//                   Udayam
//                   <br />
//                   International
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Connector Lines */}
//           <ConnectorLines
//             containerRef={containerRef}
//             hubRef={hubRef}
//             cardRefs={cardRefs}
//           />
//         </div>

//         {/* ── MOBILE LAYOUT ── */}
//         <div className="relative z-[2] md:hidden">
//           {/* Mobile Hub */}
//           <div
//             className="mb-8 flex flex-col items-center"
//             style={{
//               animation:
//                 "fadeScale 0.9s 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
//             }}
//           >
//             <div
//               className="relative flex h-[140px] w-[140px] flex-col items-center justify-center rounded-full bg-white p-3 text-center"
//               style={{
//                 boxShadow:
//                   "0 20px 60px rgba(27,43,107,0.16), 0 0 0 8px rgba(255,255,255,0.5), 0 0 0 16px rgba(27,43,107,0.05)",
//               }}
//             >
//               <div
//                 className="absolute rounded-full border border-dashed border-[rgba(27,43,107,0.14)]"
//                 style={{
//                   inset: "-10px",
//                   animation: "spin 25s linear infinite",
//                 }}
//               />
//               <img src={Homelogo} className="h-16 w-16" />
//               <div className="mt-1.5 font-['Playfair_Display'] text-[12px] leading-tight font-bold text-[#1b2b6b]">
//                 Udayam
//                 <br />
//                 International
//               </div>
//             </div>
//             <div className="mt-0 h-6 w-px bg-gradient-to-b from-[rgba(27,43,107,0.2)] to-[rgba(27,43,107,0.05)]" />
//           </div>

//           {/* Mobile Cards */}
//           <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//             {brands.map((brand) => (
//               <MobileBrandCard key={brand.id} brand={brand} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

import { useEffect, useRef, useState } from "react"
import TourismLogo from "../../assets/UVHolidays.JPG.jpeg"
import Homelogo from "../../assets/home/ecoLogo.jpeg"
import MedicalLogo from "../../assets/MedicalLogo.jpeg"
import TradeLogo from "../../assets/TradeLogo.jpeg"
import RecruitmentLogo from "../../assets/RecruitmentLogo.jpeg"
import TravelLogo from "../../assets/TravelLogo.jpeg"
import EducationLogo from "../../assets/UVPathways.JPG.jpeg"
import { useNavigate } from "react-router-dom"

/*
  LAYOUT (matching hand-drawn sketch):
  
           [UV Holidays / Tourism]          ← top-center
  
  [UV Wings]          HUB          [UV Commerce]
  [Travel]       [Udayam Int.]     [Trade]
  
  [UV Pathways]                [UV Placements]
  [Education]                  [Recruitment]
  
           [UV Travel N Cure]
           [Medical Tourism]               ← bottom-center
*/

/* ── HUB SVG LOGO ── */
function HubLogo({ size = 80 }) {
  return (
    <svg
      width={size}
      height={(size * 90) / 80}
      viewBox="0 0 80 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="shieldGrad"
          x1="8"
          y1="4"
          x2="72"
          y2="86"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#2a4aaa" />
          <stop offset="60%" stopColor="#1B2B6B" />
          <stop offset="100%" stopColor="#0d1a40" />
        </linearGradient>
        <radialGradient
          id="globeGrad"
          cx="40"
          cy="42"
          r="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#3a60c8" />
          <stop offset="100%" stopColor="#1B2B6B" />
        </radialGradient>
      </defs>
      <path
        d="M40 4L8 18v24c0 20 14 36 32 44 18-8 32-24 32-44V18L40 4z"
        fill="url(#shieldGrad)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.5"
      />
      <circle
        cx="40"
        cy="42"
        r="20"
        fill="url(#globeGrad)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.5"
      />
      <ellipse
        cx="40"
        cy="42"
        rx="8"
        ry="20"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.7"
        fill="none"
      />
      <line
        x1="20"
        y1="42"
        x2="60"
        y2="42"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.7"
      />
      <line
        x1="22"
        y1="34"
        x2="58"
        y2="34"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.5"
      />
      <line
        x1="22"
        y1="50"
        x2="58"
        y2="50"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.5"
      />
      <path
        d="M28 42L40 36l12 2-10 4 2 6-4-2-6 4 2-4-6-4z"
        fill="rgba(255,255,255,0.9)"
      />
      <path
        d="M24 56 Q40 68 58 52"
        stroke="#43a047"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M55 48l4 5-6 1z" fill="#43a047" />
    </svg>
  )
}

/* ── BRAND CARD ── */
function BrandCard({ logo, id, name, path }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    if (path) navigate(path)
  }
  return (
    <div
      id={`card-${id}`}
      className="relative cursor-pointer overflow-hidden rounded-[24px] border border-white/80 bg-white p-4 shadow-[0_8px_40px_rgba(27,43,107,0.12)] transition-all duration-300 ease-out"
      style={{
        width: 220,
        transform: hovered ? "translateY(-5px) scale(1.02)" : "none",
        boxShadow: hovered
          ? "0 20px 55px rgba(27,43,107,0.18)"
          : "0 8px 40px rgba(27,43,107,0.12)",
        zIndex: hovered ? 10 : 3,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 right-0 left-0 h-[3px] origin-left rounded-t-[24px] transition-transform duration-[400ms]"
        style={{
          background: "linear-gradient(90deg, #1b2b6b, #2e7d32)",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
        }}
      />
      <img src={logo} alt="" className="block h-auto w-full rounded-[8px]" />
      <div className="text-center text-sm font-bold">{name}</div>
    </div>
  )
}

/* ── CONNECTOR LINES SVG ── */
function ConnectorLines({ containerRef, hubRef }) {
  const [lines, setLines] = useState([])

  useEffect(() => {
    function compute() {
      if (!containerRef.current || !hubRef.current) return
      const cRect = containerRef.current.getBoundingClientRect()
      const hRect = hubRef.current.getBoundingClientRect()
      const hx = hRect.left - cRect.left + hRect.width / 2
      const hy = hRect.top - cRect.top + hRect.height / 2

      const ids = ["top", "left1", "right1", "left2", "right2", "bottom"]
      const newLines = []
      ids.forEach((id, i) => {
        const el = document.getElementById(`card-${id}`)
        if (!el) return
        const r = el.getBoundingClientRect()
        const cx = r.left - cRect.left + r.width / 2
        const cy = r.top - cRect.top + r.height / 2
        newLines.push({ x1: hx, y1: hy, x2: cx, y2: cy, delay: i * 0.35 })
      })
      setLines(newLines)
    }

    const t = setTimeout(compute, 300)
    window.addEventListener("resize", compute)
    return () => {
      clearTimeout(t)
      window.removeEventListener("resize", compute)
    }
  }, [containerRef, hubRef])

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    >
      <defs>
        <style>{`
          @keyframes dashFlow {
            from { stroke-dashoffset: 0; }
            to   { stroke-dashoffset: -48; }
          }
        `}</style>
      </defs>
      {lines.map((l, i) => (
        <g key={i}>
          <line
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="rgba(27,43,107,0.18)"
            strokeWidth="1.5"
            strokeDasharray="5 8"
            fill="none"
            style={{ animation: `dashFlow 2.8s linear ${l.delay}s infinite` }}
          />
          <circle cx={l.x1} cy={l.y1} r="5" fill="#1b2b6b" opacity="0.22" />
          <circle cx={l.x2} cy={l.y2} r="4" fill="#1b2b6b" opacity="0.18" />
        </g>
      ))}
    </svg>
  )
}

/* ── MOBILE CARD ── */
function MobileBrandCard({ logo, name, path }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (path) navigate(path)
  }
  return (
    <div
      onClick={handleClick}
      className="relative overflow-hidden rounded-[18px] border border-white/80 bg-white p-3 shadow-[0_6px_28px_rgba(27,43,107,0.10)]"
    >
      <img src={logo} alt="" className="block h-auto w-full rounded-[6px]" />
      <div className="text-center text-sm">{name}</div>
    </div>
  )
}

/* ── MAIN COMPONENT ── */
export default function UdayamEcosystem() {
  const containerRef = useRef(null)
  const hubRef = useRef(null)
  const navigate = useNavigate()
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes spin    { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
        @keyframes spinRev { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
        @keyframes fadeScale { from { opacity:0; transform:scale(0.7); } to { opacity:1; transform:scale(1); } }
      `}</style>

      <div
        className="relative overflow-hidden px-6 pt-10 pb-14"
        style={{
          background: "#e8edf7",
          fontFamily: "'DM Sans', sans-serif",
          color: "#1a2040",
        }}
      >
        {/* Dot background */}
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(27,43,107,0.18) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* ── DESKTOP LAYOUT ── */}
        <div
          ref={containerRef}
          className="relative z-[2] mx-auto hidden max-w-[1050px] md:block"
        >
          {/*
            Grid: 3 cols × 4 rows
            Col 1 = left cards, Col 2 = center, Col 3 = right cards
            Row 1 = top-center card (spans col 2)
            Row 2 = left1 | hub | right1
            Row 3 = left2 | (hub continues) | right2
            Row 4 = bottom-center card (spans col 2)
          */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: "1fr 240px 1fr",
              gridTemplateRows: "auto auto auto auto",
              rowGap: 0,
              columnGap: 0,
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            {/* ── ROW 1: TOP CENTER ── */}
            <div style={{ gridColumn: "1", gridRow: "1" }} />
            <div style={{ gridColumn: "2", gridRow: "1", paddingBottom: 80 }}>
              <BrandCard
                id="top"
                logo={TourismLogo}
                name={"Tourism"}
                path={"/tourism"}
              />
            </div>
            <div style={{ gridColumn: "3", gridRow: "1" }} />

            {/* ── ROW 2: LEFT | HUB | RIGHT (top pair) ── */}
            <div
              style={{
                gridColumn: "1",
                gridRow: "2",
                justifySelf: "end",
                paddingRight: 70,
                paddingBottom: 36,
              }}
            >
              <BrandCard
                id="left1"
                logo={TravelLogo}
                name={"Travel"}
                path={"/travel"}
              />
            </div>

            {/* HUB spans rows 2–3 */}
            <div
              ref={hubRef}
              id="hub-center"
              style={{ gridColumn: "2", gridRow: "2 / span 2" }}
              className="relative z-[4] flex items-center justify-center"
            >
              <div
                className="relative flex flex-col items-center justify-center rounded-full bg-white text-center transition-transform duration-300 hover:scale-[1.04]"
                style={{
                  width: 210,
                  height: 210,
                  boxShadow:
                    "0 28px 70px rgba(27,43,107,0.2), 0 0 0 10px rgba(255,255,255,0.5), 0 0 0 22px rgba(27,43,107,0.06)",
                  animation:
                    "fadeScale 0.9s 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
                }}
              >
                {/* Spinning rings */}
                <div
                  className="absolute rounded-full border border-dashed border-[rgba(27,43,107,0.15)]"
                  style={{ inset: -14, animation: "spin 30s linear infinite" }}
                />
                <div
                  onClick={() => {
                    navigate("/about")
                  }}
                  className="absolute cursor-pointer rounded-full border border-dashed border-[rgba(27,43,107,0.07)]"
                  style={{
                    inset: -28,
                    animation: "spinRev 50s linear infinite",
                  }}
                />
                <img
                  src={Homelogo}
                  alt="udyam"
                  className="h-36 w-36 cursor-pointer"
                />
                {/* <div
                  className="mt-2.5 leading-tight font-bold text-[#1b2b6b]"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 14,
                  }}
                >
                  Udayam
                  <br />
                  International
                </div> */}
              </div>
            </div>

            <div
              style={{
                gridColumn: "3",
                gridRow: "2",
                justifySelf: "start",
                paddingLeft: 70,
                paddingBottom: 36,
              }}
            >
              <BrandCard
                id="right1"
                logo={TradeLogo}
                name={"Trade"}
                path={"/trade"}
              />
            </div>

            {/* ── ROW 3: LEFT2 | (hub) | RIGHT2 ── */}
            <div
              style={{
                gridColumn: "1",
                gridRow: "3",
                justifySelf: "end",
                paddingRight: 70,
                paddingTop: 36,
              }}
            >
              <BrandCard
                id="left2"
                logo={EducationLogo}
                name={"Education"}
                path={"/education"}
              />
            </div>

            {/* hub continues here (span 2) — no element needed */}

            <div
              style={{
                gridColumn: "3",
                gridRow: "3",
                justifySelf: "start",
                paddingLeft: 70,
                paddingTop: 36,
              }}
            >
              <BrandCard
                id="right2"
                logo={RecruitmentLogo}
                name={"Recruitment"}
                path={"/recruitment"}
              />
            </div>

            {/* ── ROW 4: BOTTOM CENTER ── */}
            <div style={{ gridColumn: "1", gridRow: "4" }} />
            <div style={{ gridColumn: "2", gridRow: "4", paddingTop: 80 }}>
              <BrandCard
                id="bottom"
                logo={MedicalLogo}
                name={"Medical Tourism"}
                path={"/medical"}
              />
            </div>
            <div style={{ gridColumn: "3", gridRow: "4" }} />
          </div>

          {/* Connector Lines overlay */}
          <ConnectorLines containerRef={containerRef} hubRef={hubRef} />
        </div>

        {/* ── MOBILE LAYOUT ── */}
        <div className="relative z-[2] md:hidden">
          {/* Mobile Hub */}
          <div className="mb-8 flex flex-col items-center">
            <div
              className="relative flex flex-col items-center justify-center rounded-full bg-white text-center"
              style={{
                width: 160,
                height: 160,
                boxShadow:
                  "0 20px 60px rgba(27,43,107,0.16), 0 0 0 8px rgba(255,255,255,0.5), 0 0 0 16px rgba(27,43,107,0.05)",
                animation:
                  "fadeScale 0.9s 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
              }}
            >
              <div
                onClick={() => {
                  navigate("/about")
                }}
                className="absolute cursor-pointer rounded-full border border-dashed border-[rgba(27,43,107,0.14)]"
                style={{ inset: -10, animation: "spin 25s linear infinite" }}
              />
              <img
                onClick={() => {
                  navigate("/aboutus")
                }}
                src={Homelogo}
                alt="udyam"
                className="h-28 w-28"
              />
            </div>
            <div className="mt-0 h-6 w-px bg-gradient-to-b from-[rgba(27,43,107,0.2)] to-transparent" />
          </div>

          {/* Mobile Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            <MobileBrandCard
              logo={TourismLogo}
              name={"Tourism"}
              path={"/tourism"}
            />
            <MobileBrandCard
              logo={TravelLogo}
              name={"Travel"}
              path={"/travel"}
            />
            <MobileBrandCard logo={TradeLogo} name={"Trade"} path={"/trade"} />
            <MobileBrandCard
              logo={EducationLogo}
              name={"Education"}
              path={"/education"}
            />
            <MobileBrandCard
              logo={RecruitmentLogo}
              name={"Recruitment"}
              path={"/recruitment"}
            />
            <MobileBrandCard
              logo={MedicalLogo}
              name={"Medical Tourism"}
              path={"/medical"}
            />
          </div>
        </div>
      </div>
    </>
  )
}
