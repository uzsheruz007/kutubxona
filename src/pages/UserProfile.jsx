import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { FiLogOut, FiHeart, FiUser, FiSettings, FiBookOpen, FiAward, FiGrid, FiList } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Profile() {
    const { user, logout, refreshUser } = useUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("books");

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            refreshUser();
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden">
            {/* Atmospheric Background */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-stone-50 via-orange-50/30 to-amber-50/30"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">

                {/* Left Column: Sidebar Card */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col items-center text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-amber-500/10 to-transparent"></div>

                        <div className="relative z-10">
                            <div className="w-28 h-28 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center mb-4 relative z-10 mx-auto overflow-hidden">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <FiUser size={40} className="text-stone-300" />
                                )}
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-stone-800 font-serif">
                            {user.first_name || user.username} {user.last_name || ""}
                        </h2>
                        <p className="text-stone-500 text-sm font-medium mb-4">{user.user_type === 'employee' ? 'Xodim' : 'Talaba'}</p>

                        <div className="w-full border-t border-stone-100 pt-4 space-y-2">
                            <button
                                onClick={() => setActiveTab("books")}
                                className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${activeTab === "books" ? "bg-amber-100/50 text-amber-700" : "text-stone-600 hover:bg-stone-50"}`}
                            >
                                <FiHeart className={activeTab === "books" ? "text-amber-600" : "text-stone-400"} />
                                Sevimli Kitoblar
                            </button>
                            <button
                                onClick={() => setActiveTab("news")}
                                className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${activeTab === "news" ? "bg-amber-100/50 text-amber-700" : "text-stone-600 hover:bg-stone-50"}`}
                            >
                                <FiList className={activeTab === "news" ? "text-amber-600" : "text-stone-400"} />
                                Yangiliklar
                            </button>
                            <button
                                onClick={() => setActiveTab("stats")}
                                className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${activeTab === "stats" ? "bg-amber-100/50 text-amber-700" : "text-stone-600 hover:bg-stone-50"}`}
                            >
                                <FiAward className={activeTab === "stats" ? "text-amber-600" : "text-stone-400"} />
                                Statistika
                            </button>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="mt-6 w-full py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-semibold shadow-sm transition-all flex items-center justify-center gap-2 group text-sm"
                        >
                            <FiLogOut className="group-hover:-translate-x-1 transition-transform" />
                            Chiqish
                        </button>
                    </motion.div>
                </div>

                {/* Right Column: Content Area */}
                <div className="lg:col-span-3">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/60 backdrop-blur-md rounded-3xl shadow-sm border border-white/60 p-6 sm:p-8 min-h-[500px]"
                    >
                        {activeTab === "books" && (
                            <div>
                                <h3 className="text-xl font-bold font-serif mb-6 text-stone-800 flex items-center gap-2">
                                    <FiHeart className="text-red-500" /> Sevimli Kitoblar
                                </h3>
                                {user.favourites && user.favourites.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {user.favourites.map((book) => {
                                            const coverSrc = book.coverUrl
                                                ? (book.coverUrl.startsWith('http') ? book.coverUrl : `http://127.0.0.1:8000${book.coverUrl}`)
                                                : "/images/image.png";
                                            return (
                                                <Link to={`/book/${book.id}`} key={book.id} className="group bg-white rounded-xl overflow-hidden border border-stone-100 hover:border-amber-200 hover:shadow-md transition-all flex flex-col">
                                                    <div className="h-40 overflow-hidden relative">
                                                        <img src={coverSrc} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                                            <span className="text-white text-xs font-medium">O'qish</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 flex-grow flex flex-col">
                                                        <h4 className="font-bold text-stone-800 line-clamp-2 mb-1 group-hover:text-amber-700 transition-colors">{book.title}</h4>
                                                        <p className="text-xs text-stone-500 mb-2">{book.author}</p>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                                        <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mb-4">
                                            <FiBookOpen size={30} className="text-stone-500" />
                                        </div>
                                        <p className="text-lg text-stone-600 font-medium">Sizda hali sevimli kitoblar yo'q</p>
                                        <p className="text-sm text-stone-400">Kitoblar sahifasiga o'tib, yoqqanlarini saqlab qo'ying.</p>
                                        <Link to="/books" className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-full text-sm font-semibold hover:bg-amber-700 transition-all">Kitoblar Sahifasi</Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "news" && (
                            <div>
                                <h3 className="text-xl font-bold font-serif mb-6 text-stone-800 flex items-center gap-2">
                                    <FiList className="text-blue-500" /> Yangiliklar
                                </h3>
                                <div className="text-center py-20 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
                                    <p className="text-stone-500">Saqlangan yangiliklar mavjud emas.</p>
                                    <Link to="/news" className="text-amber-600 font-medium hover:underline mt-2 inline-block">Barcha yangiliklarni ko'rish</Link>
                                </div>
                            </div>
                        )}

                        {activeTab === "stats" && (
                            <div>
                                <h3 className="text-xl font-bold font-serif mb-6 text-stone-800 flex items-center gap-2">
                                    <FiAward className="text-purple-500" /> Shaxsiy Statistika
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
                                        <div className="text-3xl font-bold text-amber-700 mb-1">{user.favourites?.length || 0}</div>
                                        <div className="text-sm text-stone-600">Jami Saqlangan Kitoblar</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                                        <div className="text-3xl font-bold text-blue-700 mb-1">{new Date().getFullYear() - 2020}</div>
                                        <div className="text-sm text-stone-600">Kutubxonadan foydalanish yillari</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}