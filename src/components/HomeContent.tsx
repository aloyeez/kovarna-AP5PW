import "./Home.css";
import achieveImg from "../assets/hvezda_sladku2.jpg";
import foodImg from "../assets/foodImg.jpg";
import beerImg from "../assets/beer.jpg";
import { TextFade } from "../components/TextFade";

interface HomeContentProps {
  title: string;
  description: string;
  imageUrl: string;
}

export default function HomeContent({
  title,
  description,
  imageUrl,
}: HomeContentProps) {
  const features = [
    {
      id: 1,
      title: "Točíme pivo, které má říz",
      description:
        "U nás najdete poctivě ošetřené pivo, vždy správně vychlazené a natočené s láskou. Ochutnejte českou klasiku i originální speciály z menších pivovarů.",
      image: beerImg,
    },
    {
      id: 2,
      title: "Poctivá česká kuchyně",
      description:
        "Ještě více jsme se zaměřili na náš jídelní lístek s tradičními českými pokrmy i moderními trendy úpravy jídel se zárukou čerstvosti všech používaných surovin.",
      image: foodImg,
    },
    {
      id: 3,
      title: "Ocenění, na které jsme hrdí",
      description:
        "Prestižní ocenění Hvězda sládků je pro nás obrovským závazkem a potvrzením, že čepujeme pivo s tou největší péčí a láskou k řemeslu.",
      image: achieveImg,
    },
  ];

  return (
    <>
      <section
        className="home"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="overlay"></div>
        <div className="home-content">
          <TextFade direction="up" staggerChildren={0.45}>
            <h1 className="text-xl text-center sm:text-4xl font-bold tracking-tighter md:text-6xl md:leading-[0rem] prose-h2:my-0">
              {title}
            </h1>
            <p className="mt-10 text-center md:text-lg max-w-2xl mx-auto leading-relaxed text-balance dark:text-zinc-300">
              {description}
            </p>
            <a href="/dailymenu" className="home-btn">
              Podívejte se na menu
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
