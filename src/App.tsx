import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTopButton from './components/ScrollToTopButton'
import About from './pages/About'
import Menu from './pages/Menu'
import DailyMenu from './pages/DailyMenu'
import RegularMenu from './pages/RegularMenu'
import Drinks from './pages/Drinks'
import Contact from './pages/Contact'
import Home from './pages/Home'
import { useScrollToTop } from './hooks/useScrollToTop'
import { LanguageProvider } from './contexts/LanguageContext'

function AppContent() {
  // This hook will scroll to top on every route change
  useScrollToTop()

  return (
    <div className="App">
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
      </Routes>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  )
}

export default App
