import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../config";
import BookCard from "./BookCard";

export default function FeaturedBooks() {
  const { t, i18n } = useTranslation();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books/`, {
      headers: { "Accept-Language": i18n.language },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.results || [];
        setBooks(
          list.slice(0, 4).map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            coverUrl: book.cover_image || "/images/image.png",
          }))
        );
      })
      .catch((err) => console.error("Featured books loading error:", err));
  }, [i18n.language]);

  if (books.length === 0) return null;

  return (
    <section className="py-16 md:py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-baseline justify-between">
            <h2>{t("featuredBooks.title")}</h2>
            <Link to="/books" className="btn btn-ghost">
              {t("featuredBooks.viewAll")} →
            </Link>
          </div>

          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", marginTop: "var(--space-4)" }}
          >
            {books.map((book) => (
              <BookCard key={book.id} variant="grid" {...book} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
