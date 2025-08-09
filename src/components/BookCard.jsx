import { useState } from "react";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

export default function BookCard({
  title,
  author,
  coverUrl,
  id,
  category = "Kategoriya",
  description = "Izoh mavjud emas",
}) {
  const fallbackCover = "/images/no-image.png";
  const validCoverUrl = coverUrl || fallbackCover;

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer relative">
      {/* Book Image with Shimmer */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
        {/* Shimmer Effect */}
        {!isImageLoaded && (
          <div
            className="absolute inset-0 bg-gray-200 overflow-hidden"
            style={{
              background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          />
        )}

        <img
          src={validCoverUrl}
          alt={title}
          className={`w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => {
            e.target.src = fallbackCover;
            setIsImageLoaded(true);
          }}
        />

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/90 text-gray-800 text-xs font-medium rounded-full shadow">
            {category}
          </span>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors h-[60px]">
          {title}
        </h3>

        {/* Author */}
        <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
          <User size={14} className="text-blue-400" />
          {author || "Noma'lum"}
        </p>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
          {description}
        </p>

        {/* Details Link */}
        <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
          <Link
            to={`/book/${id}`}
            className="flex items-center gap-1"
          >
            <span>Batafsil</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Inline Shimmer Animation */}
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      </style>
    </div>
  );
}
