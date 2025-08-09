import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiArrowLeft, FiHeart, FiShare2, FiBookOpen, FiFacebook, FiTwitter, FiInstagram, FiYoutube } from "react-icons/fi";
import QRCode from "react-qr-code";
import PageHeader from "../components/PageHeader";
import { useUser } from "../context/UserContext";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

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
          `https://corsproxy.io/?https://openlibrary.org/works/${id}.json`
        );
        setBook(res.data);
      } catch (err) {
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const currentUrl = window.location.href;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-xl text-gray-500 mb-4">Kitob topilmadi.</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          <FiArrowLeft /> Orqaga
        </button>
      </div>
    );
  }

  const coverId = book.covers?.[0];
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : "/images/image.png";

  return (
    <>
      <PageHeader
        title="Kitob Tafsilotlari"
        subtitle="Kitob haqida batafsil ma'lumot."
      />


      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-7xl mx-auto px-4 py-12 space-y-6"
      >

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center cursor-pointer gap-2 mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
        >
          <FiArrowLeft /> Orqaga
        </button>

        {/* Main layout: Content + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Cover + Info */}
            <div className="flex flex-col md:flex-row gap-6 bg-white rounded-xl shadow-md p-6">
              {/* Left: Book Cover */}
              <div className="flex border-r pr-5 border-gray-200 flex-col items-center">
                <motion.img
                  src={coverUrl}
                  alt={book.title}
                  className="w-60 h-80 object-cover rounded-lg shadow-lg border"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 200 }}
                />
                <button onClick={handleDownload} className="mt-4 cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow transition">
                  <FiBookOpen /> {user ? "Yuklab olish": "Login qilish va yuklash"}
                </button>
              </div>

              {/* Right: Book Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    {book.title}
                  </h1>
                  <p className="text-gray-700 mb-2">
                    <b>Muallif:</b> {book.authors?.map((a) => a.name).join(", ") || "Ma'lum emas"}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <b>Resurs turi:</b> Avtoreferat
                  </p>
                  <p className="text-gray-700 mb-2">
                    <b>Betlar soni:</b> 21 bet
                  </p>
                  <p className="text-gray-700 mb-2">
                    <b>Chop etilgan yili:</b> {book.first_publish_date || "Noma'lum"}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <b>Mavzular:</b>{" "}
                    {book.subjects?.slice(0, 5).join(", ") || "Mavzular mavjud emas"}
                  </p>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition">
                    <FiHeart /> Sevimlilarga
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition">
                    <FiShare2 /> Ulashish
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Kitob haqida</h2>
              <p className="text-gray-700 leading-relaxed">
                {book.description?.value || book.description || "Bu kitob haqida batafsil ma'lumot mavjud emas."}
              </p>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6 lg:w-1/4">
            {/* QR Code Card */}
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center">
              <QRCode value={currentUrl} size={148} />
              <div className="flex gap-3 mt-8">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white shadow transition transform hover:scale-110"
                >
                  <FiFacebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-400 hover:text-white shadow transition transform hover:scale-110"
                >
                  <FiTwitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gradient-to-tr hover:from-pink-500 hover:to-yellow-500 hover:text-white shadow transition transform hover:scale-110"
                >
                  <FiInstagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-red-600 hover:text-white shadow transition transform hover:scale-110"
                >
                  <FiYoutube className="w-5 h-5" />
                </a>
              </div>

            </div>

            {/* Elektron Kutubxona Card */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Elektron Kutubxona
              </h3>
              <ul className="space-y-2">
                {["O'quv adabiyotlar", "Monografiyalar", "Dissertatsiyalar"].map((text, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition"
                  >
                    📘 {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
