import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSekeleton";
import Pagination from "../components/Pagination";
import noDataSvg from '../assets/undraw_no-data_ig65.svg';
import PageHeader from "../components/PageHeader";
import i18n from "../i18n";
import { API_BASE_URL } from "../config";
import { BOOK_CATEGORIES } from "../constants/categories";

const categories = [
  { value: "Barchasi", label: "Barchasi" },
  ...BOOK_CATEGORIES
];

import { useTranslation } from "react-i18next";

export default function BooksPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "Barchasi";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 18;

  const [booksData, setBooksData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("title");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE_URL}/api/books/`;
        const params = {};

        // Category Filter
        if (currentCategory !== "Barchasi") {
          params.category = currentCategory;
        }

        const res = await axios.get(url, {
          params,
          headers: {
            "Accept-Language": i18n.language
          }
        });
        let works = res.data || [];



        // Search filter
        if (search.trim()) {
          works = works.filter((b) =>
            b.title.toLowerCase().includes(search.trim().toLowerCase())
          );
        }

        // Sort
        if (sort === "title") {
          works = works.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === "author") {
          works = works.sort((a, b) =>
            (a.author || "").localeCompare(b.author || "")
          );
        } else if (sort === "year") {
          // published_date string "YYYY-MM-DD"
          works = works.sort((a, b) => new Date(b.published_date || 0) - new Date(a.published_date || 0));
        }

        setBooksData(works);
        setTotalCount(works.length);
      } catch (err) {
        setBooksData([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentCategory, search, sort, i18n.language]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 pb-16">
      {/* Header */}
      <PageHeader title={t("allBooks")} subtitle={t("allBooksSubtitle")} />

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar – Kategoriya tugmalari */}
          <aside className="md:col-span-1 bg-white shadow rounded-lg p-5 h-fit md:sticky md:top-24 border border-stone-100 mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4 text-stone-800 flex items-center justify-between md:block cursor-pointer md:cursor-default" onClick={() => document.getElementById('cat-list').classList.toggle('hidden')}>
              {t("categoriesLabel")}
              <span className="md:hidden text-amber-600">▼</span>
            </h3>
            <motion.div
              id="cat-list"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.07 } },
              }}
              className="flex flex-col gap-2 hidden md:flex"
            >
              {categories.map((cat) => (
                <motion.button
                  key={cat.value}
                  onClick={() => setSearchParams({ category: cat.value, page: 1 })}
                  className={`text-sm cursor-pointer px-4 py-2 rounded-md text-left transition-all duration-300 relative overflow-hidden ${currentCategory === cat.value
                    ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold shadow-lg scale-[1.03]"
                    : "bg-stone-50 hover:bg-amber-50 text-stone-700"
                    }`
                  }
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 20px rgba(245, 158, 11, 0.2)",
                  }}
                >
                  {cat.value === "Barchasi" ? t("categories.all") : t(`categories.${cat.value.toLowerCase()}`, cat.label)}
                </motion.button>
              ))}
            </motion.div>
          </aside>

          {/* Kitoblar – Grid ko‘rinishda */}
          <div className="md:col-span-3">

            <h2 className="text-2xl font-bold mb-6 text-stone-900">
              <h2 className="text-2xl font-bold mb-6 text-stone-900">
                {t("currentCategory")}: <span className="text-amber-600">{currentCategory === "Barchasi" ? t("categories.all") : t(`categories.${currentCategory.toLowerCase()}`, categories.find(c => c.value === currentCategory)?.label || currentCategory)}</span>
              </h2>
            </h2>

            {/* Book Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {loading
                  ? Array.from({ length: 9 }).map((_, idx) => (
                    <BookCardSkeleton key={idx} />
                  ))
                  : booksData.length > 0
                    ? booksData.map((book, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.4 }}
                      >
                        <BookCard
                          id={book.id}
                          title={book.title}
                          author={book.author}
                          coverUrl={
                            book.cover_image
                              ? (book.cover_image.startsWith('http') ? book.cover_image : `${API_BASE_URL}${book.cover_image}`)
                              : ""
                          }
                          category={book.category}
                        />
                      </motion.div>
                    ))
                    : (
                      <div className="col-span-full flex flex-col items-center py-20">
                        <img src={noDataSvg} alt="No books" className="w-40 h-40 mb-6 opacity-80" />
                        <p className="text-stone-500 text-lg">{t("noBooksFound")}</p>
                      </div>
                    )}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <Pagination totalItems={totalCount} itemsPerPage={limit} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}