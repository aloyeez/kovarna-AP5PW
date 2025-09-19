import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import About from './pages/About'
import DailyMenu from './pages/DailyMenu'
import RegularMenu from './pages/RegularMenu'
import Contact from './pages/Contact'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dailymenu" element={<DailyMenu />} />
            <Route path="/regularmenu" element={<RegularMenu />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
