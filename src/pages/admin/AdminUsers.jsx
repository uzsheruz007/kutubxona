import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiTrash2, FiUser, FiMoreVertical } from "react-icons/fi";
import { Loader } from "lucide-react";
import { format } from "date-fns";
import { API_BASE_URL } from "../../config";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/accounts/users/?search=${search}`);
            setUsers(res.data.results || res.data); // Handle pagination or list
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const handleDelete = async (id) => {
        if (!window.confirm("Bu foydalanuvchini o'chirmoqchimisiz?")) return;
        try {
            // await axios.delete(`${API_BASE_URL}/api/accounts/users/${id}/`);
            alert("Hozircha o'chirish imkoniyati yopiq.");
            fetchUsers();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-stone-800">Foydalanuvchilar</h1>
                <div className="relative w-full sm:w-64">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Qidirish..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-100 text-stone-500 text-sm font-semibold uppercase tracking-wider">
                                <th className="p-4 rounded-tl-2xl">Foydalanuvchi</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Admin?</th>
                                <th className="p-4">Ro'yxatdan o'tgan</th>
                                <th className="p-4 rounded-tr-2xl text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center"><Loader className="animate-spin inline text-amber-600" /></td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-stone-400">Foydalanuvchilar topilmadi</td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="hover:bg-stone-50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 overflow-hidden">
                                                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <FiUser />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-stone-800">{user.first_name || user.username}</p>
                                                    <p className="text-xs text-stone-400">@{user.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-stone-600 font-medium">{user.email || "-"}</td>
                                        <td className="p-4">
                                            {user.is_staff || user.is_superuser ? (
                                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">Admin</span>
                                            ) : (
                                                <span className="bg-stone-100 text-stone-500 px-2 py-1 rounded text-xs font-bold">User</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-stone-500">{user.date_joined ? format(new Date(user.date_joined), "dd MMM yyyy") : "-"}</td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => handleDelete(user.id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
