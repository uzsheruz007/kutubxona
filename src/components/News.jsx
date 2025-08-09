import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import NewsCard from "./NewsCard";

const newsData = [
  {
    id: 1,
    title: "Elektron kutubxonamiz ishga tushirildi",
    description: "Endi barcha talabalar va o'qituvchilar online tarzda kitoblar o'qishi mumkin.",
    image: "/images/news/news1.png",
    date: "2025-07-05",
  },
  {
    id: 2,
    title: "Yangi kitoblar to'plami qo'shildi",
    description: "Falsafa va texnologiya sohalaridagi 200 dan ortiq yangi kitoblar mavjud.",
    image: "/images/news/news2.png",
    date: "2025-06-25",
  },
  {
    id: 3,
    title: "Kutubxonamizda o‘quvchilar uchun seminar",
    description: "Ertaga soat 15:00 da kutubxonada yangi o‘quvchilarga seminar bo‘lib o‘tadi.",
    image: "/images/news/news3.png",
    date: "2025-06-15",
  },
  {
    id: 4,
    title: "Yangi o‘quv yili uchun kutubxona yangiliklari",
    description: "Yangi o‘quv yilida foydalanuvchilarga qo‘shimcha xizmatlar taqdim etiladi.",
    image: "/images/news/news4.png",
    date: "2025-05-28",
  },
];

export default function NewsSection() {
  return (
    <section id="news" className="relative bg-gradient-to-b from-white via-blue-50 to-white py-20">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute w-72 h-72 bg-blue-100 rounded-full opacity-30 blur-3xl top-[-50px] left-[-50px] animate-pulse"></div>
        <div className="absolute w-56 h-56 bg-cyan-100 rounded-full opacity-20 blur-2xl bottom-[-40px] right-[-30px] animate-spin-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Yangiliklar
            </h2>
            <p className="text-gray-600">
              Kutubxonamizdagi so'nggi e'lonlar va yangiliklar bilan tanishing
            </p>
          </div>
          <Link
            to="/news"
            className="mt-4 md:mt-0 inline-block px-5 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
          >
            Barcha yangiliklar
          </Link>
        </motion.div>

        {/* News Carousel */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="pb-8"
        >
          {newsData.map((news) => (
            <SwiperSlide key={news.id}>
              <NewsCard {...news} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
