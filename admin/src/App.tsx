import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Dashboard from '@/pages/Dashboard'
import Clients from '@/pages/Clients'
import Places from '@/pages/Places'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-dark-950">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/places" element={<Places />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
