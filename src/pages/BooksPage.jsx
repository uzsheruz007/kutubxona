import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutGrid, List as ListIcon } from "lucide-react";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSekeleton";
import Pagination from "../components/Pagination";
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
  const [sort] = useState("title");
  const [view, setView] = useState("grid");

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

  const bookMeta = (book) => {
    const parts = [];
    if (book.page_count) parts.push(`${book.page_count} ${t("pages")}`);
    if (book.published_date) parts.push(new Date(book.published_date).getFullYear());
    return parts.join(" · ");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
      <h6 style={{ color: "var(--color-accent)" }}>{t("navbar.books")}</h6>
      <hr className="hr" />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 style={{ fontWeight: 400, margin: 0 }}>{t("allBooks")}</h1>
          <p className="num" style={{ margin: "var(--space-1) 0 0", color: "color-mix(in srgb, var(--color-text) 55%, transparent)" }}>
            {totalCount} {t("booksFound")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={16}
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-accent)" }}
            />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{ width: 250, paddingLeft: 32 }}
            />
          </div>
          <div className="seg">
            <label className="seg-opt">
              <input type="radio" name="view" checked={view === "grid"} onChange={() => setView("grid")} />
              <LayoutGrid size={15} />
            </label>
            <label className="seg-opt">
              <input type="radio" name="view" checked={view === "list"} onChange={() => setView("list")} />
              <ListIcon size={15} />
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" style={{ margin: "var(--space-4) 0" }}>
        {categories.map((cat) => (
          <span
            key={cat.value}
            role="button"
            tabIndex={0}
            onClick={() => {
              setSearchParams({ category: cat.value, page: 1 });
              setSearchTerm("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchParams({ category: cat.value, page: 1 });
                setSearchTerm("");
              }
            }}
            className={`tag ${currentCategory === cat.value ? "tag-accent" : "tag-neutral"}`}
            style={{ cursor: "pointer" }}
          >
            {cat.value === "Barchasi" ? t("categories.all") : t(`categories.${cat.value.toLowerCase()}`, cat.label)}
          </span>
        ))}
      </div>

      <div
        className={view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6" : "flex flex-col gap-3"}
      >
        <AnimatePresence>
          {loading
            ? Array.from({ length: 9 }).map((_, idx) => (
              <BookCardSkeleton key={idx} />
            ))
            : paginatedBooks.length > 0
              ? paginatedBooks.map((book, idx) => (
                <motion.div
                  key={book.id || idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
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
                    meta={bookMeta(book)}
                    variant={view === "list" ? "row" : "grid"}
                  />
                </motion.div>
              ))
              : (
                <div className="col-span-full flex flex-col items-center" style={{ padding: "var(--space-8) 0" }}>
                  <p style={{ color: "color-mix(in srgb, var(--color-text) 55%, transparent)" }}>{t("noBooksFound")}</p>
                  {searchTerm && (
                    <p style={{ fontSize: 13, marginTop: "var(--space-1)", color: "color-mix(in srgb, var(--color-text) 40%, transparent)" }}>
                      "{searchTerm}"
                    </p>
                  )}
                </div>
              )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalCount > limit && (
        <div className="flex justify-center" style={{ marginTop: "var(--space-8)" }}>
          <Pagination totalItems={totalCount} itemsPerPage={limit} />
        </div>
      )}
    </div>
  );
}
