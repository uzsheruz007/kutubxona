import NewsCard from "../components/NewsCard";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import i18n from "../i18n";
import { API_BASE_URL } from "../config";

export default function AllNewsPage() {
    const { t } = useTranslation();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // API Call
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/news/`, {
                    headers: {
                        'Accept-Language': i18n.language || 'uz'
                    }
                });
                setNews(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching news:", err);
                setError(`Xatolik: ${err.message}`);
                setLoading(false);
            }
        };

        fetchNews();
    }, [i18n.language]);


    return (
        <div className="min-h-screen bg-stone-50 relative overflow-hidden font-sans pt-24 pb-20">

            {/* --- Background Atmosphere (Sand Theme) --- */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px] -translate-x-1/2"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#d6d3d1 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3 }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

                {/* --- Header Section --- */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-amber-100 text-amber-700 font-medium text-sm mt-16 mb-6 shadow-sm"
                    >
                        <Sparkles size={16} />
                        <span>{t("news.libraryLife")}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-extrabold text-stone-900 mb-6 tracking-tight"
                    >
                        {t("news.newsAnd")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">{t("news.announcements")}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed"
                    >
                        {t("news.pageSubtitle")}
                    </motion.p>
                </div>


                {/* --- Content Grid --- */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-amber-100 border-t-amber-600 rounded-full animate-spin"></div>
                        <p className="text-stone-500 font-medium animate-pulse">Yuklanmoqda...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 font-medium py-20 bg-red-50/50 rounded-2xl border border-red-100">
                        {error}
                    </div>
                ) : news.length === 0 ? (
                    <div className="text-center py-20 bg-white/40 rounded-3xl border border-slate-200/50 backdrop-blur-sm">
                        <Search size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-lg text-slate-500 font-medium">{t("news.noNewsFound")}</p>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        layout
                    >
                        {news.map((item, index) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                <NewsCard
                                    {...item}
                                    admin="Kutubxona_Admin"
                                    image={item.image ? (item.image.startsWith('http') ? item.image : `${API_BASE_URL}${item.image}`) : null}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
