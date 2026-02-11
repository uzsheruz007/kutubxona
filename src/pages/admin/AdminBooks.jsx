import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { API_BASE_URL } from "../../config";
import { BOOK_CATEGORIES } from "../../constants/categories";

export default function AdminBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

    // Static categories for filter (same as translations)
    // Categories for filter
    const categoryOptions = [
        { value: "all", label: "Barchasi" },
        ...BOOK_CATEGORIES
    ];

    useEffect(() => {
        fetchBooks();
    }, [category]);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            let url = `${API_BASE_URL}/api/books/`;
            if (category !== "all") {
                url += `?category=${category}`;
            }
            const response = await axios.get(url);
            setBooks(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Rostdan ham bu kitobni o'chirmoqchimisiz?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/books/${id}/`);
            setBooks(books.filter(b => b.id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
            alert("O'chirishda xatolik! Ruxsat yetarli emas bo'lishi mumkin.");
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-stone-800">Kitoblar Boshqaruvi</h1>
                <Link to="/admin-panel/books/new" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm">
                    <FiPlus /> Yangi Kitob
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4">
                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex-1 min-w-[200px] relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Qidirish..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <select
                            className="pl-10 pr-8 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white appearance-none cursor-pointer"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categoryOptions.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-stone-100 text-stone-500 text-sm font-medium">
                                <th className="p-3">#</th>
                                <th className="p-3">Muqova</th>
                                <th className="p-3">Nomi</th>
                                <th className="p-3">Muallif</th>
                                <th className="p-3">Kategoriya</th>
                                <th className="p-3 text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="text-stone-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-8"><Loader className="animate-spin h-6 w-6 text-amber-600 mx-auto" /></td>
                                </tr>
                            ) : filteredBooks.length > 0 ? (
                                filteredBooks.map((book, idx) => (
                                    <tr key={book.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors group">
                                        <td className="p-3 text-stone-400 text-sm">{idx + 1}</td>
                                        <td className="p-3">
                                            <div className="h-12 w-8 bg-stone-200 rounded overflow-hidden">
                                                {book.cover_image && <img src={book.cover_image} alt="" className="w-full h-full object-cover" />}
                                            </div>
                                        </td>
                                        <td className="p-3 font-medium">{book.title}</td>
                                        <td className="p-3 text-sm">{book.author}</td>
                                        <td className="p-3 text-sm capitalize">
                                            <span className="bg-stone-100 px-2 py-1 rounded text-stone-600 text-xs">
                                                {BOOK_CATEGORIES.find(c => c.value === book.category)?.label || book.category}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link to={`/admin-panel/books/edit/${book.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <FiEdit2 size={16} />
                                                </Link>
                                                <button onClick={() => handleDelete(book.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-stone-400">Kitoblar topilmadi.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
