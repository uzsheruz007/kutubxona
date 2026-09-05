import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BookOpen, Download, Clock } from "lucide-react";
import { API_BASE_URL } from "../config";
import BookCard from "./BookCard";

export default function MostPopularBooks() {
  const { t, i18n } = useTranslation();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books/popular/`, {
      headers: {
        "Accept-Language": i18n.language
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const formattedBooks = data.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            category: book.category,
            createdAt: book.created_at,
            coverUrl: book.cover_image || "/images/image.png"
          }));
          setBooks(formattedBooks);
        }
      })
      .catch(err => console.error("Popular books loading error:", err));
  }, [t, i18n.language]);

  if (books.length === 0) return null;

  const newArrivals = [...books].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const categoryLabel = (cat) => t(`categories.${(cat || "").toLowerCase()}`, cat);
  const dateLabel = (d) => {
    if (!d) return "";
    const localeMap = { uz: "uz-UZ", ru: "ru-RU", en: "en-US" };
    return new Date(d).toLocaleDateString(localeMap[i18n.language] || "uz-UZ", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <section id="popular-books" className="py-16 md:py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>{t("popularBooks.title")}</h2>
          <p className="text-muted">{t("popularBooks.subtitle")}</p>

          <table className="table" style={{ marginTop: "var(--space-4)" }}>
            <thead>
              <tr>
                <th style={{ width: 36 }}>№</th>
                <th>{t("navbar.books")}</th>
                <th>{t("author")}</th>
                <th>{t("categoriesLabel")}</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, i) => (
                <tr key={book.id}>
                  <td className="num text-muted">{i + 1}</td>
                  <td>
                    <Link to={`/book/${book.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {book.title}
                    </Link>
                  </td>
                  <td className="text-muted" style={{ fontStyle: "italic" }}>{book.author}</td>
                  <td>
                    <span className="tag tag-outline">{categoryLabel(book.category)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2>{t("newArrivals.title")}</h2>
          <p className="text-muted">{t("newArrivals.subtitle")}</p>

          <div className="flex flex-col gap-3" style={{ marginTop: "var(--space-4)" }}>
            {newArrivals.slice(0, 5).map((book) => (
              <BookCard
                key={book.id}
                variant="row"
                id={book.id}
                title={book.title}
                author={book.author}
                coverUrl={book.coverUrl}
                category={categoryLabel(book.category)}
                meta={dateLabel(book.createdAt)}
              />
            ))}
          </div>

          <h4 style={{ marginTop: "var(--space-6)", marginBottom: "var(--space-2)" }}>{t("services.title")}</h4>
          <div className="flex flex-col gap-2" style={{ fontSize: 13 }}>
            <div className="flex items-center gap-2">
              <BookOpen size={15} color="var(--color-accent)" />
              {t("services.onlineRead")}
            </div>
            <div className="flex items-center gap-2">
              <Download size={15} color="var(--color-accent)" />
              {t("services.pdfDownload")}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} color="var(--color-accent)" />
              {t("services.studyRoom")}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
