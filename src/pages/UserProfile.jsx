import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { User, Heart, BookOpen, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../config";
import BookCard from "../components/BookCard";

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

    const displayName = (user.first_name || user.last_name)
        ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
        : user.username;
    const joinDate = user.date_joined
        ? new Date(user.date_joined).toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" })
        : null;
    const favCount = user.favourites?.length || 0;

    const metaParts = [`@${user.username}`, user.email, joinDate].filter(Boolean);

    return (
        <div style={{ paddingTop: "calc(var(--space-8) * 2.6)", paddingBottom: "var(--space-8)" }}>
            <div className="max-w-4xl mx-auto px-4 md:px-8">

                <h6>Shaxsiy kabinet</h6>
                <hr className="hr" />

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex items-end justify-between flex-wrap" style={{ gap: "var(--space-4)" }}>
                        <div className="flex items-center" style={{ gap: "var(--space-4)" }}>
                            <div
                                style={{
                                    width: 76, height: 76, borderRadius: "50%",
                                    border: "1px solid var(--color-divider)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    overflow: "hidden", flexShrink: 0,
                                }}
                            >
                                {user.avatar ? (
                                    <img src={user.avatar} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <User size={32} color="var(--color-accent)" />
                                )}
                            </div>
                            <div>
                                <h1 style={{ fontWeight: 400 }}>{displayName}</h1>
                                <p className="text-muted" style={{ fontSize: 13 }}>{metaParts.join(" · ")}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="btn btn-secondary">
                            Chiqish
                        </button>
                    </div>

                    <hr className="hr" />

                    <div className="grid" style={{ gridTemplateColumns: joinDate ? "repeat(2, 1fr)" : "1fr", maxWidth: 360 }}>
                        <div style={{ padding: "0 var(--space-4)" }}>
                            <div className="num" style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 32 }}>
                                {favCount}
                            </div>
                            <div className="text-muted" style={{ fontSize: 12 }}>Sevimli kitoblar</div>
                        </div>
                        {joinDate && (
                            <div style={{ padding: "0 var(--space-4)", borderLeft: "1px solid var(--color-divider)" }}>
                                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 20 }}>
                                    {joinDate}
                                </div>
                                <div className="text-muted" style={{ fontSize: 12 }}>A'zo bo'lgan sana</div>
                            </div>
                        )}
                    </div>

                    <hr className="hr" />

                    <div className="flex items-center" style={{ gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ margin: 0 }}>Sevimli kitoblar</h4>
                        <span className="tag tag-neutral">{favCount}</span>
                    </div>

                    {favCount > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4" style={{ gap: "var(--space-4)" }}>
                            {user.favourites.map((book) => {
                                const cover = book.coverUrl
                                    ? (book.coverUrl.startsWith("http") ? book.coverUrl : `${API_BASE_URL}${book.coverUrl}`)
                                    : null;
                                return (
                                    <div key={book.id} className="group" style={{ position: "relative" }}>
                                        <BookCard id={book.id} title={book.title} author={book.author} coverUrl={cover} variant="grid" />
                                        <button
                                            onClick={() => handleRemoveFavorite(book.id)}
                                            title="Olib tashlash"
                                            className="btn-icon"
                                            style={{
                                                position: "absolute", top: 6, right: 6,
                                                background: "var(--color-bg)", border: "1px solid var(--color-divider)",
                                                borderRadius: "var(--radius-md)", width: 30, height: 30,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <Trash2 size={14} color="var(--color-accent)" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center" style={{ padding: "var(--space-8) 0" }}>
                            <BookOpen size={32} color="var(--color-accent)" style={{ margin: "0 auto var(--space-3)" }} />
                            <p style={{ marginBottom: "var(--space-1)" }}>Hali sevimli kitob yo'q</p>
                            <p className="text-muted" style={{ fontSize: 13, marginBottom: "var(--space-4)" }}>
                                Kitob sahifasida <Heart size={12} style={{ display: "inline", verticalAlign: "-1px" }} /> tugmasini bosib saqlang
                            </p>
                            <Link to="/books" className="btn btn-primary">
                                Kitoblarni ko'rish
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
