import { useEffect, useRef, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Parallax } from "react-parallax";
import AnimatedSectionDivider from "./AnimatedSectionDivider";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../config";
import { BOOK_CATEGORIES } from "../constants/categories";

function BookCard({ title, cover, id }) {
  const { t } = useTranslation();
  return (
    <div className="keen-slider__slide px-2 sm:px-1 shrink-0">
      <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition group w-full max-w-64 mx-auto">
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
        <div className="p-2 sm:p-3 text-center h-[60px] flex items-center justify-center bg-white">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">{title}</h3>
        </div>

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center items-center p-3 sm:p-4 text-white text-center">
          <h4 className="text-sm sm:text-base font-semibold mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">{title}</h4>
          <p className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 transform translate-y-5 group-hover:translate-y-0 transition-transform duration-500 delay-200">{t("topCategories.bookDesc")}</p>
          <Link
            to={`/book/${id}`}
            className="px-3 sm:px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform translate-y-6 group-hover:translate-y-0 delay-300 hover:scale-105"
          >
            {t("topCategories.details")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TopCategoriesSection() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("Adabiyotlar");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  // Load books when category changes
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/books/?category=${activeCategory}`)
      .then(res => res.json())
      .then(data => {
        const formattedBooks = data.map(book => ({
          id: book.id,
          title: book.title,
          cover: book.cover_image || "/images/image.png"
        }));
        setBooks(formattedBooks);
      })
      .catch(err => console.error("TopCategories load error:", err))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 6,
      spacing: 16,
    },
    // renderMode: "performance",
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
        slides: { perView: 1, spacing: 8 },
      },
      "(max-width: 640px)": {
        slides: { perView: 1.3, spacing: 12 },
      },
      "(max-width: 768px)": {
        slides: { perView: 1.8, spacing: 12 },
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
  }, [activeCategory, books]); // Restart auto-scroll when books change

  const handleNext = () => {
    instanceRef.current?.moveToIdx(instanceRef.current.track.details.abs + 1, { duration: 1500 });
  };

  const handlePrev = () => {
    instanceRef.current?.moveToIdx(instanceRef.current.track.details.abs - 1, { duration: 1500 });
  };

  return (
    // img 1920x1080 or 1920x1280 format jpg png or webp
    <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-stone-50">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px] -translate-x-1/2"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 mb-2 tracking-tight">{t("topCategories.title")}</h2>
          <p className="text-sm sm:text-base text-stone-600 mb-3 font-medium">{t("topCategories.subtitle")}</p>
          <AnimatedSectionDivider />
        </div>

        {/* Category Tabs - Mobile First Design */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile: Stack navigation and categories */}
          <div className="block lg:hidden">
            {/* Mobile Category Selector */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-100 overflow-hidden mb-4">
              <div className="flex overflow-x-auto scrollbar-hide">
                {BOOK_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setActiveCategory(cat.value);
                      instanceRef.current?.moveToIdx(0);
                    }}
                    className={`flex-shrink-0 text-xs sm:text-sm font-medium px-4 py-3 transition whitespace-nowrap ${activeCategory === cat.value
                      ? "bg-amber-600 text-white"
                      : "bg-white text-stone-700 hover:bg-amber-50"
                      }`}
                  >
                    {t(`categories.${cat.value.toLowerCase()}`, cat.label)}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Navigation Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-white border border-stone-200 hover:bg-amber-50 shadow-sm transition-all duration-300 hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5 text-amber-600" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-white border border-stone-200 hover:bg-amber-50 shadow-sm transition-all duration-300 hover:scale-105"
              >
                <ChevronRight className="w-5 h-5 text-amber-600" />
              </button>
            </div>
          </div>

          {/* Desktop: Inline navigation with categories */}
          <div className="hidden lg:flex items-center justify-center relative bg-transparent">
            {showArrows && (
              <button
                onClick={handlePrev}
                className="absolute left-0 z-10 p-3 rounded-full bg-white border border-stone-100 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6 text-amber-600" />
              </button>
            )}

            <div className="flex flex-wrap justify-center bg-white rounded-xl shadow-lg border border-stone-100/50 overflow-hidden p-1">
              {BOOK_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setActiveCategory(cat.value);
                    instanceRef.current?.moveToIdx(0);
                  }}
                  className={`text-sm font-semibold px-6 lg:px-8 py-3 lg:py-4 transition rounded-lg ${activeCategory === cat.value
                    ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-md"
                    : "bg-transparent text-stone-600 hover:bg-stone-50 hover:text-amber-700"
                    }`}
                >
                  {t(`categories.${cat.value.toLowerCase()}`, cat.label)}
                </button>
              ))}
            </div>

            {showArrows && (
              <button
                onClick={handleNext}
                className="absolute right-0 z-10 p-3 rounded-full bg-white border border-stone-100 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-6 h-6 text-amber-600" />
              </button>
            )}
          </div>
        </div>

        {/* Book Carousel */}
        <div ref={sliderRef} className="keen-slider py-4" style={{ touchAction: "pan-y" }}>
          {books.length > 0 ? (
            books.map((book, i) => (
              <BookCard key={book.id || i} {...book} />
            ))
          ) : (
            <div className="text-center py-10 w-full text-stone-500">
              {t("noBooksFound", "Ushbu kategoriyada kitoblar topilmadi.")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}