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
    <section id="news" className="py-16 md:py-20 px-6">
      <style>
        {`
          .swiper-pagination-bullet {
            background-color: var(--color-neutral-400) !important;
            opacity: 1 !important;
            border-radius: var(--radius-sm) !important;
          }
          .swiper-pagination-bullet-active {
            background-color: var(--color-accent) !important;
            width: 20px !important;
            transition: all 0.3s ease !important;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between"
          style={{ marginBottom: "var(--space-6)", borderBottom: "1px solid var(--color-divider)", paddingBottom: "var(--space-4)" }}
        >
          <div>
            <h2>{t("news.latestNews")}</h2>
            <p className="text-muted">{t("news.homeSubtitle")}</p>
          </div>
          <Link to="/news" className="btn btn-primary" style={{ marginTop: "var(--space-2)" }}>
            {t("news.viewAll")}
          </Link>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-muted">{t("loading")}...</div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={28}
            slidesPerView={1.1}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={news.length > 3}
            className="pb-10"
          >
            {news.map((item) => (
              <SwiperSlide key={item.id}>
                <NewsCard
                  {...item}
                  variant="row"
                  image={item.image ? (item.image.startsWith('http') ? item.image : `${API_BASE_URL}${item.image}`) : null}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {!loading && news.length === 0 && (
          <div className="text-center py-10 text-muted">
            {t("news.noNewsHome")}
          </div>
        )}
      </div>
    </section>
  );
}
