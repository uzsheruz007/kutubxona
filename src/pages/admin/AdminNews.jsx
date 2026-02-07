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
                <h1 className="text-2xl font-bold text-stone-800">Yangiliklar va E'lonlar</h1>
                <button onClick={() => navigate("/admin-panel/news/new")} className="bg-stone-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-stone-200">
                    <FiPlus /> Yangilik Qo'shish
                </button>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-center gap-2 w-full sm:w-96">
                <FiSearch className="text-stone-400" />
                <input
                    type="text"
                    placeholder="Qidirish..."
                    className="flex-1 outline-none text-stone-700 bg-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center p-20"><Loader className="animate-spin text-amber-600" /></div>
                ) : news.length === 0 ? (
                    <div className="col-span-full text-center text-stone-400 py-20">Yangiliklar topilmadi</div>
                ) : (
                    news.map(item => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                            <div className="h-40 bg-stone-100 relative overflow-hidden">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-stone-300 bg-stone-50">Rasm yo'q</div>
                                )}
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm text-stone-800">
                                    {item.category}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-stone-800 mb-2 line-clamp-2">{item.title}</h3>
                                <div className="flex items-center gap-2 text-stone-400 text-sm mb-4">
                                    <FiCalendar size={14} />
                                    <span>{item.date ? format(new Date(item.date), "dd MMM yyyy") : "-"}</span>
                                </div>

                                <div className="mt-auto flex justify-end gap-2 pt-4 border-t border-stone-50">
                                    <button onClick={() => navigate(`/admin-panel/news/edit/${item.id}`)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                        <FiEdit2 />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <FiTrash2 />
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
