import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "./NewsCard";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../config";

export default function NewsSection() {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/news/`, {
          headers: { 'Accept-Language': i18n.language }
        });
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [i18n.language]);

  return (
    <section id="news" className="relative bg-stone-50 py-20 overflow-hidden">
      {/* (Keep existing decorative background) */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px] -translate-x-1/2"></div>
      </div>

      <style>
        {`
          .swiper-pagination-bullet {
            background-color: #d6d3d1 !important; /* stone-300 */
            opacity: 1 !important;
          }
          .swiper-pagination-bullet-active {
            background-color: #d97706 !important; /* amber-600 */
            width: 20px !important;
            border-radius: 6px !important;
            transition: all 0.3s ease !important;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-2">
              {t("news.latestNews")}
            </h2>
            <p className="text-stone-600">
              {t("news.homeSubtitle")}
            </p>
          </div>
          <Link
            to="/news"
            className="mt-4 md:mt-0 inline-block px-5 py-2 bg-amber-600 text-white rounded-full shadow hover:bg-amber-700 transition"
          >
            {t("news.viewAll")}
          </Link>
        </motion.div>

        {/* News Carousel */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-500">Yangiliklar yuklanmoqda...</p>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1.2}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={news.length > 3}
            className="pb-8"
          >
            {news.map((item) => (
              <SwiperSlide key={item.id}>
                <NewsCard
                  {...item}
                  // Ensure image is full URL if relative
                  image={item.image ? (item.image.startsWith('http') ? item.image : `${API_BASE_URL}${item.image}`) : null}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {!loading && news.length === 0 && (
          <div className="text-center py-10 text-stone-500">
            {t("news.noNewsHome")}
          </div>
        )}
      </div>
    </section>
  );
}
