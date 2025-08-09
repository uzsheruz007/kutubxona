import { useEffect, useRef, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Parallax } from "react-parallax";
import AnimatedSectionDivider from "./AnimatedSectionDivider";

const categories = ["Dasturlash", "Adabiyot", "Ilmiy", "Tarix", "Texnika", "Psixologiya"];

const books = {
  Dasturlash: Array(8).fill().map((_, i) => ({
    title: `JavaScript ${i + 1}`,
    cover: "/images/image2.png",
  })),
  Adabiyot: Array(8).fill().map((_, i) => ({
    title: `Adabiy Kitob ${i + 1}`,
    cover: "/images/image1.png",
  })),
  Ilmiy: Array(8).fill().map((_, i) => ({
    title: `Ilmiy Asar ${i + 1}`,
    cover: "/images/image2.png",
  })),
  Tarix: Array(8).fill().map((_, i) => ({
    title: `Tarixiy ${i + 1}`,
    cover: "/images/image3.png",
  })),
  Texnika: Array(8).fill().map((_, i) => ({
    title: `Texnika ${i + 1}`,
    cover: "/images/image.png",
  })),
  Psixologiya: Array(8).fill().map((_, i) => ({
    title: `Psixologiya ${i + 1}`,
    cover: "/images/bookcover.png",
  })),
};

function BookCard({ title, cover }) {
  return (
    <div className="keen-slider__slide px-2 sm:px-1">
      <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition group w-full max-w-64 mx-auto">
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
        <div className="p-2 sm:p-3 text-center">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2">{title}</h3>
        </div>

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center items-center p-3 sm:p-4 text-white text-center">
            <h4 className="text-sm sm:text-base font-semibold mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">{title}</h4>
            <p className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 transform translate-y-5 group-hover:translate-y-0 transition-transform duration-500 delay-200">{"Bu kitob haqida qisqacha ma'lumot mavjud emas."}</p>
            <Link
                to={`/book/$id`}
                className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform translate-y-6 group-hover:translate-y-0 delay-300 hover:scale-105"
            >
                Batafsil
            </Link>
        </div>
      </div>
    </div>
  );
}

export default function TopCategoriesSection() {
  const [activeCategory, setActiveCategory] = useState("Dasturlash");

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 4,
      spacing: 16,
    },
    renderMode: "performance",
    dragSpeed: 0.05,
    created(s) {
      s.container.addEventListener('dragstart', (e) => {
        e.preventDefault()
      })
    },
    slideChanged(s) {
      s.container.style.transitionTimingFunction = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    },
    detailsChanged(s) {
      s.container.style.transitionDuration = '1200ms'
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
        slides: { perView: 2.5, spacing: 16 },
      },
      "(max-width: 1280px)": {
        slides: { perView: 3, spacing: 16 },
      },
    },
  });

  const intervalRef = useRef(null);

  useEffect(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
        if (instanceRef.current) {
            instanceRef.current.moveToIdx(instanceRef.current.track.details.abs + 1, true);
        }
    }, 6000);

    return () => clearInterval(intervalRef.current);
  }, [activeCategory]);

  const handleNext = () => {
    instanceRef.current?.moveToIdx(instanceRef.current.track.details.abs + 1, { duration: 1500 });
  };

  const handlePrev = () => {
    instanceRef.current?.moveToIdx(instanceRef.current.track.details.abs - 1, { duration: 1500 });
  };

  return (
    // img 1920x1080 or 1920x1280 format jpg png or webp
    <Parallax bgImage="/images/topcategorybg.png" strength={300} blur={{ min: -5, max: 10 }}>
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-transparent">
        <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Top Kategoriyalar</h2>
            <p className="text-sm sm:text-base text-white mb-3 font-semibold">Mashhur kitoblarni kategoriyalar orqali toping</p>
            <AnimatedSectionDivider />
          </div>

          {/* Category Tabs - Mobile First Design */}
          <div className="mb-6 sm:mb-8">
            {/* Mobile: Stack navigation and categories */}
            <div className="block lg:hidden">
              {/* Mobile Category Selector */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-4">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        instanceRef.current?.moveToIdx(0);
                      }}
                      className={`flex-shrink-0 text-xs sm:text-sm font-medium px-4 py-3 transition whitespace-nowrap ${
                        activeCategory === cat
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-blue-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Mobile Navigation Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-full bg-white border hover:bg-blue-50 shadow-sm transition-all duration-300 hover:scale-105"
                >
                  <ChevronLeft className="w-5 h-5 text-blue-600" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 rounded-full bg-white border hover:bg-blue-50 shadow-sm transition-all duration-300 hover:scale-105"
                >
                  <ChevronRight className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            </div>

            {/* Desktop: Inline navigation with categories */}
            <div className="hidden lg:flex items-center justify-center relative bg-white">
              <button
                onClick={handlePrev}
                className="absolute left-0 z-10 p-2 rounded-full bg-white"
              >
                <ChevronLeft className="w-8 h-8 text-blue-600 hover:text-green-600 transition duration-300 cursor-pointer" />
              </button>

              <div className="flex flex-wrap justify-center bg-white rounded-lg shadow overflow-hidden">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      instanceRef.current?.moveToIdx(0);
                    }}
                    className={`text-sm font-medium px-6 lg:px-8 py-4 lg:py-5 transition ${
                      activeCategory === cat
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="absolute right-0 z-10 p-2 rounded-full bg-white cursor-pointer"
              >
                <ChevronRight className="w-8 h-8 text-blue-600 hover:text-green-600 transition-colors duration-300" />
              </button>
            </div>
          </div>

          {/* Book Carousel */}
          <div ref={sliderRef} className="keen-slider">
            {books[activeCategory].map((book, i) => (
              <BookCard key={i} {...book} />
            ))}
          </div>
        </div>
      </section>
    </Parallax>
  );
}