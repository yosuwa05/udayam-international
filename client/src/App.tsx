import { useState } from "react"
import Home from "./components/Home"
import Navbar, { type Page } from "./components/Navbar"

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home")

  const handleNavigate = (page: Page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home onNavigate={handleNavigate} />
      default:
        return (
          <div
            className="flex min-h-screen items-center justify-center"
            style={{
              background: "#F7F9FC",
              fontFamily: "'Poppins', sans-serif",
            }}
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
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "clamp(32px,4vw,52px)",
                  color: "#0D1B3E",
                }}
              >
                {currentPage.charAt(0).toUpperCase() +
                  currentPage.slice(1).replace(/-/g, " ")}
              </h1>
              <button
                onClick={() => handleNavigate("home")}
                className="cursor-pointer rounded-full border-none px-9 py-[13px] text-[14px] font-bold text-white transition-all duration-200 hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #1B2B6B, #1565C0)",
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: "0 4px 14px rgba(27,43,107,0.3)",
                }}
              >
                ← Back to Home
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700&display=swap"
        rel="stylesheet"
      />
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main>{renderPage()}</main>
    </>
  )
}

export default App
