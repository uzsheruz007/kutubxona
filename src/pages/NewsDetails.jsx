import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function NewsDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const allCategories = ["Yangi", "Texnik", "E’lon", "Eslatma"];

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        // Updated to use 127.0.0.1 for consistency
        const response = await fetch(`http://127.0.0.1:8000/api/news/${id}/`, {
          headers: {
            'Accept-Language': i18n.language || 'uz'
          }
        });
        if (!response.ok) throw new Error(t("news.notFound"));
        const data = await response.json();
        setNewsItem(data);
        setActiveCategory(data.category);
      } catch (err) {
        setError(t("news.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id, i18n.language]); // Added dependency on language

  const formattedDate = newsItem ? new Date(newsItem.date).toLocaleDateString(
    i18n.language === 'uz' ? 'uz-UZ' : i18n.language === 'ru' ? 'ru-RU' : 'en-US'
  ) : "";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-amber-600 font-medium">{t("loading")}...</p>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="text-center py-20 text-red-500 font-medium">
        {error}
        <br />
        <button
          onClick={() => navigate("/news")}
          className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition"
        >
          {t("news.backToAllNews")}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden font-sans">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px] -translate-x-1/2"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="relative z-10">
        <PageHeader title={t("news.libraryLife")} subtitle={newsItem.title} />

        <section className="pb-20 pt-10">
          <div className="max-w-4xl mx-auto px-6 md:px-8">

            {/* Main News Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100 ring-1 ring-stone-900/5"
            >
              {/* Hero Image */}
              <div className="relative aspect-[16/9] overflow-hidden group">
                <motion.img
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  src={newsItem.image ? (newsItem.image.startsWith('http') ? newsItem.image : `http://127.0.0.1:8000${newsItem.image}`) : "https://placehold.co/800x400/d6d3d1/57534e?text=No+Image"}
                  alt={newsItem.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex gap-3 flex-wrap">
                  <span className="bg-amber-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    {newsItem.category}
                  </span>
                  <span className="bg-white/90 backdrop-blur-md text-stone-900 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                    {formattedDate}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                <h1 className="text-3xl md:text-5xl font-extrabold text-stone-900 mb-8 leading-tight tracking-tight">
                  {newsItem.title}
                </h1>

                <div
                  className="prose prose-lg prose-stone max-w-none prose-img:rounded-xl prose-a:text-amber-600 text-stone-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: newsItem.description }}
                />

                <div className="mt-12 pt-8 border-t border-stone-100 flex items-center justify-between text-stone-500 text-sm">
                  <span>{t("news.postedBy")} <span className="font-semibold text-stone-700">{newsItem.author || "Admin"}</span></span>
                  <button
                    onClick={() => navigate("/news")}
                    className="text-amber-600 hover:text-amber-700 font-semibold hover:underline transition-all"
                  >
                    {t("news.backToAllNews")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
