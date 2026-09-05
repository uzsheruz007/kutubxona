import { Search, CloudDownload, BookOpen, Globe, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function FeaturesSection() {
  const { t } = useTranslation();
  const features = [
    { icon: <Search size={22} />, title: t("features.fastSearch.title"), desc: t("features.fastSearch.desc") },
    { icon: <CloudDownload size={22} />, title: t("features.easyDownload.title"), desc: t("features.easyDownload.desc") },
    { icon: <BookOpen size={22} />, title: t("features.largeBase.title"), desc: t("features.largeBase.desc") },
    { icon: <Globe size={22} />, title: t("features.anywhere.title"), desc: t("features.anywhere.desc") },
    { icon: <Zap size={22} />, title: t("features.highSpeed.title"), desc: t("features.highSpeed.desc") },
    { icon: <Shield size={22} />, title: t("features.secureSystem.title"), desc: t("features.secureSystem.desc") },
  ];

  return (
    <section className="py-16 md:py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
          style={{ marginBottom: "var(--space-6)" }}
        >
          <span
            style={{
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
            }}
          >
            {t("features.badge")}
          </span>
          <h2 style={{ marginTop: "var(--space-2)" }}>
            {t("features.whyUsPart1")} {t("features.whyUsPart2")}
          </h2>
          <p className="text-muted" style={{ maxWidth: "56ch", margin: "0 auto" }}>
            {t("features.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              style={{ borderTop: "1px solid var(--color-divider)", paddingTop: "var(--space-4)" }}
            >
              <div style={{ color: "var(--color-accent)", marginBottom: "var(--space-2)" }}>{feature.icon}</div>
              <h4>{feature.title}</h4>
              <p className="text-muted" style={{ textAlign: "justify" }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
