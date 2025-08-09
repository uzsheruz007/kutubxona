import { Book, Layers, Users, Sparkles } from "lucide-react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import AnimatedSectionDivider from "./AnimatedSectionDivider";

export default function LibraryStats() {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        type: "spring",
        stiffness: 120,
      },
    }),
  };

  const stats = [
    { 
      icon: <Book className="w-12 h-12 text-blue-500 group-hover:animate-bounce" />, 
      count: 5432, 
      label: "Jami kitoblar",
      border: "border-blue-500",
      ring: "group-hover:ring-blue-400/50",
    },
    { 
      icon: <Layers className="w-12 h-12 text-green-500 group-hover:animate-bounce" />, 
      count: 12, 
      label: "Kategoriya",
      border: "border-green-500",
      ring: "group-hover:ring-green-400/50",
    },
    { 
      icon: <Users className="w-12 h-12 text-purple-500 group-hover:animate-bounce" />, 
      count: 2345, 
      label: "Foydalanuvchilar",
      border: "border-purple-500",
      ring: "group-hover:ring-purple-400/50",
    },
    { 
      icon: <Sparkles className="w-12 h-12 text-yellow-500 group-hover:animate-bounce" />, 
      count: 123, 
      label: "Yangi kitoblar",
      border: "border-yellow-500",
      ring: "group-hover:ring-yellow-400/50",
    },
  ];

  return (
    <section id="stats" className="relative py-24 px-4 md:px-10 lg:px-20 bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden">
      {/* Floating Decorative Elements */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-gradient-to-tr from-cyan-300 to-blue-400 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tr from-purple-300 to-pink-400 rounded-full blur-3xl opacity-20 animate-ping" />

      {/* Section Title */}
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold text-gray-800"
        >
          Kutubxona Statistikasi
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-500 text-lg mt-2 mb-3"
        >
          Elektron kutubxonamiz haqida qisqacha ma'lumot
        </motion.p>
        <AnimatedSectionDivider />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {stats.map((item, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className={`relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 flex flex-col items-center text-center group transform hover:scale-105 border-2 ${item.border}`}
          >
            {/* Glow Ring on Hover */}
            <div
              className={`absolute inset-0 rounded-3xl pointer-events-none transition ${item.ring}`}
            />
            {item.icon}
            <h3 className="text-5xl font-bold text-gray-800 my-3">
              <CountUp end={item.count} duration={2.5} separator="," enableScrollSpy />
            </h3>
            <p className="text-gray-600 text-lg">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}