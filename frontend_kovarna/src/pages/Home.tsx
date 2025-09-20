import "./Home.css";
import achieveImg from "../assets/brewers_star.jpg";
import foodImg from "../assets/food.jpg";
import beerImg from "../assets/beer.jpg";
import pozadiImg from "../assets/background.jpg";
import { TextFade } from "../hooks/textFade";
import { useLanguage } from '../contexts/LanguageContext';

function Home() {
  const { t } = useLanguage();
  
  const features = [
    {
      id: 1,
      title: t('home.beerTitle'),
      description: t('home.beerDescription'),
      image: beerImg,
    },
    {
      id: 2,
      title: t('home.foodTitle'),
      description: t('home.foodDescription'),
      image: foodImg,
    },
    {
      id: 3,
      title: t('home.awardTitle'),
      description: t('home.awardDescription'),
      image: achieveImg,
    },
  ];

  return (
    <>
      <section
        className="home"
        style={{ backgroundImage: `url(${pozadiImg})` }}
      >
        <div className="overlay"></div>
        <div className="home-content">
          <TextFade direction="up" staggerChildren={0.45}>
            <h1 className="text-xl text-center sm:text-4xl font-bold tracking-tighter md:text-6xl">
              <div className="mb-2">{t('home.title').split(' ').slice(0, 4).join(' ')}</div>
              <div>{t('home.title').split(' ').slice(4).join(' ')}</div>
            </h1>
            <p className="mt-10 text-center md:text-lg max-w-2xl mx-auto leading-relaxed text-balance dark:text-zinc-300">
              {t('home.subtitle')}
            </p>
            <a href="/menu" className="home-btn">
              {t('home.showMenu')}
            </a>
          </TextFade>
        </div>
      </section>

      <section className="features">
        {features.map((f, index) => (
          <div
            key={f.id}
            className={`feature-card ${index % 2 === 1 ? "reverse" : ""}`}
          >
            <div className="feature-image">
              <img src={f.image} alt={f.title} />
            </div>
            <div className="feature-text">
              <h2>{f.title}</h2>
              <p>{f.description}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

export default Home;