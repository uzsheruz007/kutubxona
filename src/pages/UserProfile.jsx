import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import {
    FiLogOut, FiHeart, FiUser, FiLock, FiBookOpen,
    FiCalendar, FiMail, FiTrash2, FiCheck, FiX, FiEye, FiEyeOff
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function Profile() {
    const { user, logout, refreshUser } = useUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("books");

    const [passwordForm, setPasswordForm] = useState({ old_password: "", new_password: "", confirm_password: "" });
    const [passwordMsg, setPasswordMsg] = useState(null);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);

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
        } catch (error) {
            console.error("Remove favorite error:", error);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            setPasswordMsg({ type: "error", text: "Yangi parollar mos kelmadi." });
            return;
        }
        if (passwordForm.new_password.length < 6) {
            setPasswordMsg({ type: "error", text: "Parol kamida 6 ta belgidan iborat bo'lishi kerak." });
            return;
        }
        setPasswordLoading(true);
        setPasswordMsg(null);
        try {
            await axios.post(`${API_BASE_URL}/api/accounts/change-password/`, {
                old_password: passwordForm.old_password,
                new_password: passwordForm.new_password,
            });
            setPasswordMsg({ type: "success", text: "Parol muvaffaqiyatli o'zgartirildi." });
            setPasswordForm({ old_password: "", new_password: "", confirm_password: "" });
        } catch (error) {
            const errMsg =
                error.response?.data?.old_password?.[0] ||
                error.response?.data?.message ||
                "Xatolik yuz berdi.";
            setPasswordMsg({ type: "error", text: errMsg });
        } finally {
            setPasswordLoading(false);
        }
    };

    if (!user) return null;

    const joinDate = user.date_joined
        ? new Date(user.date_joined).toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" })
        : null;

    const favCount = user.favourites?.length || 0;
    const initials = (user.first_name?.[0] || user.username?.[0] || "U").toUpperCase();
    const displayName = (user.first_name || user.last_name)
        ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
        : user.username;

    const tabs = [
        { id: "books", label: "Sevimli kitoblar", icon: FiHeart, count: favCount },
        { id: "password", label: "Parolni o'zgartirish", icon: FiLock },
    ];

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-stone-50 via-orange-50/20 to-amber-50/30" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-200/15 rounded-full blur-[140px] -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />

            <div className="max-w-4xl mx-auto relative z-10 space-y-5">

                {/* ── Profile Header Card ── */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 overflow-hidden"
                >
                    {/* Gradient banner */}
                    <div className="h-28 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 relative">
                        <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
                        />
                    </div>

                    <div className="px-6 sm:px-8 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-5">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden flex-shrink-0">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                        <span className="text-white text-3xl font-bold select-none">{initials}</span>
                                    </div>
                                )}
                            </div>

                            {/* Name */}
                            <div className="flex-1 sm:pb-1">
                                <h1 className="text-2xl font-bold text-stone-800 font-serif leading-tight">{displayName}</h1>
                                <p className="text-stone-400 text-sm mt-0.5">@{user.username}</p>
                            </div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 font-semibold text-sm transition-all group"
                            >
                                <FiLogOut className="group-hover:-translate-x-0.5 transition-transform" />
                                Chiqish
                            </button>
                        </div>

                        {/* Info chips */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-1.5 text-stone-500 text-sm">
                                <FiHeart className="text-red-400" />
                                <span><strong className="text-stone-700">{favCount}</strong> sevimli kitob</span>
                            </div>
                            {user.email && (
                                <div className="flex items-center gap-1.5 text-stone-500 text-sm">
                                    <FiMail className="text-amber-500" />
                                    <span>{user.email}</span>
                                </div>
                            )}
                            {joinDate && (
                                <div className="flex items-center gap-1.5 text-stone-500 text-sm">
                                    <FiCalendar className="text-amber-500" />
                                    <span>{joinDate} dan a'zo</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* ── Tabs + Content ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-white/60 overflow-hidden"
                >
                    {/* Tab nav */}
                    <div className="flex gap-1 border-b border-stone-100 px-4 pt-3">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-xl transition-all ${
                                    activeTab === tab.id
                                        ? "text-amber-700 bg-amber-50/70"
                                        : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                                }`}
                            >
                                <tab.icon size={15} />
                                {tab.label}
                                {tab.count !== undefined && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                                        activeTab === tab.id ? "bg-amber-200 text-amber-700" : "bg-stone-100 text-stone-400"
                                    }`}>
                                        {tab.count}
                                    </span>
                                )}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="tab-underline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                            className="p-6 sm:p-8"
                        >

                            {/* ── SEVIMLI KITOBLAR ── */}
                            {activeTab === "books" && (
                                user.favourites && user.favourites.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {user.favourites.map(book => {
                                            const coverSrc = book.coverUrl
                                                ? (book.coverUrl.startsWith("http") ? book.coverUrl : `${API_BASE_URL}${book.coverUrl}`)
                                                : "/images/image.png";
                                            return (
                                                <div key={book.id} className="group relative bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
                                                    <Link to={`/book/${book.id}`}>
                                                        <div className="aspect-[3/4] overflow-hidden bg-stone-100">
                                                            <img
                                                                src={coverSrc}
                                                                alt={book.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <div className="p-3">
                                                            <h4 className="font-bold text-stone-800 text-sm line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors">
                                                                {book.title}
                                                            </h4>
                                                            <p className="text-xs text-stone-400 mt-1">{book.author}</p>
                                                        </div>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleRemoveFavorite(book.id)}
                                                        title="Sevimlilardan olib tashlash"
                                                        className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                                    >
                                                        <FiTrash2 size={13} className="text-red-500" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <div className="w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-100 rounded-full flex items-center justify-center mb-5">
                                            <FiBookOpen size={32} className="text-amber-400" />
                                        </div>
                                        <p className="text-lg font-semibold text-stone-600">Hali sevimli kitob yo'q</p>
                                        <p className="text-sm text-stone-400 mt-1 mb-5">
                                            Yoqqan kitoblarni ♥ tugmasi orqali saqlab qo'ying
                                        </p>
                                        <Link
                                            to="/books"
                                            className="px-6 py-2.5 bg-amber-600 text-white rounded-full text-sm font-semibold hover:bg-amber-700 transition-all shadow-md shadow-amber-100"
                                        >
                                            Kitoblarni ko'rish
                                        </Link>
                                    </div>
                                )
                            )}

                            {/* ── PAROLNI O'ZGARTIRISH ── */}
                            {activeTab === "password" && (
                                <div className="max-w-md">
                                    <p className="text-stone-500 text-sm mb-6">
                                        Xavfsizlik uchun parolni muntazam yangilab turing.
                                    </p>
                                    <form onSubmit={handleChangePassword} className="space-y-4">

                                        <div>
                                            <label className="block text-sm font-medium text-stone-600 mb-1.5">Joriy parol</label>
                                            <div className="relative">
                                                <input
                                                    type={showOld ? "text" : "password"}
                                                    value={passwordForm.old_password}
                                                    onChange={e => setPasswordForm(p => ({ ...p, old_password: e.target.value }))}
                                                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-stone-50/80 text-sm transition-colors"
                                                    placeholder="Hozirgi parolingiz"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowOld(v => !v)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                                                >
                                                    {showOld ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-stone-600 mb-1.5">Yangi parol</label>
                                            <div className="relative">
                                                <input
                                                    type={showNew ? "text" : "password"}
                                                    value={passwordForm.new_password}
                                                    onChange={e => setPasswordForm(p => ({ ...p, new_password: e.target.value }))}
                                                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-stone-50/80 text-sm transition-colors"
                                                    placeholder="Kamida 6 ta belgi"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNew(v => !v)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                                                >
                                                    {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-stone-600 mb-1.5">Yangi parolni tasdiqlang</label>
                                            <input
                                                type="password"
                                                value={passwordForm.confirm_password}
                                                onChange={e => setPasswordForm(p => ({ ...p, confirm_password: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-stone-50/80 text-sm transition-colors"
                                                placeholder="Yangi parolni qayta kiriting"
                                                required
                                            />
                                        </div>

                                        <AnimatePresence>
                                            {passwordMsg && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
                                                        passwordMsg.type === "success"
                                                            ? "bg-green-50 text-green-700 border border-green-100"
                                                            : "bg-red-50 text-red-600 border border-red-100"
                                                    }`}
                                                >
                                                    {passwordMsg.type === "success" ? <FiCheck /> : <FiX />}
                                                    {passwordMsg.text}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <button
                                            type="submit"
                                            disabled={passwordLoading}
                                            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-amber-100/50 flex items-center justify-center gap-2"
                                        >
                                            {passwordLoading ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                    </svg>
                                                    Saqlanmoqda...
                                                </>
                                            ) : "Parolni o'zgartirish"}
                                        </button>
                                    </form>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </motion.div>

            </div>
        </div>
    );
}
