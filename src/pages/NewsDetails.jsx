import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { motion } from "framer-motion";

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const allCategories = ["Yangi", "Texnik", "E’lon", "Eslatma"];

  useEffect(() => {
    const fakeNewsData = [
      {
        id: 1,
        title: "Yangi o'quv yiliga tayyorgarlik boshlandi",
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit...`,
        image: "/images/news/news1.png",
        date: "2025-08-01",
        category: "Yangi",
        postedBy: "Admin",
      },
      {
        id: 2,
        title: "Texnik xizmatlar va yangilanishlar",
        description: `Curabitur nec tellus vel lorem luctus viverra...`,
        image: "/images/news/news2.png",
        date: "2025-07-30",
        category: "Texnik",
        postedBy: "Admin",
      },
    ];

    const found = fakeNewsData.find((item) => item.id === parseInt(id));
    if (found) {
      setNewsItem(found);
      setActiveCategory(found.category);
    } else {
      setError("Yangilik topilmadi.");
    }
    setLoading(false);
  }, [id]);

  const formattedDate = newsItem ? new Date(newsItem.date).toLocaleDateString("uz-UZ") : "";

  if (loading) {
    return <div className="text-center py-20 text-blue-600 animate-pulse">Yuklanmoqda...</div>;
  }

  if (error || !newsItem) {
    return (
      <div className="text-center py-20 text-red-500 font-medium">
        {error}
        <br />
        <button
          onClick={() => navigate("/news")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Barcha yangiliklar sahifasiga qaytish
        </button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={newsItem.title}
        subtitle={`${formattedDate} • ${newsItem.category} • ${newsItem.postedBy}`}
      />

      <section className="py-20 bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-10">

          {/* Sidebar: Desktop Category Card */}
          <aside className="hidden lg:block sticky top-28 self-start">
            <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Kategoriyalar</h3>
              <ul className="space-y-3">
                {allCategories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className={`block w-full text-left font-medium px-4 py-2 rounded-lg transition ${
                        cat === activeCategory
                          ? "bg-blue-600 text-white shadow"
                          : "text-gray-700 hover:bg-blue-50"
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Mobile: Category Pills */}
          <div className="lg:hidden mb-6 overflow-x-auto scrollbar-hide -mx-1 px-1">
            <div className="flex space-x-3">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition ${
                    cat === activeCategory
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Main News Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Hero Image */}
            <div className="relative aspect-[16/7] overflow-hidden">
              <img
                src={newsItem.image}
                alt={newsItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 text-gray-800 text-xs px-4 py-1 rounded-full shadow font-semibold">
                {formattedDate} • {newsItem.category} • {newsItem.postedBy}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {newsItem.title}
              </h1>
              <div className="space-y-6 text-gray-800 leading-relaxed text-lg whitespace-pre-line">
                {newsItem.description}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
