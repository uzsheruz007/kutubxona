import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSekeleton";
import Pagination from "../components/Pagination";
import noDataSvg from '../assets/undraw_no-data_ig65.svg';
import PageHeader from "../components/PageHeader";
import { API_BASE_URL } from "../config";
import { BOOK_CATEGORIES } from "../constants/categories";
import { useTranslation } from "react-i18next";

const categories = [
  { value: "Barchasi", label: "Barchasi" },
  ...BOOK_CATEGORIES
];

export default function BooksPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "Barchasi";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 15;

  // "allBooks" stores the full raw list fetched from API
  const [allBooks, setAllBooks] = useState([]);
  // "displayBooks" stores the filtered and sorted list shown to user
  const [displayBooks, setDisplayBooks] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || ""); // Input value
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("search") || ""); // Debounced value for filtering
  const [sort, setSort] = useState("title");

  // 1. Fetch ALL books for the current category once
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE_URL}/api/books/`;
        const params = {};

        // Server-side category filtering (more efficient than fetching EVERYTHING if DB is huge)
        if (currentCategory !== "Barchasi") {
          params.category = currentCategory;
        }

        const res = await axios.get(url, {
          params,
          headers: {
            "Accept-Language": i18n.language
          }
        });
        const data = res.data || [];
        setAllBooks(data);
        // Initial set (will be updated by the filtering effect below)
        setDisplayBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
        setAllBooks([]);
        setDisplayBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentCategory, i18n.language]);

  // 2. Debounce Search Input (Security & Performance: prevents freezing on fast typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 3. Filter and Sort locally
  useEffect(() => {
    let works = [...allBooks];

    // Local Search Filter (Case-insensitive)
    if (debouncedSearch.trim()) {
      const lowerSearch = debouncedSearch.trim().toLowerCase();
      works = works.filter((b) =>
        b.title.toLowerCase().includes(lowerSearch) ||
        (b.author && b.author.toLowerCase().includes(lowerSearch))
      );
    }

    // Local Sorting
    if (sort === "title") {
      works.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "author") {
      works.sort((a, b) => (a.author || "").localeCompare(b.author || ""));
    } else if (sort === "year") {
      works.sort((a, b) => new Date(b.published_date || 0) - new Date(a.published_date || 0));
    }

    setDisplayBooks(works);

    // Reset to page 1 if filtered results change
    // Only if the current page is out of bounds or to keep UX smooth
    // But be careful not to reset if just sorting. 
    // Ideally, search changes should reset page.
  }, [allBooks, debouncedSearch, sort]);

  // Reset page when search changes
  useEffect(() => {
    if (page !== 1) {
      setSearchParams({ category: currentCategory, page: 1 });
    }
  }, [debouncedSearch]);


  // Pagination Logic
  const totalCount = displayBooks.length;
  const paginatedBooks = displayBooks.slice((page - 1) * limit, page * limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 pb-16">
      <PageHeader title={t("allBooks")} subtitle={t("allBooksSubtitle")} />

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Sidebar */}
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
                  onClick={() => {
                    setSearchParams({ category: cat.value, page: 1 });
                    setSearchTerm(""); // Clear search when changing category
                  }}
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

          {/* Main Content */}
          <div className="md:col-span-3">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-stone-900">
                  {t("currentCategory")}: <span className="text-amber-600">{currentCategory === "Barchasi" ? t("categories.all") : t(`categories.${currentCategory.toLowerCase()}`, categories.find(c => c.value === currentCategory)?.label || currentCategory)}</span>
                </h2>
                <p className="text-stone-500 text-sm mt-1">{totalCount} {t("booksFound")}</p>
              </div>

              {/* Search Input */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white shadow-sm"
                />
                <Search className="absolute left-3 top-2.5 text-stone-400 w-4 h-4" />
              </div>
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {loading
                  ? Array.from({ length: 9 }).map((_, idx) => (
                    <BookCardSkeleton key={idx} />
                  ))
                  : paginatedBooks.length > 0
                    ? paginatedBooks.map((book, idx) => (
                      <motion.div
                        key={book.id || idx}
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
                        {searchTerm && <p className="text-stone-400 text-sm mt-2">"{searchTerm}" bo'yicha hech narsa topilmadi</p>}
                      </div>
                    )}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalCount > limit && (
              <div className="flex justify-center mt-12">
                <Pagination totalItems={totalCount} itemsPerPage={limit} />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}