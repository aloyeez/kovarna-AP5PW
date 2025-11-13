import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTopButton from './components/ScrollToTopButton'
import ProtectedRoute from './components/ProtectedRoute'
import About from './pages/About'
import Menu from './pages/Menu'
import DailyMenu from './pages/DailyMenu'
import RegularMenu from './pages/RegularMenu'
import Drinks from './pages/Drinks'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Reservations from './pages/Reservations'
import MyReservations from './pages/MyReservations'
import Admin from './pages/Admin'
import { useScrollToTop } from './hooks/useScrollToTop'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'

function AppContent() {
  // This hook will scroll to top on every route change
  useScrollToTop()

  return (
    <div className="App">
      <Toaster position="bottom-right" theme="dark" richColors />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={
          <main className="main-content">
            <About />
          </main>
        } />
        <Route path="/menu" element={
          <main className="main-content">
            <Menu />
          </main>
        } />
        <Route path="/dailymenu" element={
          <main className="main-content">
            <DailyMenu />
          </main>
        } />
        <Route path="/regularmenu" element={
          <main className="main-content">
            <RegularMenu />
          </main>
        } />
        <Route path="/drinks" element={
          <main className="main-content">
            <Drinks />
          </main>
        } />
        <Route path="/contact" element={
          <main className="main-content">
            <Contact />
          </main>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reservations" element={
          <ProtectedRoute>
            <main className="main-content">
              <Reservations />
            </main>
          </ProtectedRoute>
        } />
        <Route path="/my-reservations" element={
          <ProtectedRoute>
            <main className="main-content">
              <MyReservations />
            </main>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <main className="main-content">
              <Admin />
            </main>
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
