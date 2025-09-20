import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Hospůdka U Kovárny</h3>
            <p>Tradiční česká kuchyně v historické atmosféře</p>
            {/* <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="TripAdvisor">⭐</a> 
            </div> */}
          </div>
          
          <div className="footer-section">
            <h4>Kontakt</h4>
            <p>📍 Lešetín I 610, 760 01 Zlín</p>
            <p>📞 +420 775 954 945</p>
            <p>✉️ hospudka@ukovarny.cz</p>
          </div>
          
          <div className="footer-section">
            <h4>Otevírací doba</h4>
            <p>Po-Čt: 11:00 - 14:00 | 17:00 - 22:00</p>
            <p>Pá-So: 11:00 - 14:00 | 17:00 - 22:00</p>
            <p>Ne: 18:00 - 22:00</p>
          </div>
          
          <div className="footer-section">
            <h4>Rychlé odkazy</h4>
            <ul>
              <li><a href="/menu">Jídelní lístek</a></li>
              <li><a href="/about">O nás</a></li>
              <li><a href="/contact">Kontakt</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Hospůdka U Kovárny. Všechna práva vyhrazena.</p>
          <div className="footer-links">
            <a href="#">Ochrana osobních údajů</a>
            <a href="#">Podmínky použití</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer