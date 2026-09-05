import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiDownload } from "react-icons/fi";
import { Loader } from "lucide-react";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../../config";
import { BOOK_CATEGORIES } from "../../constants/categories";

export default function AdminBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

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

    const [exporting, setExporting] = useState(false);

    const handleExportExcel = async () => {
        setExporting(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/books/`);
            const allBooks = response.data;

            const rows = allBooks.map((book, idx) => ({
                "#": idx + 1,
                "Kitob nomi": book.title || "",
                "Muallif": book.author || "",
                "Kategoriya": BOOK_CATEGORIES.find(c => c.value === book.category)?.label || book.category || "",
                "Betlar soni": book.page_count || 0,
                "Chop etilgan sana": book.published_date || "",
                "Mavzular": book.subjects || "",
                "Qo'shilgan sana": book.created_at ? new Date(book.created_at).toLocaleDateString("uz-UZ") : "",
            }));

            const worksheet = XLSX.utils.json_to_sheet(rows);
            worksheet["!cols"] = [
                { wch: 4 },
                { wch: 40 },
                { wch: 30 },
                { wch: 18 },
                { wch: 12 },
                { wch: 18 },
                { wch: 35 },
                { wch: 18 },
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Kitoblar");

            const today = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(workbook, `kitoblar_${today}.xlsx`);
        } catch (error) {
            console.error("Excel eksport xatosi:", error);
            alert("Eksport qilishda xatolik yuz berdi.");
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl">Kitoblar boshqaruvi</h1>
                <div className="flex items-center gap-3">
                    <button onClick={handleExportExcel} disabled={exporting} className="btn btn-secondary">
                        {exporting ? <Loader className="animate-spin h-4 w-4" /> : <FiDownload size={16} />}
                        Excel yuklab olish
                    </button>
                    <Link to="/admin-panel/books/new" className="btn btn-primary">
                        <FiPlus size={16} /> Yangi kitob
                    </Link>
                </div>
            </div>

            <div className="card">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px] relative">
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
                    <div className="relative">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
                        <select
                            className="input"
                            style={{ paddingLeft: "34px", cursor: "pointer" }}
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
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Muqova</th>
                                <th>Nomi</th>
                                <th>Muallif</th>
                                <th>Kategoriya</th>
                                <th className="text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-8"><Loader className="animate-spin h-6 w-6 mx-auto" style={{ color: "var(--color-accent)" }} /></td>
                                </tr>
                            ) : filteredBooks.length > 0 ? (
                                filteredBooks.map((book, idx) => (
                                    <tr key={book.id} className="group">
                                        <td className="text-sm text-muted">{idx + 1}</td>
                                        <td>
                                            <div className="plate h-12 w-8" style={{ background: "var(--color-neutral-200)" }}>
                                                {book.cover_image && <img src={book.cover_image} alt="" className="w-full h-full object-cover" />}
                                            </div>
                                        </td>
                                        <td>{book.title}</td>
                                        <td className="text-sm">{book.author}</td>
                                        <td className="text-sm">
                                            <span className="tag tag-neutral">
                                                {BOOK_CATEGORIES.find(c => c.value === book.category)?.label || book.category}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link to={`/admin-panel/books/edit/${book.id}`} className="btn btn-icon btn-ghost">
                                                    <FiEdit2 size={16} />
                                                </Link>
                                                <button onClick={() => handleDelete(book.id)} className="btn btn-icon btn-ghost" style={{ color: "#a13a2b" }}>
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-muted">Kitoblar topilmadi.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
