
function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Hospůdka "U KOVÁRNY"</h2>
            
            <div className="contact-details">
              <div className="contact-item">
                <h3>📍 Adresa</h3>
                <p>Lešetín I / 610<br />760 01 ZLÍN</p>
                <p className="map-note">(viz mapa pod formulářem)</p>
              </div>
              
              <div className="contact-item">
                <h3>📞 Telefon</h3>
                <p><strong>Mobil - rezervace:</strong> 775 954 945</p>
                <p className="phone-note">(v otevírací době)</p>
                <p><strong>Mobil - vedoucí:</strong> 606 717 668</p>
              </div>
              
              <div className="contact-item">
                <h3>✉️ Email</h3>
                <p>hospudka@ukovarny.cz</p>
              </div>
              
              <div className="contact-item">
                <h3>🕒 Otevírací doba</h3>
                <div className="opening-hours">
                  <div className="day-group">
                    <h4>Pondělí - Čtvrtek</h4>
                    <p>11.00 - 14.00</p>
                    <p>17.00 - 22.00</p>
                  </div>
                  <div className="day-group">
                    <h4>Pátek</h4>
                    <p>11.00 - 14.00</p>
                    <p>17.00 - 23.00</p>
                  </div>
                  <div className="day-group">
                    <h4>Sobota</h4>
                    <p>18.00 - 23.00</p>
                  </div>
                  <div className="day-group">
                    <h4>Neděle</h4>
                    <p>18.00 - 22.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
                      <div className="social-media-section">
              <div className="facebook-plugin">
                <h4>📘 Náš Facebook</h4>
                <iframe 
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fukovarny&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" 
                  width="500" 
                  height="600" 
                  style={{ border: 'none', overflow: 'hidden' }} 
                  scrolling="no" 
                  frameBorder="0" 
                  allowFullScreen={true} 
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                ></iframe>
              </div>
            </div>
        </div>
        
        <div className="map-section">
          <h3>📍 Kde nás najdete</h3>
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2605.5249839691837!2d17.670652576877867!3d49.22853507458658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4713735764a50473%3A0xd4ff190b0352d7!2zTGXFoWV0w61uIEkgNjEwLCA3NjAgMDEgWmzDrW4gMQ!5e0!3m2!1sen!2scz!4v1755289113502!5m2!1sen!2scz" 
              height={400} 
              style={{ border: 0, width: '100%' }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Hospůdka U Kovárny Zlín"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
