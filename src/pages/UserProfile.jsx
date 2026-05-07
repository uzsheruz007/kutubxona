import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { FiLogOut, FiHeart, FiBookOpen, FiCalendar, FiMail, FiTrash2, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function Profile() {
    const { user, logout, refreshUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            refreshUser();
        }
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleRemoveFavorite = async (bookId) => {
        try {
            await axios.post(`${API_BASE_URL}/api/accounts/favorites/${bookId}/`);
            refreshUser();
        } catch (e) {
            console.error(e);
        }
    };

    if (!user) return null;

    const initials = (user.first_name?.[0] || user.username?.[0] || "U").toUpperCase();
    const displayName = (user.first_name || user.last_name)
        ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
        : user.username;
    const joinDate = user.date_joined
        ? new Date(user.date_joined).toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" })
        : null;
    const favCount = user.favourites?.length || 0;

    return (
        <div className="min-h-screen bg-stone-100 pt-36 pb-16 px-4">

            <div className="max-w-3xl mx-auto space-y-5">

                {/* ── Profil kartasi ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden"
                >
                    {/* Yupqa rang chizig'i */}
                    <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />

                    <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-5">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                            {user.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                    <span className="text-white text-3xl font-bold select-none">{initials}</span>
                                </div>
                            )}
                        </div>

                        {/* Ma'lumotlar */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-bold text-stone-800">{displayName}</h1>
                            <p className="text-stone-400 text-sm mb-3">@{user.username}</p>
                            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                                <span className="flex items-center gap-1.5 text-sm text-stone-500">
                                    <FiHeart size={13} className="text-red-400" />
                                    <strong className="text-stone-700">{favCount}</strong> sevimli kitob
                                </span>
                                {user.email && (
                                    <span className="flex items-center gap-1.5 text-sm text-stone-500">
                                        <FiMail size={13} className="text-amber-500" />
                                        {user.email}
                                    </span>
                                )}
                                {joinDate && (
                                    <span className="flex items-center gap-1.5 text-sm text-stone-500">
                                        <FiCalendar size={13} className="text-amber-500" />
                                        {joinDate} dan a'zo
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Chiqish */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 font-semibold text-sm transition-all self-start sm:self-center whitespace-nowrap"
                        >
                            <FiLogOut size={15} />
                            Chiqish
                        </button>
                    </div>
                </motion.div>

                {/* ── Sevimli kitoblar ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-stone-200"
                >
                    <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-2">
                        <FiHeart size={16} className="text-red-400" />
                        <h2 className="font-bold text-stone-800 text-base">Sevimli kitoblar</h2>
                        <span className="ml-auto text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            {favCount}
                        </span>
                    </div>

                    <div className="p-6">
                        {favCount > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {user.favourites.map((book, i) => {
                                    const cover = book.coverUrl
                                        ? (book.coverUrl.startsWith("http") ? book.coverUrl : `${API_BASE_URL}${book.coverUrl}`)
                                        : "/images/image.png";
                                    return (
                                        <motion.div
                                            key={book.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.04 }}
                                            className="group relative rounded-xl overflow-hidden border border-stone-100 hover:border-amber-300 hover:shadow-md transition-all bg-stone-50"
                                        >
                                            <Link to={`/book/${book.id}`}>
                                                <div className="aspect-[3/4] overflow-hidden">
                                                    <img
                                                        src={cover}
                                                        alt={book.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="p-2.5">
                                                    <p className="text-xs font-bold text-stone-800 line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors">
                                                        {book.title}
                                                    </p>
                                                    <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{book.author}</p>
                                                </div>
                                            </Link>
                                            <button
                                                onClick={() => handleRemoveFavorite(book.id)}
                                                title="Olib tashlash"
                                                className="absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                            >
                                                <FiTrash2 size={11} className="text-red-500" />
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-16 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                                    <FiBookOpen size={28} className="text-amber-400" />
                                </div>
                                <p className="font-semibold text-stone-600">Hali sevimli kitob yo'q</p>
                                <p className="text-sm text-stone-400 mt-1 mb-5">
                                    Kitob sahifasida ♥ tugmasini bosib saqlang
                                </p>
                                <Link
                                    to="/books"
                                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-sm font-semibold transition-colors shadow-sm"
                                >
                                    Kitoblarni ko'rish
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
