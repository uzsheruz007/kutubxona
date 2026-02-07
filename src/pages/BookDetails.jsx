import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiArrowLeft, FiHeart, FiShare2, FiBookOpen, FiFacebook, FiTwitter, FiInstagram, FiYoutube } from "react-icons/fi";
import QRCode from "react-qr-code";
import PageHeader from "../components/PageHeader";
import { useUser } from "../context/UserContext";
import i18n from "../i18n";
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
      } catch (err) {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-xl text-stone-500 mb-4">Kitob topilmadi.</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded shadow hover:bg-amber-700 transition"
        >
          <FiArrowLeft /> Orqaga
        </button>
      </div>
    );
  }

  const coverUrl = book.cover_image
    ? (book.cover_image.startsWith('http') ? book.cover_image : `${API_BASE_URL}${book.cover_image}`)
    : "/images/image.png";

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden font-sans">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px] -translate-x-1/2"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="relative z-10">
        <PageHeader title="" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-7xl mx-auto px-4 py-12 space-y-6"
        >

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center cursor-pointer gap-2 mb-4 px-4 py-2 bg-amber-50 text-amber-700 rounded hover:bg-amber-100 transition border border-amber-100 shadow-sm font-medium"
          >
            <FiArrowLeft /> {t("back")}
          </button>

          {/* Main layout: Content + Sidebar */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Cover + Info */}
              <div className="flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow-xl p-8 border border-stone-100">
                {/* Left: Book Cover */}
                <div className="flex flex-col items-center md:items-start shrink-0">
                  <motion.div
                    className="relative rounded-lg shadow-2xl border border-stone-200 overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <img
                      src={coverUrl}
                      alt={book.title}
                      className="w-64 h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none"></div>
                  </motion.div>

                  <button
                    onClick={() => {
                      if (user) {
                        if (book.file) {
                          const fileUrl = book.file.startsWith('http') ? book.file : `${API_BASE_URL}${book.file}`;
                          window.open(fileUrl, '_blank');
                        }
                        else alert("Fayl yuklanmagan");
                      } else {
                        handleDownload();
                      }
                    }}
                    className="w-full mt-6 cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 shadow-lg hover:shadow-amber-200 transition font-bold tracking-wide">
                    <FiBookOpen /> {user ? t("download") : t("loginAndDownload")}
                  </button>
                </div>

                {/* Right: Book Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-6 leading-tight">
                      {book.title}
                    </h1>
                    <div className="space-y-3 text-lg">
                      <p className="text-stone-700 flex flex-wrap gap-2">
                        <span className="font-semibold text-stone-900 min-w-[140px]">{t("author")}:</span>
                        <span className="text-stone-800">{book.author || t("unknown")}</span>
                      </p>
                      <p className="text-stone-700 flex flex-wrap gap-2">
                        <span className="font-semibold text-stone-900 min-w-[140px]">{t("resourceType")}:</span>
                        <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-sm font-medium">{book.resource_type || "Kitob"}</span>
                      </p>
                      <p className="text-stone-700 flex flex-wrap gap-2">
                        <span className="font-semibold text-stone-900 min-w-[140px]">{t("pageCount")}:</span>
                        <span>{book.page_count} {t("pages")}</span>
                      </p>
                      <p className="text-stone-700 flex flex-wrap gap-2">
                        <span className="font-semibold text-stone-900 min-w-[140px]">{t("publishedDate")}:</span>
                        <span>{book.published_date || t("unknown")}</span>
                      </p>
                      <p className="text-stone-700 flex flex-wrap gap-2">
                        <span className="font-semibold text-stone-900 min-w-[140px]">{t("subjects")}:</span>
                        <span className="text-stone-600 italic">
                          {book.subjects || t("noSubjects")}
                        </span>
                      </p>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-stone-100">
                    <button
                      onClick={toggleFavorite}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition font-medium border ${isFavorited
                        ? "bg-red-50 text-red-600 border-red-200"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                        }`}
                    >
                      <FiHeart className={isFavorited ? "fill-current" : ""} />
                      {isFavorited ? "Sevimlilardan o'chirish" : t("addToFavorites")}
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition font-medium">
                      <FiShare2 /> {t("share")}
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-stone-100">
                <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <FiBookOpen className="text-amber-600" /> {t("aboutBook")}
                </h2>
                <div className="prose prose-stone max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: book.description || t("noDescription") }} />
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-6 lg:w-[300px] shrink-0">
              {/* QR Code Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center border border-stone-100">
                <div className="bg-stone-50 p-4 rounded-xl mb-6 flex justify-center">
                  {book.qr_code ? (
                    <img
                      src={book.qr_code.startsWith('http') ? book.qr_code : `${API_BASE_URL}${book.qr_code}`}
                      alt="QR Code"
                      className="w-[140px] h-[140px] object-contain mix-blend-multiply"
                    />
                  ) : (
                    <QRCode value={currentUrl} size={140} fgColor="#44403c" />
                  )}
                </div>
                {/* Social Icons (Keeping static for now or can verify later) */}
                <div className="flex gap-3 justify-center">
                  {/* ... icons ... */}
                  <a href="#" className="p-3 rounded-full bg-stone-50 text-stone-500 hover:bg-amber-600 hover:text-white shadow-sm hover:shadow-md transition-all duration-300"><FiFacebook className="w-5 h-5" /></a>
                  <a href="#" className="p-3 rounded-full bg-stone-50 text-stone-500 hover:bg-amber-400 hover:text-white shadow-sm hover:shadow-md transition-all duration-300"><FiTwitter className="w-5 h-5" /></a>
                  <a href="#" className="p-3 rounded-full bg-stone-50 text-stone-500 hover:bg-gradient-to-tr hover:from-orange-500 hover:to-amber-500 hover:text-white shadow-sm hover:shadow-md transition-all duration-300"><FiInstagram className="w-5 h-5" /></a>
                  <a href="#" className="p-3 rounded-full bg-stone-50 text-stone-500 hover:bg-red-600 hover:text-white shadow-sm hover:shadow-md transition-all duration-300"><FiYoutube className="w-5 h-5" /></a>
                </div>
              </div>

              {/* Elektron Kutubxona Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-stone-100">
                <h3 className="text-lg font-bold text-stone-900 mb-4 border-b border-stone-100 pb-2">
                  {t("eLibrary")}
                </h3>
                <ul className="space-y-2">
                  {[t("textbooks"), t("monographs"), t("dissertations")].map((text, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 px-4 py-3 bg-stone-50 rounded-lg hover:bg-amber-50 hover:text-amber-700 cursor-pointer transition font-medium text-stone-700 group"
                    >
                      <span className="text-amber-500 group-hover:scale-110 transition-transform">📘</span> {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
