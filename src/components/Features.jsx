import { Search, CloudDownload, BookOpen, Globe, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function FeaturesSection() {
  const { t } = useTranslation();
  const features = [
    {
      icon: <Search size={28} />,
      title: t("features.fastSearch.title"),
      desc: t("features.fastSearch.desc"),
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: <CloudDownload size={28} />,
      title: t("features.easyDownload.title"),
      desc: t("features.easyDownload.desc"),
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: <BookOpen size={28} />,
      title: t("features.largeBase.title"),
      desc: t("features.largeBase.desc"),
      color: "text-stone-600",
      bg: "bg-stone-100",
    },
    {
      icon: <Globe size={28} />,
      title: t("features.anywhere.title"),
      desc: t("features.anywhere.desc"),
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      icon: <Zap size={28} />,
      title: t("features.highSpeed.title"),
      desc: t("features.highSpeed.desc"),
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: <Shield size={28} />,
      title: t("features.secureSystem.title"),
      desc: t("features.secureSystem.desc"),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <span className="text-amber-600 font-semibold tracking-wide uppercase text-sm mb-3">
              {t("features.badge")}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-stone-900 tracking-tight mb-6">
              {t("features.whyUsPart1")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">{t("features.whyUsPart2")}</span>
            </h2>
            <p className="text-stone-500 text-lg max-w-2xl leading-relaxed">
              {t("features.description")}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:bg-white hover:shadow-xl hover:shadow-amber-100 transition-all duration-300"
            >
              <div className={`w-14 h-14 mb-6 flex items-center justify-center rounded-2xl ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-amber-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-stone-500 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
