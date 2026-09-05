import NewsCard from "../components/NewsCard";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import axios from "axios";
import i18n from "../i18n";
import { API_BASE_URL } from "../config";

const categoryKeys = ["Barchasi", "Yangilik", "E'lon", "Tadbir"];

const categoryLabelKey = {
    Barchasi: "news.categories.all",
    Yangilik: "news.categories.news",
    "E'lon": "news.categories.announcement",
    Tadbir: "news.categories.event",
};

export default function AllNewsPage() {
    const { t } = useTranslation();
    const [news, setNews] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [activeCategory, setActiveCategory] = useState("Barchasi");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/news/`, {
                    headers: {
                        'Accept-Language': i18n.language || 'uz'
                    }
                });
                setNews(response.data);
                setFilteredNews(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching news:", err);
                setError(`Xatolik: ${err.message}`);
                setLoading(false);
            }
        };

        fetchNews();
    }, [i18n.language]);

    useEffect(() => {
        if (loading) return;
        if (activeCategory === "Barchasi") {
            setFilteredNews(news);
        } else {
            setFilteredNews(news.filter(n => n.category === activeCategory));
        }
    }, [activeCategory, news, loading]);

    return (
        <div style={{ paddingTop: "calc(var(--space-8) * 2.6)", paddingBottom: "var(--space-8)" }}>
            <div className="max-w-5xl mx-auto px-4 md:px-8">

                <h6>{t("news.libraryLife")}</h6>
                <hr className="hr" />
                <motion.h1
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ fontWeight: 400 }}
                >
                    {t("news.newsAnd")} {t("news.announcements")}
                </motion.h1>
                <p style={{ maxWidth: "60ch", textAlign: "justify" }} className="text-muted">
                    {t("news.pageSubtitle")}
                </p>

                {/* --- Filters --- */}
                <div className="flex flex-wrap" style={{ gap: "var(--space-2)", margin: "var(--space-6) 0 var(--space-4)" }}>
                    {categoryKeys.map((catKey) => (
                        <button
                            key={catKey}
                            onClick={() => setActiveCategory(catKey)}
                            className={`tag ${activeCategory === catKey ? "tag-accent" : "tag-neutral"}`}
                            style={{ cursor: "pointer", border: "none" }}
                        >
                            {t(categoryLabelKey[catKey], catKey)}
                        </button>
                    ))}
                </div>

                {/* --- Content --- */}
                {loading ? (
                    <p className="text-muted text-center" style={{ padding: "var(--space-8) 0" }}>
                        {t("loading")}...
                    </p>
                ) : error ? (
                    <p className="text-center" style={{ padding: "var(--space-8) 0", color: "var(--color-accent-800)" }}>
                        {error}
                    </p>
                ) : filteredNews.length === 0 ? (
                    <p className="text-muted text-center" style={{ padding: "var(--space-8) 0" }}>
                        {t("news.noNewsFound")}
                    </p>
                ) : (
                    <div>
                        {filteredNews.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.03 }}
                            >
                                <NewsCard
                                    {...item}
                                    variant="full"
                                    image={item.image ? (item.image.startsWith('http') ? item.image : `${API_BASE_URL}${item.image}`) : null}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
