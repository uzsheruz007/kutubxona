import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

// Premium Color Palettes (Soft & Vivid)
// Sand Theme Color Palette (Warm & Earthy)
const categoryColors = {
  "E'lon": "from-amber-500 to-orange-600",
  "Tadbir": "from-stone-500 to-stone-700",
  "Yangi": "from-yellow-500 to-amber-600",
  "Texnik": "from-orange-500 to-red-500",
  "Xizmat": "from-stone-400 to-stone-600",
  "Yangilik": "from-stone-500 to-warm-gray-600",
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
  const { t, i18n } = useTranslation();

  // Date formatting options
  const dateOptions = { day: "numeric", month: "long", year: "numeric" };
  // Map supported locales to formatting (uz, ru, en)
  const localeMap = {
    uz: "uz-UZ",
    ru: "ru-RU",
    en: "en-US"
  };
  const currentLocale = localeMap[i18n.language] || "uz-UZ";
  const formattedDate = new Date(date).toLocaleDateString(currentLocale, dateOptions);

  // Map backend category names to translation keys
  const getCategoryKey = (cat) => {
    const map = {
      "Yangilik": "news",
      "E'lon": "announcement",
      "Tadbir": "event",
      "Yangi": "new",
      "Texnik": "technical",
      "Xizmat": "service",
      // Fallbacks for known keys if backend returns lower or different casing
      "yangilik": "news",
      "e'lon": "announcement",
      "tadbir": "event",
      "yangi": "new",
      "texnik": "technical",
      "xizmat": "service"
    };
    return map[cat] || "news";
  };

  const gradientColor = categoryColors[category] || categoryColors["Yangilik"];

  // --- 3D Tilt Logic ---
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 20 });
  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(yPct * -10); // Rotate X based on Y movement
    y.set(xPct * 10);  // Rotate Y based on X movement
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      style={{ transformStyle: "preserve-3d", transform }}
      className="group relative w-full rounded-2xl bg-stone-50/90 backdrop-blur-xl border border-stone-200/60 shadow-xl isolate overflow-visible cursor-pointer"
    >
      {/* --- Dynamic Glow Behind --- */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${gradientColor} rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition duration-500 -z-10`}
      />

      {/* --- Card Structure --- */}
      <div className="relative h-full flex flex-col rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm" style={{ transform: "translateZ(0px)" }}>

        {/* Image Section */}
        <div className="relative aspect-[16/9] w-full overflow-hidden shrink-0">
          <motion.img
            src={image || "https://placehold.co/600x400/d6d3d1/57534e?text=No+Image"}
            alt={title}
            className="w-full h-full object-cover"
            style={{ scale: 1.1 }}
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.6 }}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />

          {/* Badges (Floating in 3D) */}
          <div className="absolute top-4 left-4 flex gap-2" style={{ transform: "translateZ(30px)" }}>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-lg bg-gradient-to-r ${gradientColor}`}>
              {t(`news.categories.${getCategoryKey(category)}`, category)}
            </span>
          </div>

          <div className="absolute top-4 right-4" style={{ transform: "translateZ(20px)" }}>
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80">
              <Sparkles size={14} />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow relative">

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-3">
            <Calendar size={14} className="text-amber-600" />
            {formattedDate}
          </div>

          {/* Title - Fixed Height Area */}
          <div className="h-[3.5rem] mb-2 overflow-hidden">
            <h3
              className="text-lg font-bold text-stone-900 leading-tight line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-orange-600 transition-all duration-300"
              style={{ transform: "translateZ(20px)" }}
            >
              {title}
            </h3>
          </div>

          {/* Description - Fixed Height Area (HTML Content) */}
          <div className="h-[4.5rem] mb-4 overflow-hidden relative">
            <div
              className="text-sm text-stone-600 leading-relaxed line-clamp-3 prose prose-sm max-w-none prose-stone prose-p:my-0"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            {/* Fade effect at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-stone-50/90 to-transparent" />
          </div>

          {/* Spacer to push footer down if content is short */}
          <div className="flex-grow" />

          {/* Footer / Admin & Button */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-200/60">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-stone-100 text-stone-400">
                <User size={12} />
              </div>
              <span className="text-xs text-stone-500 font-medium">{t("news.postedBy")} {admin}</span>
            </div>

            <Link
              to={`/news/${id}`}
              className={`group/btn relative inline-flex items-center gap-1.5 text-sm font-bold bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent hover:pr-2 transition-all duration-300`}
            >
              {t("news.readMore")}
              <ArrowRight size={16} className={`text-stone-400 group-hover/btn:text-amber-600 group-hover/btn:translate-x-1 transition-colors transition-transform`} />
            </Link>
          </div>
        </div>

        {/* Shine/Glare Effect on Hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 55%, transparent 60%)",
            backgroundSize: "200% 100%",
            mixBlendMode: "overlay",
          }}
        />

      </div>
    </motion.div>
  );
}