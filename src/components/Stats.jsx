import { Book, Layers, Users, Sparkles } from "lucide-react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
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
        setCounts(data);
      })
      .catch(err => console.error("Stats loading error:", err));
  }, []);

  const stats = [
    { icon: <Book size={22} />, count: counts.totalBooks, label: t("stats.totalBooks") },
    { icon: <Layers size={22} />, count: counts.categories, label: t("stats.categories") },
    { icon: <Users size={22} />, count: counts.users, label: t("stats.users") },
    { icon: <Sparkles size={22} />, count: counts.newBooks, label: t("stats.newBooks") },
  ];

  return (
    <section id="stats" className="py-16 md:py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center" style={{ marginBottom: "var(--space-6)" }}>
          <h2>{t("stats.title")}</h2>
          <p className="text-muted" style={{ maxWidth: "48ch", margin: "0 auto" }}>
            {t("stats.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center px-4 py-6"
              style={{ borderLeft: i === 0 ? "none" : "1px solid var(--color-divider)" }}
            >
              <div style={{ color: "var(--color-accent)", marginBottom: "var(--space-2)" }}>{item.icon}</div>
              <div
                className="num"
                style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 40, lineHeight: 1 }}
              >
                <CountUp key={item.count} start={0} end={item.count || 0} duration={2.5} separator="," />
              </div>
              <p className="text-muted" style={{ marginTop: "var(--space-2)", marginBottom: 0 }}>
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
