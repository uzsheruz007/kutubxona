import { motion } from "framer-motion";
import { FiArrowDownCircle } from "react-icons/fi";
import svgBook from '../assets/undraw_education_3vwh.svg';

export default function BookIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 relative overflow-hidden"
    >
      {/* Animated SVG or Lottie */}
      <motion.img
        src={svgBook}
        alt="Kutubxona Intro"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
        className="w-64 h-64 mb-8 drop-shadow-xl"
      />

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 bg-clip-text text-transparent drop-shadow"
      >
        SamDUUF Elektron Kutubxonasi
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        className="mt-4 text-lg md:text-xl text-gray-600 text-center max-w-xl"
      >
        Minglab kitoblar, ilmiy va badiiy asarlar, zamonaviy interfeys va tezkor qidiruv — barchasi siz uchun!
      </motion.p>

      {/* Animated Scroll Down Icon */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.7 }}
        className="mt-12"
      >
        <FiArrowDownCircle className="text-blue-500 animate-bounce" size={48} />
        <span className="block mt-2 text-blue-500 font-medium animate-pulse">Pastga suring</span>
      </motion.div>

      {/* Optional: Decorative shapes */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-200 rounded-full opacity-30 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-200 rounded-full opacity-20 blur-3xl pointer-events-none" />
    </motion.div>
  );
}