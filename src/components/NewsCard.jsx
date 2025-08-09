import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Color mapping for category badges
const categoryColors = {
  "E'lon": "bg-yellow-500",
  "Tadbir": "bg-purple-600",
  "Yangi": "bg-green-500",
  "Texnik": "bg-red-500",
  "Xizmat": "bg-blue-500",
  "Yangilik": "bg-gray-500",
};

export default function NewsCard({
  id,
  title,
  description,
  image,
  date,
  category = "Yangilik",
  admin = "Admin",
}) {
  const formattedDate = new Date(date).toLocaleDateString("uz-UZ");
  const badgeColor = categoryColors[category] || "bg-gray-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:ring-2 hover:ring-blue-100 transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />

        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow">
          {formattedDate}
        </div>

        {/* Category badge */}
        <div className={`absolute top-3 right-3 text-white text-xs px-3 py-1 rounded-full shadow ${badgeColor}`}>
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
          {title}
        </h3>

        <div className="w-14 h-0.5 bg-blue-300 group-hover:w-20 transition-all duration-300 mb-2" />

        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>

        {/* Admin tag */}
        <div className="text-xs text-gray-500 mt-3 italic">Posted by {admin}</div>

        {/* Link */}
        <Link
          to={`/news/${id}`}
          className="inline-flex items-center text-blue-600 text-sm font-medium mt-3 hover:text-blue-700 transition-colors"
        >
          Batafsil
          <svg
            className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
