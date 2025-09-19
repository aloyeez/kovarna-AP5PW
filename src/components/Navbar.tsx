import { Link, useNavigate } from 'react-router-dom'
import logo from '@/assets/logo.png'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" aria-label="Home">
          <img src={logo} alt="Hospůdka U Kovárny logo" />
        </Link>

        <div className="navbar-buttons">
          <button type="button" onClick={() => navigate('/')} aria-label="Home">Domov</button>
          <button type="button" onClick={() => navigate('/dailymenu')} aria-label="DailyMenu">Denní menu</button>
          <button type="button" onClick={() => navigate('/regularmenu')} aria-label="RegularMenu">Jídelní lístek</button>
          <button type="button" onClick={() => navigate('/about')} aria-label="About">O nás</button>
          <button type="button" onClick={() => navigate('/contact')} aria-label="Contact">Kontakt</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar


