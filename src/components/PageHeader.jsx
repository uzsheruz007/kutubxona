import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function PageHeader({ title, subtitle }) {
  const { t } = useTranslation();
  const location = useLocation();

  const segmentLabels = {
    books: t("navbar.books"),
    news: t("navbar.news"),
    book: t("navbar.books"),
    profile: t("navbar.profile"),
    login: t("navbar.login"),
    statistics: t("navbar.statistics"),
  };

  // Extract path segments for breadcrumb
  const paths = location.pathname
    .split("/")
    .filter((p) => p !== "");

  return (
    <div className="pt-16 pb-8 px-6 md:px-12 text-center">
      {/* Breadcrumb - Centered */}
      <div className="flex items-center justify-center gap-1 text-sm text-muted mb-4">
        <Link to="/" className="flex items-center gap-1 hover:text-[var(--color-accent)] transition-colors" style={{ color: "inherit" }}>
          <FiHome className="w-4 h-4" />
          <span>{t("navbar.home")}</span>
        </Link>
        {paths.map((segment, idx) => {
          const path = "/" + paths.slice(0, idx + 1).join("/");
          const isLast = idx === paths.length - 1;
          return (
            <span key={path} className="flex items-center gap-1">
              <span>/</span>
              {isLast ? (
                <span style={{ color: "var(--color-text)" }}>
                  {segmentLabels[segment.toLowerCase()] || decodeURIComponent(segment)}
                </span>
              ) : (
                <Link
                  to={path}
                  className="hover:text-[var(--color-accent)] transition-colors"
                  style={{ color: "inherit" }}
                >
                  {segmentLabels[segment.toLowerCase()] || decodeURIComponent(segment)}
                </Link>
              )}
            </span>
          );
        })}
      </div>

      {/* Title */}
      {title && (
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {title}
        </motion.h1>
      )}

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto text-muted"
        >
          {subtitle}
        </motion.p>
      )}

      <hr className="hr max-w-3xl mx-auto mt-6" />
    </div>
  );
}
