import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../config";

// A quiet, static fan of book covers — three plates set at gentle offsetting
// angles over a soft accent-tinted backdrop. No animation library, no flip
// mechanics: the only motion is a small hover lift.
const STACK_LAYOUT = [
  { rotate: -7, x: -78, y: 14, z: 1, w: 148 },
  { rotate: 4, x: 68, y: 26, z: 2, w: 148 },
  { rotate: -1, x: -4, y: -10, z: 3, w: 172 },
];

// Shown whenever the catalog has no cover image for a slot (empty library,
// or a book missing artwork) — a typographic plate instead of a broken image.
const FALLBACK_BOOKS = [
  { title: "O'tkan kunlar", author: "Abdulla Qodiriy" },
  { title: "Kecha va kunduz", author: "Cho'lpon" },
  { title: "Ulug'bek xazinasi", author: "Odil Yoqubov" },
];

function PlaceholderCover({ title, author }) {
  return (
    <div
      style={{
        width: "100%", height: "100%", boxSizing: "border-box",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: 12, textAlign: "center", alignItems: "center",
      }}
    >
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 13, lineHeight: 1.2 }}>
        {title}
      </div>
      {author && (
        <div className="text-muted" style={{ fontSize: 10, fontStyle: "italic", marginTop: 2 }}>
          {author}
        </div>
      )}
    </div>
  );
}

function CoverImage({ book }) {
  const [failed, setFailed] = useState(false);
  if (!book.coverUrl || failed) {
    return <PlaceholderCover title={book.title} author={book.author} />;
  }
  return (
    <img
      src={book.coverUrl}
      alt={book.title}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      onError={() => setFailed(true)}
    />
  );
}

function FeaturedStack() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books/`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.results || [];
        setBooks(
          list.slice(0, 3).map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            coverUrl: book.cover_image || null,
          }))
        );
      })
      .catch((err) => console.error("Hero books loading error:", err));
  }, []);

  const displayBooks = books.length ? books : FALLBACK_BOOKS;

  return (
    <div style={{ position: "relative", width: 380, maxWidth: "100%", height: 320 }}>
      <style>{`.hero-stack-card:hover { transform: translate(-50%, -50%) rotate(0deg) scale(1.04) !important; z-index: 5 !important; }`}</style>
      <span
        aria-hidden="true"
        style={{
          position: "absolute", inset: "8% 12%", borderRadius: "50%",
          background: "var(--color-accent-100)", opacity: 0.6, filter: "blur(2px)",
        }}
      />
      {displayBooks.map((book, i) => {
        const layout = STACK_LAYOUT[i];
        return (
          <div
            key={book.id ?? book.title}
            className="hero-stack-card"
            style={{
              position: "absolute",
              left: `calc(50% + ${layout.x}px)`,
              top: `calc(50% + ${layout.y}px)`,
              transform: `translate(-50%, -50%) rotate(${layout.rotate}deg)`,
              zIndex: layout.z,
              width: layout.w,
              transition: "transform 0.3s ease",
            }}
          >
            <div
              className="plate"
              style={{
                width: "100%", aspectRatio: "2 / 3",
                background: "var(--color-neutral-200)",
                boxShadow: "0 14px 28px color-mix(in srgb, var(--color-neutral-900) 22%, transparent)",
                overflow: "hidden",
              }}
            >
              <CoverImage book={book} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HeroSection({ onScrollClick }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [stats, setStats] = useState({ totalBooks: 0, users: 0, online: "24/7" });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books/stats/`)
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalBooks: data.totalBooks,
          users: data.users,
          online: "24/7",
        });
      })
      .catch((err) => console.error("Hero stats loading error:", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/books?search=${encodeURIComponent(query.trim())}` : "/books");
  };

  return (
    <section className="pt-28 pb-16 lg:pt-36 lg:pb-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3" style={{ marginBottom: "var(--space-4)" }}>
            <span style={{ width: 32, height: 1, background: "var(--color-accent)" }} />
            <span
              style={{
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
              }}
            >
              {t("hero.slogan")}
            </span>
          </div>

          <h1 style={{ maxWidth: "16ch" }}>
            {t("hero.welcome_part1")} {t("hero.welcome_part2")}
          </h1>

          <p style={{ maxWidth: "52ch", textAlign: "justify", fontSize: 16, marginTop: "var(--space-3)" }}>
            {t("hero.description")}
          </p>

          <form onSubmit={handleSearch} className="flex gap-2" style={{ maxWidth: 440, marginTop: "var(--space-4)" }}>
            <input
              type="text"
              className="input"
              placeholder={t("searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
              <Search size={16} />
              {t("hero.search")}
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3" style={{ marginTop: "var(--space-3)" }}>
            <Link to="/books" className="btn btn-primary">
              {t("hero.enterLibrary")}
              <ArrowRight size={16} />
            </Link>
            <a
              href="https://kbt.samduuf.uz/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Kitob buyurtma berish
              <ArrowRight size={16} />
            </a>
          </div>

          <button
            type="button"
            onClick={onScrollClick}
            className="btn btn-ghost"
            style={{ marginTop: "var(--space-3)" }}
          >
            {t("hero.viewBooks")}
            <ChevronDown size={14} />
          </button>

          <hr className="hr" style={{ marginTop: "var(--space-6)", marginBottom: "var(--space-4)" }} />

          <div className="flex items-center" style={{ gap: "var(--space-6)" }}>
            <div style={{ paddingRight: "var(--space-6)", borderRight: "1px solid var(--color-divider)" }}>
              <div className="num" style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 28 }}>
                {stats.totalBooks}+
              </div>
              <div className="text-muted" style={{ fontSize: 12 }}>{t("hero.books")}</div>
            </div>
            <div style={{ paddingRight: "var(--space-6)", borderRight: "1px solid var(--color-divider)" }}>
              <div className="num" style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 28 }}>
                {stats.users}+
              </div>
              <div className="text-muted" style={{ fontSize: 12 }}>{t("hero.users")}</div>
            </div>
            <div>
              <div className="num" style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 28 }}>
                {stats.online}
              </div>
              <div className="text-muted" style={{ fontSize: 12 }}>{t("hero.online")}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="hidden lg:flex justify-center"
        >
          <FeaturedStack />
        </motion.div>
      </div>
    </section>
  );
}
