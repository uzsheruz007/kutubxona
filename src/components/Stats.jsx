import { Book, Layers, Users, Sparkles } from "lucide-react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import AnimatedSectionDivider from "./AnimatedSectionDivider";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

export default function LibraryStats() {
  const { t } = useTranslation();
  const [counts, setCounts] = useState({
    totalBooks: 0,
    categories: 0,
    users: 0,
    newBooks: 0
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books/stats/`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Stats Loaded:", data);
        setCounts(data);
      })
      .catch(err => console.error("Stats loading error:", err));
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        type: "spring",
        stiffness: 120,
      },
    }),
  };

  const stats = [
    {
      icon: <Book className="w-12 h-12 text-amber-600 group-hover:scale-110 transition-transform" />,
      count: counts.totalBooks,
      label: t("stats.totalBooks"),
      border: "border-amber-200",
      ring: "group-hover:ring-amber-400/30",
    },
    {
      icon: <Layers className="w-12 h-12 text-orange-600 group-hover:scale-110 transition-transform" />,
      count: counts.categories,
      label: t("stats.categories"),
      border: "border-orange-200",
      ring: "group-hover:ring-orange-400/30",
    },
    {
      icon: <Users className="w-12 h-12 text-stone-600 group-hover:scale-110 transition-transform" />,
      count: counts.users,
      label: t("stats.users"),
      border: "border-stone-200",
      ring: "group-hover:ring-stone-400/30",
    },
    {
      icon: <Sparkles className="w-12 h-12 text-yellow-600 group-hover:scale-110 transition-transform" />,
      count: counts.newBooks,
      label: t("stats.newBooks"),
      border: "border-yellow-200",
      ring: "group-hover:ring-yellow-400/30",
    },
  ];

  return (
    <section id="stats" className="relative py-24 px-4 md:px-10 lg:px-20 bg-stone-50 overflow-hidden">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-stone-50 via-amber-50/50 to-orange-50/30"></div>

      {/* Section Title */}
      <div className="text-center mb-16 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold text-stone-900 tracking-tight"
        >
          {t("stats.title")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-stone-600 text-lg mt-2 mb-3 font-medium"
        >
          {t("stats.subtitle")}
        </motion.p>
        <AnimatedSectionDivider />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto relative z-10">
        {stats.map((item, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className={`relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 flex flex-col items-center text-center group transform hover:-translate-y-2 border ${item.border}`}
          >
            {/* Glow Ring on Hover */}
            <div
              className={`absolute inset-0 rounded-2xl pointer-events-none ring-2 ring-transparent transition duration-500 ${item.ring}`}
            />
            {item.icon}
            <h3 className="text-5xl font-bold text-stone-900 my-4 tracking-tighter">
              <CountUp
                key={item.count}
                start={0}
                end={item.count || 0}
                duration={2.5}
                separator=","
              />
            </h3>
            <p className="text-stone-600 text-lg font-medium">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}