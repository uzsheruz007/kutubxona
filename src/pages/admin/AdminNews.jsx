import { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiCalendar } from "react-icons/fi";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { API_BASE_URL } from "../../config";

export default function AdminNews() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/news/?search=${search}`);
            setNews(res.data.results || res.data);
        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchNews();
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const handleDelete = async (id) => {
        if (!window.confirm("Bu yangilikni o'chirmoqchimisiz?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/news/${id}/`);
            setNews(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error("Delete error:", error);
            alert("O'chirishda xatolik!");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl">Yangiliklar va E'lonlar</h1>
                <button onClick={() => navigate("/admin-panel/news/new")} className="btn btn-primary">
                    <FiPlus size={16} /> Yangilik Qo'shish
                </button>
            </div>

            <div className="relative w-full sm:w-96">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                    type="text"
                    placeholder="Qidirish..."
                    className="input"
                    style={{ paddingLeft: "34px" }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center p-20"><Loader className="animate-spin" style={{ color: "var(--color-accent)" }} /></div>
                ) : news.length === 0 ? (
                    <div className="col-span-full text-center text-muted py-20">Yangiliklar topilmadi</div>
                ) : (
                    news.map(item => (
                        <div key={item.id} className="card p-0 overflow-hidden group">
                            <div className="h-40 relative overflow-hidden" style={{ background: "var(--color-neutral-200)" }}>
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted text-sm">Rasm yo'q</div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <span className="tag tag-accent">{item.category}</span>
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col gap-3">
                                <h3 className="text-lg line-clamp-2" style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--font-heading-weight)" }}>{item.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted">
                                    <FiCalendar size={14} />
                                    <span>{item.date ? format(new Date(item.date), "dd MMM yyyy") : "-"}</span>
                                </div>

                                <div className="hr" style={{ margin: "0" }}></div>
                                <div className="flex justify-end gap-1">
                                    <button onClick={() => navigate(`/admin-panel/news/edit/${item.id}`)} className="btn btn-icon btn-ghost">
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="btn btn-icon btn-ghost" style={{ color: "#a13a2b" }}>
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
