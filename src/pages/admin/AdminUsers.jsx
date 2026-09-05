import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiTrash2, FiUser } from "react-icons/fi";
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
            alert(`Foydalanuvchi #${id} uchun hozircha o'chirish imkoniyati yopiq.`);
            fetchUsers();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl">Foydalanuvchilar</h1>
                <div className="relative w-full sm:w-64">
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
            </div>

            <div className="card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Foydalanuvchi</th>
                                <th>Email</th>
                                <th>Admin?</th>
                                <th>Ro'yxatdan o'tgan</th>
                                <th className="text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center"><Loader className="animate-spin inline" style={{ color: "var(--color-accent)" }} /></td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-muted">Foydalanuvchilar topilmadi</td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="group">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-9 h-9 flex items-center justify-center shrink-0 overflow-hidden text-muted"
                                                    style={{ borderRadius: "var(--radius-sm)", border: "1px solid var(--color-divider)" }}
                                                >
                                                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <FiUser size={16} />}
                                                </div>
                                                <div>
                                                    <p>{user.first_name || user.username}</p>
                                                    <p className="text-xs text-muted">@{user.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-sm">{user.email || "-"}</td>
                                        <td>
                                            {user.is_staff || user.is_superuser ? (
                                                <span className="tag tag-accent">Admin</span>
                                            ) : (
                                                <span className="tag tag-neutral">User</span>
                                            )}
                                        </td>
                                        <td className="text-sm text-muted">{user.date_joined ? format(new Date(user.date_joined), "dd MMM yyyy") : "-"}</td>
                                        <td className="text-right">
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="btn btn-icon btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
                                                style={{ color: "#a13a2b" }}
                                            >
                                                <FiTrash2 size={16} />
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
