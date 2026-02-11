import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Book } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSectionDivider from "./AnimatedSectionDivider";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../config";

export default function MostPopularBooks() {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books/popular/`, {
      headers: {
        "Accept-Language": i18n.language
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const formattedBooks = data.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            description: book.description || t("books.noDescription", "No description available"),
            cover: book.cover_image || "/images/image.png"
          }));
          setBooks(formattedBooks);
        }
      })
      .catch(err => console.error("Popular books loading error:", err));
  }, [t, i18n.language]);

  if (books.length === 0) return null; // Or show loading/empty state

  const activeBook = books[activeIndex] || books[0];

  return (
    <section className="bg-stone-50 py-20 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-bl from-stone-50 via-amber-50/40 to-white"></div>

      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl font-extrabold text-stone-900 font-serif mb-4 tracking-tight">
          {t("popularBooks.title")}
        </h2>
        <p className="text-stone-600 text-lg font-medium mb-3">
          {t("popularBooks.subtitle")}
        </p>
        <AnimatedSectionDivider />
      </div>

      {/* Responsive Grid */}
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-10 relative z-10">

        {/* Book Details - Now narrower */}
        <div className="w-full lg:w-3/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBook.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 h-full flex flex-col justify-between border border-stone-100/50"
            >
              <div className="flex flex-col lg:flex-row gap-8 items-start h-full">
                <img //400x600
                  src={activeBook.cover}
                  alt={activeBook.title}
                  className="w-48 md:w-56 rounded-lg shadow-lg object-cover"
                />

                <div className="flex flex-col justify-between flex-1 h-full">
                  <div>
                    <h3 className="text-3xl font-bold text-stone-900 mb-2">
                      {activeBook.title}
                    </h3>
                    <p className="text-stone-600 mb-4 font-medium">
                      <span className="font-semibold text-stone-800">{t("author")}:</span> {activeBook.author}
                    </p>
                    <p className="text-stone-700 leading-relaxed line-clamp-4 text-lg">
                      {activeBook.description}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Link
                      to={`/book/${activeBook.id}`}
                      className="bg-amber-600 cursor-pointer hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-amber-200 hover:shadow-amber-300 transition transform hover:-translate-y-0.5 inline-block"
                    >
                      {t("viewDetails")}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Book Tabs - Now wider */}
        <div className="w-full lg:w-2/5 grid grid-cols-3 sm:grid-cols-3 gap-4">
          {books.map((book, index) => (
            <button
              key={book.id}
              onClick={() => setActiveIndex(index)}
              className={`rounded-xl overflow-hidden transition-all duration-300 border-2 ${activeIndex === index
                ? "border-amber-500 ring-2 ring-amber-200 scale-105 shadow-md"
                : "border-transparent hover:border-amber-200 opacity-80 hover:opacity-100"
                }`}
            >
              <img // 240x360
                src={book.cover}
                alt={book.title}
                className="w-full cursor-pointer aspect-[2/3] object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
