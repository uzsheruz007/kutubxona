import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HeroSection from "../components/HeroSection";
import BooksSection from "../components/BooksSection";
import LibraryStats from "../components/Stats";
import NewsSection from "../components/News";
import FeaturesSection from "../components/Features";
import FlipBookSection from "../components/3DFlipBookSection";
import TopCategories from "../components/TopCategories";
import FeaturedBooks from "../components/FeaturedBooks";
import TodayReading from "../components/TodayReading";

function ClosingCTA() {
  const { t } = useTranslation();
  return (
    <section className="px-6" style={{ padding: "var(--space-4) 24px" }}>
      <div
        className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ borderTop: "1px solid var(--color-divider)", paddingTop: "var(--space-6)" }}
      >
        <div>
          <h3 style={{ margin: "0 0 4px" }}>{t("ctaSection.title")}</h3>
          <p className="text-muted" style={{ margin: 0, fontSize: 13 }}>{t("ctaSection.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/profile" className="btn btn-secondary">{t("ctaSection.profile")}</Link>
          <Link to="/books" className="btn btn-primary">{t("ctaSection.openCatalog")}</Link>
        </div>
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <hr className="hr" style={{ margin: 0 }} />
    </div>
  );
}

export default function HomePage() {
  const scrollToBooks = () => {
    document.getElementById("popular-books")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <HeroSection onScrollClick={scrollToBooks} />
      <Divider />
      <LibraryStats />
      <Divider />
      <FeaturedBooks />
      <Divider />
      <FeaturesSection />
      <Divider />
      <TopCategories />
      <Divider />
      <BooksSection />
      <Divider />
      <NewsSection />
      <TodayReading />
      <Divider />
      <ClosingCTA />
      <FlipBookSection />
    </div>
  );
}
