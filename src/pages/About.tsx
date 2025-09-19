import { useNavigate } from 'react-router-dom'

function About() {
  const navigate = useNavigate()

  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-content">
          <div className="about-text">
            <h2>Něco o naší Hospůdce…</h2>
            
            <p>
              Hospůdka U Kovárny byla založena jako rodinná firma v roce 1993 a název vznikl na popud místních starousedlíků a sousedů, kteří si ještě pamatovali, kdy naproti naší hospůdky stála kovárna, kterou si zřídil i s bytem z bývalé stodoly kovář František Bartík. V této kovárně se pracovalo ještě po 2.světové válce.
            </p>
            
            <p>
              V naší restauraci, kterou se snažíme vést v rodinném duchu, se nachází asi 60 míst a v letních měsících jsou zde pro naše hosty připraveny ještě dvě letní zahrádky s dalšími 50 místy.
            </p>
            
            <p>
              Bude nám ctí i potěšením nabídnout vám rovněž uspořádání akcí pro větší společnost, např. svatby, firemní večírky, oslavy jubileí, promoce apod. - neváhejte a napište si pro bližší nezávazné informace.
            </p>
            
            <p>
              Jelikož jsme se od 1.5.2008 stali dobrovolně nekuřáckou restaurací, ještě více jsme se zaměřili na náš jídelní lístek s tradičními českými pokrmy i moderními trendy úpravy jídel se zárukou čerstvosti všech používaných surovin. Samozřejmostí jsou i nabídky poledního menu.
            </p>
            
            <p>
              Dále bychom vám chtěli nabídnout skvělé pivo z pivovaru Černá Hora a také Plzeňský Prazdroj, který si u nás můžete nechat načepovat na jeden zátah tzv. „na hladinku". Jde o málo rozšířený styl, zejména na Moravě, ale přitom je to nejlepší a nejšetrnější způsob čepování piva. Výsledkem je pivo o ideální teplotě 7°C a s krásnou pěnou podobnou mléku.
            </p>
            
            <p>
              Rádi Vás uvítáme v naší Hospůdce a budeme se snažit, abyste od nás odcházeli spokojeni.
            </p>
            
            <p className="about-signature">
              Těšíme se na Vaší návštěvu.
            </p>
            
            <div className="about-highlight">
              <h3>🍽️ Denní menu</h3>
              <p>Každý den připravujeme čerstvé polední menu s tradičními českými pokrmy.</p>
              <button 
                onClick={() => navigate('/dailymenu')} 
                className="menu-link-btn"
              >
                Zobrazit denní menu →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
