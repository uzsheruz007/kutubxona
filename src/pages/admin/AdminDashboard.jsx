import { useEffect, useState } from "react";
import axios from "axios";
import { FiBook, FiUsers, FiUserPlus, FiPieChart } from "react-icons/fi";
import { Loader } from "lucide-react";
import { API_BASE_URL } from "../../config";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/books/admin/stats/`);
                setStats(response.data);
            } catch (error) {
                console.error("Failed to load admin stats", error);
                // Fallback / mock data for dev if permissions fail temporarily
                // setStats({ totalBooks: 0, totalUsers: 0, newUsersToday: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="flex justify-center p-20"><Loader className="animate-spin text-amber-600" /></div>;

    if (!stats) return <div className="text-center p-10 text-stone-500">Ma'lumotlarni yuklashda xatolik.</div>;

    const cards = [
        { title: "Jami Kitoblar", value: stats.totalBooks, icon: FiBook, color: "bg-blue-500" },
        { title: "Jami Foydalanuvchilar", value: stats.totalUsers, icon: FiUsers, color: "bg-green-500" },
        { title: "Bugungi yangi a'zolar", value: stats.newUsersToday, icon: FiUserPlus, color: "bg-purple-500" },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-stone-800">Boshqaruv Paneli</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl ${card.color} text-white flex items-center justify-center shadow-lg shadow-gray-200`}>
                            <card.icon size={28} />
                        </div>
                        <div>
                            <p className="text-stone-500 text-sm font-medium">{card.title}</p>
                            <p className="text-3xl font-bold text-stone-800">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Stats */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                    <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
                        <FiPieChart className="text-amber-500" /> Kitoblar turlari bo'yicha
                    </h3>

                    <div className="space-y-4">
                        {stats.categoryStats?.map((cat, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-stone-700">{cat.category || "Noma'lum"}</span>
                                    <span className="text-stone-500">{cat.count} ta</span>
                                </div>
                                <div className="w-full bg-stone-100 rounded-full h-2">
                                    <div
                                        className="bg-amber-500 h-2 rounded-full"
                                        style={{ width: `${(cat.count / stats.totalBooks) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {(!stats.categoryStats || stats.categoryStats.length === 0) && (
                            <p className="text-stone-400 text-sm text-center py-4">Ma'lumot yo'q</p>
                        )}
                    </div>
                </div>

                {/* Recent Activity Placeholder */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 opacity-60">
                    <h3 className="text-lg font-bold text-stone-800 mb-4">So'nggi faoliyatlar</h3>
                    <p className="text-stone-500 text-sm">Tez orada...</p>
                </div>
            </div>
        </div>
    );
}
