import { useState } from "react";
import { Book } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSectionDivider from "./AnimatedSectionDivider";

const books = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    author: "Kyle Simpson",
    description:
      "A deep dive into modern JavaScript concepts, including ES6+ features and best practices.",
    cover: "/images/image1.png",
  },
  {
    id: 2,
    title: "Python for Data Science",
    author: "Jake VanderPlas",
    description:
      "Learn how to analyze data using Python libraries like pandas, NumPy, and matplotlib.",
    cover: "/images/image2.png",
  },
  {
    id: 3,
    title: "Clean Code",
    author: "Robert C. Martin",
    description:
      "A handbook of agile software craftsmanship that emphasizes writing readable and maintainable code.",
    cover: "/images/image3.png",
  },
  {
    id: 4,
    title: "Artificial Intelligence",
    author: "Stuart Russell",
    description:
      "The most comprehensive textbook for understanding the foundations and techniques of AI.",
    cover: "/images/bookcover.png",
  },
  {
    id: 5,
    title: "Modern Web Development",
    author: "Adam Freeman",
    description:
      "Explore advanced frontend and backend techniques for full-stack web apps.",
    cover: "/images/image.png",
  },
  {
    id: 6,
    title: "Design Patterns",
    author: "Erich Gamma",
    description:
      "A classic book on software design patterns and principles that endure time.",
    cover: "/images/image1.png",
  },
];

export default function MostPopularBooks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeBook = books[activeIndex];

  return (
    <section className="bg-gradient-to-br from-white via-blue-50 to-white py-20 px-4 md:px-8 lg:px-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800 font-serif mb-4">
          Mashhur kitoblar
        </h2>
        <p className="text-gray-600 text-lg font-serif mb-3">
          Kutubxonadagi eng ko‘p o‘qilgan mashhur kitoblar
        </p>
        <AnimatedSectionDivider />
      </div>

      {/* Responsive Grid */}
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-10">
        
        {/* Book Details - Now narrower */}
        <div className="w-full lg:w-3/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBook.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-xl p-8 h-full flex flex-col justify-between"
            >
              <div className="flex flex-col lg:flex-row gap-8 items-start h-full">
                <img //400x600
                  src={activeBook.cover}
                  alt={activeBook.title}
                  className="w-48 md:w-56 rounded-md shadow-lg object-cover"
                />

                <div className="flex flex-col justify-between flex-1 h-full">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {activeBook.title}
                    </h3>
                    <p className="text-gray-600 mb-4 font-medium">
                      <span className="font-semibold">Muallif:</span> {activeBook.author}
                    </p>
                    <p className="text-gray-700 leading-relaxed line-clamp-4">
                      {activeBook.description}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium shadow transition">
                      Batafsil ko‘rish
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Book Tabs - Now wider */}
        <div className="w-full lg:w-2/5 grid grid-cols-3 sm:grid-cols-3 gap-4">
          {books.map((book, index) => (
            <button
              key={book.id}
              onClick={() => setActiveIndex(index)}
              className={`rounded-lg overflow-hidden transition border-3 ${
                activeIndex === index
                  ? "border-blue-600 ring-2 ring-blue-300"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <img // 240x360
                src={book.cover}
                alt={book.title}
                className="w-full cursor-pointer aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-110"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
