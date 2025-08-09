import PageHeader from "../components/PageHeader";
import NewsCard from "../components/NewsCard";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const categories = ["Barchasi", "E'lon", "Tadbir", "Yangi", "Xizmat", "Texnik"];

export default function AllNewsPage() {
    const [news, setNews] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [activeCategory, setActiveCategory] = useState("Barchasi");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                const fakeNewsData = [
                    {
                        id: 1,
                        title: "Yangi o'quv yiliga tayyorgarlik boshlandi",
                        description: "Elektron kutubxona yangilandi, interfeys soddalashtirildi.",
                        image: "/images/news/news1.png",
                        date: "2025-08-01",
                        category: "Yangi",
                    },
                    {
                        id: 2,
                        title: "Texnik xizmatlar va yangilanishlar",
                        description: "Bugun soat 18:00 da qisqa texnik xizmat bo'lishi rejalashtirilgan.",
                        image: "/images/news/news2.png",
                        date: "2025-07-30",
                        category: "Texnik",
                    },
                    {
                        id: 3,
                        title: "Yangi fanlar bo‘yicha kitoblar qo‘shildi",
                        description: "Biologiya va Geografiya fanlari bo‘yicha 150 dan ortiq kitoblar qo‘shildi.",
                        image: "/images/news/news3.png",
                        date: "2025-07-20",
                        category: "E'lon",
                    },
                ];

                setNews(fakeNewsData);
                setFilteredNews(fakeNewsData);
                setLoading(false);
            } catch (err) {
                setError("Yangiliklarni yuklashda xatolik yuz berdi.");
                setLoading(false);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (loading) return;
        if (activeCategory === "Barchasi") {
            setFilteredNews(news);
        } else {
            const filtered = news.filter((n) => n.category === activeCategory);
            setFilteredNews(filtered)
        }
    }, [activeCategory, news, loading]);

    return (
        <>
            <PageHeader
                title="Barcha yangiliklar"
                subtitle="Elektron kutubxonamizdagi barcha e'lonlar va xabarlar"
            />

            <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-3 justify-center mb-10">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition shadow-sm border ${activeCategory === cat
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 hover:bg-blue-50 border-gray-300"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Loading / Error / Empty States */}
                    {loading ? (
                        <div className="text-center text-blue-600 font-medium animate-pulse py-20">
                            Yangiliklar yuklanmoqda...
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 font-medium py-20">
                            {error}
                        </div>
                    ) : filteredNews.length === 0 ? (
                        <div className="text-center text-gray-600 font-medium py-20">
                            Ushbu toifadagi yangiliklar mavjud emas.
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                            initial="hidden"
                            animate="visible"
                            key={activeCategory}
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.1,
                                    },
                                },
                                hidden: {},
                            }}
                        >
                            {filteredNews.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 },
                                    }}
                                    transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
                                >
                                    <NewsCard {...item} admin="Admin" />
                                </motion.div>
                            ))}
                        </motion.div>

                    )}
                </div>
            </section>
        </>
    );
}
