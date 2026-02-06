import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BookIntro() {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1c1917] overflow-hidden"
      >
        {/* --- Background Atmosphere --- */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial Gradient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-900/20 rounded-full blur-[120px]" />

          {/* Noise Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

          {/* Floating Dust Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-amber-200/30 rounded-full"
              style={{
                width: Math.random() * 3 + 1 + "px",
                height: Math.random() * 3 + 1 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* --- Central Portal Content --- */}
        <div className="relative z-10 flex flex-col items-center text-center">

          {/* Glowing Icon Container */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.5 }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-amber-500/30 blur-xl rounded-full animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl flex items-center justify-center shadow-2xl border border-amber-500/20">
              <BookOpen className="w-12 h-12 text-amber-50" strokeWidth={1.5} />
            </div>

            {/* Sparkles */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4"
            >
              <Sparkles className="w-8 h-8 text-amber-300 drop-shadow-lg" />
            </motion.div>
          </motion.div>

          {/* Typography Reveal */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-50 to-amber-200 tracking-tight drop-shadow-sm">
              <TypingEffect text={t("intro.brand", "SamDUUF")} delay={0.5} />
            </h1>
            <h2 className="text-xl md:text-3xl font-light text-stone-400 tracking-widest uppercase">
              <TypingEffect text={t("intro.subtitle", "Elektron Kutubxonasi")} delay={1.2} speed={0.05} />
            </h2>
          </div>

          {/* Loading Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 2.5, ease: "easeInOut" }}
            className="absolute -bottom-24 w-64 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper for typing effect
function TypingEffect({ text, delay = 0, speed = 0.1 }) {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: speed, delayChildren: delay }
    })
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      style={{ display: "inline-block" }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index} style={{ display: "inline-block", minWidth: letter === " " ? "0.5em" : "auto" }}>
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
}