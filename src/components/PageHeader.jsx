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
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative py-16 px-6 md:px-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-b-3xl shadow-lg text-white"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-white/80 mb-3">
        <Link to="/" className="flex items-center gap-1 hover:underline">
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
                <span className="font-semibold text-white">
                  {decodeURIComponent(segment)}
                </span>
              ) : (
                <Link
                  to={path}
                  className="hover:underline capitalize"
                >
                  {decodeURIComponent(segment)}
                </Link>
              )}
            </span>
          );
        })}
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-sm">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-lg md:text-xl mt-3 opacity-90">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
