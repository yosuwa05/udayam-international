// import { useState } from "react"
// import Home from "./components/Home"
// import Navbar, { type Page } from "./components/Navbar"
// import AboutUs from "./components/Aboutus"
// import Tourism from "./components/Tourism"
// import MedicalTourism from "./components/Medical"

// export function App() {
//   const [currentPage, setCurrentPage] = useState<Page>("home")

//   const handleNavigate = (page: Page) => {
//     setCurrentPage(page)
//     window.scrollTo({ top: 0, behavior: "smooth" })
//   }

//   const renderPage = () => {
//     switch (currentPage) {
//       case "home":
//         return <Home onNavigate={handleNavigate} />
//       case "about":
//         return <AboutUs />
//       case "tourism":
//         return <Tourism onNavigate={handleNavigate} />
//       case "medical":
//         return <MedicalTourism />
//       default:
//         return (
//           <div
//             className="flex min-h-screen items-center justify-center"
//             style={{
//               background: "#F7F9FC",
//             }}
//           >
//             <div className="px-8 text-center">
//               <p
//                 className="mb-4 text-[11px] font-bold tracking-[2.5px] uppercase"
//                 style={{ color: "#2E7D32" }}
//               >
//                 Coming Soon
//               </p>
//               <h1
//                 className="mb-8 font-extrabold tracking-[-0.5px]"
//                 style={{
//                   fontSize: "clamp(32px,4vw,52px)",
//                   color: "#0D1B3E",
//                 }}
//               >
//                 {currentPage.charAt(0).toUpperCase() +
//                   currentPage.slice(1).replace(/-/g, " ")}
//               </h1>
//               <button
//                 onClick={() => handleNavigate("home")}
//                 className="cursor-pointer rounded-full border-none px-9 py-[13px] text-[14px] font-bold text-white transition-all duration-200 hover:opacity-90"
//                 style={{
//                   background: "linear-gradient(135deg, #388E3C, #43A047)",
//                   boxShadow: "0 6px 24px rgba(46,125,50,0.45)",
//                 }}
//               >
//                 ← Back to Home
//               </button>
//             </div>
//           </div>
//         )
//     }
//   }

//   return (
//     <>
//       <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
//       <main>{renderPage()}</main>
//     </>
//   )
// }

// export default App
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./components/Home/Home"
import AboutUs from "./components/Aboutus"
import Tourism from "./components/Tourism"
import MedicalTourism from "./components/Medical"

const ComingSoon = ({ label }: { label: string }) => {
  const navigate = useNavigate()
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: "#F7F9FC" }}
    >
      <div className="px-8 text-center">
        <p
          className="mb-4 text-[11px] font-bold tracking-[2.5px] uppercase"
          style={{ color: "#2E7D32" }}
        >
          Coming Soon
        </p>
        <h1
          className="mb-8 font-extrabold tracking-[-0.5px]"
          style={{ fontSize: "clamp(32px,4vw,52px)", color: "#0D1B3E" }}
        >
          {label}
        </h1>
        <button
          onClick={() => navigate("/")}
          className="cursor-pointer rounded-full border-none px-9 py-[13px] text-[14px] font-bold text-white transition-all duration-200 hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #388E3C, #43A047)",
            boxShadow: "0 6px 24px rgba(46,125,50,0.45)",
          }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

function AppShell() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route
            path="/tourism"
            element={<Tourism onNavigate={(page) => {}} />}
          />
          <Route path="/medical" element={<MedicalTourism />} />
          <Route
            path="/travel"
            element={<ComingSoon label="Travel Services" />}
          />
          <Route path="/trade" element={<ComingSoon label="Trade" />} />
          <Route
            path="/education"
            element={<ComingSoon label="Foreign Education" />}
          />
          <Route
            path="/recruitment"
            element={<ComingSoon label="Recruitment" />}
          />
          <Route path="/contact" element={<ComingSoon label="Contact Us" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default App
