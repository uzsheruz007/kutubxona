import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, BookOpen, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import BookShowcase from "./BookShowcase"; // Original Component
import { API_BASE_URL } from "../config";

export default function HeroSection({ onScrollClick }) {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ totalBooks: 0, users: 0, online: "24/7" });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books/stats/`)
      .then(res => res.json())
      .then(data => {
        setStats({
          totalBooks: data.totalBooks,
          users: data.users,
          online: "24/7"
        });
      })
      .catch(err => console.error("Hero stats loading error:", err));
  }, []);

  return (
    <div className="relative min-h-screen flex items-center bg-stone-50 overflow-hidden pt-20 lg:pt-0">

      {/* 1. Background Blurs (Sand Theme Style) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-200/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#d6d3d1 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3 }}></div>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-amber-100 shadow-sm mt-16 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-sm font-medium text-stone-600 tracking-wide uppercase">
              {t("brand.slogan", "Bilimlar xazinasi")}
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-stone-900 leading-[1.1] tracking-tight mb-6">
            <span className="block">{t("hero.welcome_part1", "Kitob — bu")}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600">
              {t("hero.welcome_part2", "vaqt mashinasi.")}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            {t("hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/books"
              className="group px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-semibold shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2"
            >
              {t("hero.enterLibrary")}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="px-8 py-4 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
              <Search size={20} className="text-stone-400" />
              {t("hero.search")}
            </button>
          </div>

          {/* Stats / Trust Indicators */}
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 border-t border-stone-200 pt-8">
            <div>
              <p className="text-3xl font-bold text-stone-900">{stats.totalBooks}+</p>
              <p className="text-sm text-stone-500">{t("hero.books")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-stone-900">{stats.users}+</p>
              <p className="text-sm text-stone-500">{t("hero.users")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-stone-900">{stats.online}</p>
              <p className="text-sm text-stone-500">{t("hero.online")}</p>
            </div>
          </div>
        </motion.div>

        {/* Right: Book Showcase */}
        <motion.div
          id="books"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-orange-500/20 rounded-full blur-[80px] scale-90"></div>

          {/* The Book Showcase Component */}
          <BookShowcase />

          {/* Floating Elements Decor */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-5 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 hidden sm:block"
          >
            <BookOpen className="text-amber-600 w-8 h-8" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 -left-10 bg-white p-3 rounded-2xl shadow-xl border border-stone-100 hidden sm:block"
          >
            <Sparkles className="text-amber-500 w-6 h-6" />
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}