import { useEffect, useRef, useState } from "react";
import HeroSection from "../components/HeroSection";
import BooksSection from "../components/BooksSection";
import BookIntro from "../components/BookIntro";
import LibraryStats from "../components/Stats";
import NewsSection from "../components/News";
import FeaturesSection from "../components/Features";
import FlipBookSection from "../components/3DFlipBookSection";
import TopCategories from "../components/TopCategories";


export default function HomePage() {
  const booksRef = useRef(null);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToBooks = () => {
    booksRef.current?.scrollToSection();
  };

  if (showIntro) return <BookIntro />;

  return (
    <div className="bg-stone-50 min-h-screen">
      <HeroSection onScrollClick={scrollToBooks} />
      <FeaturesSection />
      <TopCategories />
      <BooksSection ref={booksRef} />
      <LibraryStats />
      <NewsSection />
      <FlipBookSection />
    </div>
  );
}
