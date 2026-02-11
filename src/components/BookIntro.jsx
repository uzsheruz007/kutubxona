import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Library, GraduationCap, Feather } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function BookIntro() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide component after animation completes (controlled by parent usually, but safe to self-manage visual exit)
    const timer = setTimeout(() => setIsVisible(false), 3800);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-[#2c1810] via-[#4a2c0f] to-[#1c1917] overflow-hidden"
      >
        {/* --- Background Atmosphere --- */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-overlay" />

          {/* Golden Glows */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-yellow-700/10 rounded-full blur-[180px] translate-x-1/2 translate-y-1/2" />
        </div>

        {/* --- Floating Symbols (Library Theme) --- */}
        <FloatingIcon Icon={Feather} delay={0} x="-30vw" y="-20vh" size={24} duration={6} />
        <FloatingIcon Icon={GraduationCap} delay={2} x="35vw" y="15vh" size={32} duration={7} />
        <FloatingIcon Icon={BookOpen} delay={4} x="-25vw" y="30vh" size={20} duration={5} />
        <FloatingIcon Icon={Library} delay={1} x="40vw" y="-30vh" size={28} duration={8} />

        {/* --- Main Content --- */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">

          {/* Animated Book Icon Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative mb-10"
          >
            {/* Outer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-8 border border-amber-500/30 rounded-full border-dashed"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-amber-300/20 rounded-full"
            />

            {/* Glowing Center */}
            <div className="relative w-28 h-28 bg-gradient-to-tr from-amber-700 to-yellow-600 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.4)] border border-amber-400/50">
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <BookOpen className="w-14 h-14 text-white drop-shadow-md" strokeWidth={1.5} />
              </motion.div>
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="space-y-3 relative">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-200 tracking-wide drop-shadow-sm"
            >
              {t("intro.brand", "SamDUUF")}
            </motion.h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
              className="h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-lg md:text-xl text-amber-100/80 font-serif italic tracking-wider"
            >
              {t("intro.subtitle", "Elektron Kutubxonasi")}
            </motion.p>
          </div>

          {/* Loading Progress */}
          <motion.div
            className="mt-12 w-48 h-1 bg-white/10 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{
                duration: 2.5,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function FloatingIcon({ Icon, delay, x, y, size, duration }) {
  return (
    <motion.div
      className="absolute text-amber-500/10"
      initial={{ opacity: 0, x, y }}
      animate={{
        opacity: [0, 0.4, 0],
        y: `calc(${y} - 100px)`,
        rotate: [0, 45, -45, 0]
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 2
      }}
    >
      <Icon size={size} />
    </motion.div>
  );
}