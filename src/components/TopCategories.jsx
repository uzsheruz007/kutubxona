import { useEffect, useRef, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../config";
import { BOOK_CATEGORIES } from "../constants/categories";
import BookCard from "./BookCard";

export default function TopCategoriesSection() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("Adabiyotlar");
  const [books, setBooks] = useState([]);
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books/?category=${activeCategory}`)
      .then(res => res.json())
      .then(data => {
        const formattedBooks = data.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          coverUrl: book.cover_image || "/images/image.png"
        }));
        setBooks(formattedBooks);
      })
      .catch(err => console.error("TopCategories load error:", err));
  }, [activeCategory]);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 6,
      spacing: 20,
    },
    dragSpeed: 0.05,
    created(s) {
      const hasOverflow = s.track?.details?.maxIdx > 0;
      setShowArrows(hasOverflow);
      s.container.addEventListener('dragstart', (e) => {
        e.preventDefault()
      })
    },
    slideChanged(s) {
      s.container.style.transitionTimingFunction = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    },
    detailsChanged(s) {
      s.container.style.transitionDuration = '1200ms';
      const hasOverflow = s.track?.details?.maxIdx > 0;
      setShowArrows(hasOverflow);
    },
    breakpoints: {
      "(max-width: 480px)": {
        slides: { perView: 1.6, spacing: 12 },
      },
      "(max-width: 640px)": {
        slides: { perView: 2, spacing: 12 },
      },
      "(max-width: 768px)": {
        slides: { perView: 2.5, spacing: 16 },
      },
      "(max-width: 1024px)": {
        slides: { perView: 4, spacing: 16 },
      },
      "(max-width: 1280px)": {
        slides: { perView: 5, spacing: 16 },
      },
    },
  });

  const intervalRef = useRef(null);

  useEffect(() => {
    if (instanceRef.current && instanceRef.current.update) {
      setTimeout(() => instanceRef.current?.update(), 100);
    }
  }, [books, instanceRef]);

  useEffect(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (instanceRef.current && instanceRef.current.track && instanceRef.current.track.details) {
        instanceRef.current.moveToIdx(instanceRef.current.track.details.abs + 1, true);
      }
    }, 6000);

    return () => clearInterval(intervalRef.current);
  }, [activeCategory, books]);

  const handleNext = () => {
    instanceRef.current?.moveToIdx(instanceRef.current.track.details.abs + 1, { duration: 1500 });
  };

  const handlePrev = () => {
    instanceRef.current?.moveToIdx(instanceRef.current.track.details.abs - 1, { duration: 1500 });
  };

  return (
    <section className="py-16 md:py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="text-center" style={{ marginBottom: "var(--space-6)" }}>
          <h2>{t("topCategories.title")}</h2>
          <p className="text-muted">{t("topCategories.subtitle")}</p>
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          style={{ marginBottom: "var(--space-6)", borderBottom: "1px solid var(--color-divider)", paddingBottom: "var(--space-3)" }}
        >
          {BOOK_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setActiveCategory(cat.value);
                instanceRef.current?.moveToIdx(0);
              }}
              className="btn"
              style={{
                padding: "4px 2px",
                color: activeCategory === cat.value ? "var(--color-accent)" : "var(--color-text)",
                borderBottom: activeCategory === cat.value ? "1px solid var(--color-accent)" : "1px solid transparent",
                borderRadius: 0,
              }}
            >
              {t(`categories.${cat.value.toLowerCase()}`, cat.label)}
            </button>
          ))}
        </div>

        <div className="relative">
          {showArrows && (
            <button onClick={handlePrev} className="btn btn-icon btn-secondary hidden lg:flex" style={{ position: "absolute", left: -18, top: "40%", zIndex: 10 }}>
              <ChevronLeft size={18} />
            </button>
          )}

          <div ref={sliderRef} className="keen-slider py-2" style={{ touchAction: "pan-y" }}>
            {books.length > 0 ? (
              books.map((book, i) => (
                <div className="keen-slider__slide" key={book.id || i}>
                  <BookCard variant="grid" {...book} />
                </div>
              ))
            ) : (
              <div className="text-center py-10 w-full text-muted">
                {t("noBooksFound", "Ushbu kategoriyada kitoblar topilmadi.")}
              </div>
            )}
          </div>

          {showArrows && (
            <button onClick={handleNext} className="btn btn-icon btn-secondary hidden lg:flex" style={{ position: "absolute", right: -18, top: "40%", zIndex: 10 }}>
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        {showArrows && (
          <div className="flex lg:hidden justify-center gap-4" style={{ marginTop: "var(--space-4)" }}>
            <button onClick={handlePrev} className="btn btn-icon btn-secondary">
              <ChevronLeft size={18} />
            </button>
            <button onClick={handleNext} className="btn btn-icon btn-secondary">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
