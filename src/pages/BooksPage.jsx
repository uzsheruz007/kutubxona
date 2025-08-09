import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSekeleton";
import Pagination from "../components/Pagination";
import noDataSvg from '../assets/undraw_no-data_ig65.svg';
import PageHeader from "../components/PageHeader";

const categories = [
  "Barchasi",
  "Badiiy",
  "Ilmiy",
  "Biografiya",
  "Falsafa",
  "Texnologiya",
];

export default function BooksPage() {
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
        const subject = currentCategory !== "Barchasi" ? currentCategory : "fiction";
        const offset = (page - 1) * limit;

        const res = await axios.get(
          `https://corsproxy.io/?https://openlibrary.org/subjects/${subject.toLowerCase()}.json?limit=${limit}&offset=${offset}`
        );

        let works = res.data.works || [];

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
            (a.authors?.[0]?.name || "").localeCompare(b.authors?.[0]?.name || "")
          );
        } else if (sort === "year") {
          works = works.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
        }

        setBooksData(works);
        setTotalCount(res.data.work_count || 0);
      } catch (err) {
        setBooksData([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentCategory, page, search, sort]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pb-16">
      {/* Header */}
      <PageHeader title={"Barcha Kitoblar"} subtitle={"Kutubxonamizdagi barcha kitoblarni ko'ring va o'qing!"} />

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar – Kategoriya tugmalari */}
          <aside className="md:col-span-1 bg-white shadow rounded-lg p-5 h-fit sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Kategoriyalar</h3>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.07 } },
              }}
              className="flex flex-col gap-2"
            >
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setSearchParams({ category: cat, page: 1 })}
                  className={`text-sm cursor-pointer px-4 py-2 rounded-md text-left transition-all duration-300 relative overflow-hidden ${
                    currentCategory === cat
                      ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow-lg scale-[1.03]"
                      : "bg-gray-50 hover:bg-blue-50 text-gray-800"
                  }`
                }
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 20px rgba(59,130,246,0.2)",
                }}
                >
                  {cat}
                </motion.button>
              ))}
            </motion.div>
          </aside>

          {/* Kitoblar – Grid ko‘rinishda */}
          <div className="md:col-span-3">

            <h2 className="text-2xl font-bold mb-6">
              Kategoriya: <span className="text-blue-600">{currentCategory}</span>
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
                          id={book.key?.split("/").pop()}
                          title={book.title}
                          author={book.authors?.[0]?.name}
                          coverUrl={
                            book.cover_id
                              ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
                              : ""
                          }
                        />
                      </motion.div>
                    ))
                  : (
                    <div className="col-span-full flex flex-col items-center py-20">
                      <img src={noDataSvg} alt="No books" className="w-40 h-40 mb-6" />
                      <p className="text-gray-500 text-lg">Hech qanday kitob topilmadi.</p>
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