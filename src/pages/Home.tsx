import homeBackground from "../assets/pozadi.jpg";
import HomeContent from "../components/HomeContent";

export default function Home() {
  return (
    <HomeContent
      title="Vítejte v Hospůdce U Kovárny"
      description="Místo, kde se potkává poctivá česká kuchyně, rodinná pohoda a přátelská atmosféra. Přijďte ochutnat naše speciality a dejte si dobře vychlazené pivo"
      imageUrl={homeBackground}
    />
  );
}
