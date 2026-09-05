import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Heart, BookOpen } from "lucide-react";
import { FaTelegram, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import QRCode from "react-qr-code";
import { useUser } from "../context/UserContext";
import { API_BASE_URL } from "../config";

import { useTranslation } from "react-i18next";

export default function BookDetails() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useUser(); // Need setUser to update favourites list locally
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (user && user.favourites && book) {
      setIsFavorited(user.favourites.some(fav => fav.id === book.id));
    }
  }, [user, book]);

  const toggleFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/api/accounts/favorites/${book.id}/`, {}, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` } // Assuming token is in localStorage
      });

      setIsFavorited(response.data.liked);

      // Update User Context to reflect changes immediately in Profile
      if (response.data.favourites) {
        setUser(prevUser => ({
          ...prevUser,
          favourites: response.data.favourites
        }));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleDownload = () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
    } else {
      alert("Hali yuklab olish ishlamaydi!");
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/api/books/${id}/`, {
          headers: {
            "Accept-Language": i18n.language
          }
        }
        );
        setBook(res.data);
      } catch {
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, i18n.language]);

  const currentUrl = window.location.href;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: "var(--color-accent)" }}></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p style={{ color: "color-mix(in srgb, var(--color-text) 55%, transparent)" }} className="mb-4">Kitob topilmadi.</p>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          {t("back")}
        </button>
      </div>
    );
  }

  const coverUrl = book.cover_image
    ? (book.cover_image.startsWith('http') ? book.cover_image : `${API_BASE_URL}${book.cover_image}`)
    : "/images/image.png";

  return (
    <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm" style={{ color: "color-mix(in srgb, var(--color-text) 55%, transparent)" }}>
        <Link to="/" style={{ color: "inherit" }}>{t("navbar.home")}</Link>
        <span>/</span>
        <Link to="/books" style={{ color: "inherit" }}>{t("navbar.books")}</Link>
        <span>/</span>
        <span style={{ color: "var(--color-text)" }}>{book.title}</span>
      </div>
      <hr className="hr" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8"
      >
        {/* Left: cover + actions */}
        <div>
          <div
            className="plate"
            style={{
              width: "100%",
              aspectRatio: "2 / 3",
              backgroundColor: "var(--color-neutral-100)",
              overflow: "hidden",
            }}
          >
            <img src={coverUrl} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <div className="flex flex-col gap-2" style={{ marginTop: "var(--space-4)" }}>
            <button
              onClick={() => {
                if (user) {
                  if (book.file) {
                    const fileUrl = book.file.startsWith('http') ? book.file : `${API_BASE_URL}${book.file}`;
                    window.open(fileUrl, '_blank');
                  } else {
                    alert("Fayl yuklanmagan");
                  }
                } else {
                  handleDownload();
                }
              }}
              className="btn btn-primary btn-block"
            >
              <BookOpen size={16} /> {user ? t("download") : t("loginAndDownload")}
            </button>
            <button onClick={toggleFavorite} className="btn btn-ghost btn-block">
              <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
              {isFavorited ? "Sevimlilardan o'chirish" : t("addToFavorites")}
            </button>
          </div>
        </div>

        {/* Right: info */}
        <div>
          <span className="tag tag-outline">{book.category || t("resourceType")}</span>
          <h1 style={{ fontWeight: 400, margin: "var(--space-3) 0 var(--space-1)" }}>{book.title}</h1>
          <p style={{ fontStyle: "italic", fontSize: 17, color: "color-mix(in srgb, var(--color-text) 60%, transparent)" }}>
            {book.author || t("unknown")}
          </p>

          <table className="table" style={{ marginTop: "var(--space-4)" }}>
            <tbody>
              <tr>
                <th style={{ width: 190 }}>{t("author")}</th>
                <td>{book.author || t("unknown")}</td>
              </tr>
              <tr>
                <th>{t("resourceType")}</th>
                <td>{book.resource_type || "Kitob"}</td>
              </tr>
              <tr>
                <th>{t("pageCount")}</th>
                <td className="num">{book.page_count} {t("pages")}</td>
              </tr>
              <tr>
                <th>{t("publishedDate")}</th>
                <td className="num">{book.published_date || t("unknown")}</td>
              </tr>
              <tr>
                <th>{t("subjects")}</th>
                <td>{book.subjects || t("noSubjects")}</td>
              </tr>
            </tbody>
          </table>

          <h4 style={{ margin: "var(--space-6) 0 var(--space-2)" }}>{t("aboutBook")}</h4>
          <div
            style={{ columns: "2", columnGap: "var(--space-8)", textAlign: "justify", hyphens: "auto" }}
            dangerouslySetInnerHTML={{ __html: book.description || t("noDescription") }}
          />
        </div>
      </motion.div>

      {/* Sidebar-style extras below on mobile / beside description area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" style={{ marginTop: "var(--space-8)" }}>
        <div style={{ border: "1px solid var(--color-divider)", borderRadius: "var(--radius-md)", padding: "var(--space-4)" }} className="flex flex-col items-center text-center">
          <div style={{ border: "1px solid var(--color-divider)", padding: "var(--space-2)" }}>
            {book.qr_code ? (
              <img
                src={book.qr_code.startsWith('http') ? book.qr_code : `${API_BASE_URL}${book.qr_code}`}
                alt="QR Code"
                style={{ width: 140, height: 140, objectFit: "contain" }}
              />
            ) : (
              <QRCode value={currentUrl} size={140} fgColor="#201f1d" />
            )}
          </div>
          <div className="flex gap-4 justify-center" style={{ marginTop: "var(--space-4)" }}>
            <a href="https://t.me/samdu_urgut_filial" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)" }}>
              <FaTelegram size={18} />
            </a>
            <a href="https://www.instagram.com/samduuf_edu?igsh=MWF5bWhvZ3ZhbTI5ZA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)" }}>
              <FaInstagram size={18} />
            </a>
            <a href="https://www.facebook.com/samduufeduuz" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)" }}>
              <FaFacebook size={18} />
            </a>
            <a href="https://www.youtube.com/@samduufeducation7037" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)" }}>
              <FaYoutube size={18} />
            </a>
          </div>
        </div>

        <div style={{ border: "1px solid var(--color-divider)", borderRadius: "var(--radius-md)", padding: "var(--space-4)" }}>
          <h5 style={{ marginBottom: "var(--space-2)" }}>{t("eLibrary")}</h5>
          <hr className="hr" style={{ margin: "0 0 var(--space-2)" }} />
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
            {[t("textbooks"), t("monographs"), t("dissertations")].map((text, idx) => (
              <li key={idx} style={{ padding: "var(--space-1) 0", fontSize: 14 }}>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
