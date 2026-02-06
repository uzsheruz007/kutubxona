import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";

export default function PageHeader({ title, subtitle }) {
  const location = useLocation();

  // Extract path segments for breadcrumb
  const paths = location.pathname
    .split("/")
    .filter((p) => p !== "");

  return (
    <div className="relative pt-32 pb-12 px-6 md:px-12 text-center">
      {/* Background Atmosphere (Optional, same as NewsPage for consistency) */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-1/2 w-[500px] h-[300px] bg-amber-100/50 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Breadcrumb - Centered */}
      <div className="flex items-center justify-center gap-1 text-sm text-stone-500 mb-8">
        <Link to="/" className="flex items-center gap-1 hover:text-amber-600 transition-colors">
          <FiHome className="w-4 h-4" />
          <span>Bosh sahifa</span>
        </Link>
        {paths.map((segment, idx) => {
          const path = "/" + paths.slice(0, idx + 1).join("/");
          const isLast = idx === paths.length - 1;
          return (
            <span key={path} className="flex items-center gap-1">
              <span>/</span>
              {isLast ? (
                <span className="font-semibold text-stone-900 capitalize">
                  {decodeURIComponent(segment)}
                </span>
              ) : (
                <Link
                  to={path}
                  className="hover:text-amber-600 capitalize transition-colors"
                >
                  {decodeURIComponent(segment)}
                </Link>
              )}
            </span>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-amber-100 text-amber-700 font-medium text-sm mb-6 shadow-sm"
      >
        <span>Kutubxona Hayoti</span>
      </motion.div>

      {/* Title */}
      {title && (
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-stone-900 mb-6 tracking-tight max-w-4xl mx-auto leading-tight"
        >
          {title}
        </motion.h1>
      )}

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
