import { useState } from "react";
import { User, BookOpen } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function BookCard({
  title,
  author,
  coverUrl,
  id,
  category = "Kategoriya",
  description = "Izoh mavjud emas",
}) {
  const navigate = useNavigate();
  const fallbackCover = "/images/no-image.png";
  const validCoverUrl = coverUrl || fallbackCover;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleCardClick = (e) => {
    // Prevent navigation if clicking the existing inner Link (though unlikely to conflict if paths are same)
    if (e.target.closest('a')) return;
    navigate(`/book/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative w-full aspect-[3/4.2] perspective-[1500px] cursor-pointer my-8"
    >
      {/* --- Book Container (The moving part) --- */}
      <motion.div
        className="relative w-full h-full transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] transform-style-3d group-hover:-translate-x-4"
        initial={false}
        whileHover={{ rotateY: -35 }} // Opens the book partially
      >

        {/* --- FRONT COVER (The Image) --- */}
        <div
          className="absolute inset-0 bg-white rounded-r-xl rounded-l-sm shadow-2xl origin-left z-20 backface-hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Cover Spine Shadow */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-black/20 to-transparent z-30" />

          {/* Glossy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent z-40 pointer-events-none mix-blend-overlay" />

          {/* Image */}
          <div className="w-full h-full rounded-r-xl overflow-hidden bg-stone-100 relative">
            {!isImageLoaded && <div className="absolute inset-0 bg-stone-200 animate-pulse" />}
            <img
              src={validCoverUrl}
              alt={title}
              className="w-full h-full object-cover"
              onLoad={() => setIsImageLoaded(true)}
              onError={(e) => { e.target.src = fallbackCover; setIsImageLoaded(true); }}
            />

            {/* Category Badge on Cover */}
            <div className="absolute top-4 right-4 z-50">
              <span className="px-3 py-1 bg-white/90 backdrop-blur text-stone-900 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-md border-l-2 border-amber-600">
                {category}
              </span>
            </div>

            {/* Title on Cover (Bottom) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pt-12">
              <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md">{title}</h3>
              <p className="text-white/80 text-xs mt-1 font-medium">{author}</p>
            </div>
          </div>
        </div>

        {/* --- BOOK SPINE (Left Side) --- */}
        <div
          className="absolute top-1 bottom-1 left-0 w-8 bg-stone-900 origin-left transform -rotate-y-90 rounded-l-sm"
          style={{ transform: "rotateY(-90deg) translateX(-100%)" }}
        >
          <div className="w-full h-full bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        {/* --- INSIDE PAGES (Revealed on Open) --- */}
        <div
          className="absolute inset-y-2 left-1 right-2 bg-[#fdfbf7] rounded-r-md shadow-inner border-l border-stone-200 z-10 flex flex-col p-5 origin-left"
          style={{ transform: "translateZ(-2px)" }}
        >
          {/* Paper Texture */}
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none" />

          {/* Header */}
          <div className="text-center pb-3 border-b border-stone-200 mb-3 border-dashed">
            <span className="text-xs text-stone-400 font-serif uppercase tracking-widest">Annotatsiya</span>
          </div>

          {/* Description Text */}
          <p className="text-xs text-stone-700 leading-relaxed font-serif text-justify line-clamp-[8] opacity-90">
            {description || "Ushbu kitob haqida batafsil ma'lumot olish uchun 'O'qish' tugmasini bosing. Unda ko'plab qiziqarli faktlar va ma'lumotlar mavjud..."}
          </p>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Footer / Buttons */}
          <div className="mt-auto">
            <Link
              to={`/book/${id}`}
              className="group/btn w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-600 text-white text-xs font-bold uppercase tracking-wide hover:bg-amber-700 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <BookOpen size={14} />
              <span>O'qish</span>
            </Link>
          </div>

          {/* Page Curvature Shadow */}
          <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />
        </div>

        {/* --- PAGE LAYERS (Thickness) --- */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-y-3 right-0 w-px bg-stone-200"
            style={{ right: `${i * 2}px`, transform: "translateZ(-1px)" }}
          />
        ))}

      </motion.div>

      {/* Shadow underneath */}
      <div className="absolute bottom-0 left-2 right-2 h-4 bg-black/20 blur-xl rounded-[100%] group-hover:scale-x-110 transition-transform duration-700 delay-100" />
    </div>
  );
}
