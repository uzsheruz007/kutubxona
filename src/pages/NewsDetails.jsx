import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../config";

export default function NewsDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/news/${id}/`, {
          headers: {
            'Accept-Language': i18n.language || 'uz'
          }
        });
        if (!response.ok) throw new Error(t("news.notFound"));
        const data = await response.json();
        setNewsItem(data);
      } catch {
        setError(t("news.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id, i18n.language]);

  const formattedDate = newsItem ? new Date(newsItem.date).toLocaleDateString(
    i18n.language === 'uz' ? 'uz-UZ' : i18n.language === 'ru' ? 'ru-RU' : 'en-US',
    { day: "numeric", month: "long", year: "numeric" }
  ) : "";

  if (loading) {
    return (
      <p className="text-muted text-center" style={{ padding: "var(--space-8) 0" }}>
        {t("loading")}...
      </p>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="text-center" style={{ padding: "var(--space-8) 0" }}>
        <p style={{ color: "var(--color-accent-800)" }}>{error}</p>
        <button onClick={() => navigate("/news")} className="btn btn-primary" style={{ marginTop: "var(--space-3)" }}>
          {t("news.backToAllNews")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={t("news.libraryLife")} subtitle={newsItem.title} />

      <section style={{ paddingBottom: "var(--space-8)" }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="plate"
              style={{ aspectRatio: "16 / 9", background: "var(--color-neutral-100)", overflow: "hidden", marginBottom: "var(--space-4)" }}
            >
              <img
                src={newsItem.image ? (newsItem.image.startsWith('http') ? newsItem.image : `${API_BASE_URL}${newsItem.image}`) : "/images/no-image.png"}
                alt={newsItem.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div className="flex items-center" style={{ gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
              <span className="tag tag-accent">{newsItem.category}</span>
              <span className="num" style={{ fontSize: 12 }} >{formattedDate}</span>
            </div>

            <h1 style={{ fontWeight: 400 }}>{newsItem.title}</h1>

            <div
              style={{ textAlign: "justify", lineHeight: 1.75, marginTop: "var(--space-4)" }}
              dangerouslySetInnerHTML={{ __html: newsItem.description }}
            />

            <hr className="hr" />

            <div className="flex items-center justify-between text-muted" style={{ fontSize: 13 }}>
              <span>{t("news.postedBy")} <strong style={{ color: "var(--color-text)" }}>{newsItem.author || "Admin"}</strong></span>
              <button onClick={() => navigate("/news")} className="btn btn-ghost">
                {t("news.backToAllNews")}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
