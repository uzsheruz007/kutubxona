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
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="flex justify-center p-20"><Loader className="animate-spin" style={{ color: "var(--color-accent)" }} /></div>;

    if (!stats) return <div className="text-center p-10 text-muted">Ma'lumotlarni yuklashda xatolik.</div>;

    const cards = [
        { title: "Jami kitoblar", value: stats.totalBooks, icon: FiBook },
        { title: "Jami foydalanuvchilar", value: stats.totalUsers, icon: FiUsers },
        { title: "Bugungi yangi a'zolar", value: stats.newUsersToday, icon: FiUserPlus },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-2xl">Boshqaruv paneli</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="card flex-row items-center gap-4">
                        <div
                            className="w-12 h-12 flex items-center justify-center shrink-0"
                            style={{ borderRadius: "var(--radius-md)", border: "1px solid var(--color-divider)", color: "var(--color-accent)" }}
                        >
                            <card.icon size={22} />
                        </div>
                        <div>
                            <p className="text-sm text-muted">{card.title}</p>
                            <p className="num text-3xl" style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--font-heading-weight)" }}>{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Stats */}
                <div className="card">
                    <h3 className="text-lg flex items-center gap-2 mb-2" style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--font-heading-weight)" }}>
                        <FiPieChart style={{ color: "var(--color-accent)" }} /> Kitoblar turlari bo'yicha
                    </h3>

                    <div className="space-y-4">
                        {stats.categoryStats?.map((cat, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{cat.category || "Noma'lum"}</span>
                                    <span className="text-muted">{cat.count} ta</span>
                                </div>
                                <div style={{ width: "100%", background: "var(--color-neutral-200)", height: "6px", borderRadius: "var(--radius-sm)" }}>
                                    <div
                                        style={{
                                            width: `${(cat.count / stats.totalBooks) * 100}%`,
                                            background: "var(--color-accent)",
                                            height: "6px",
                                            borderRadius: "var(--radius-sm)",
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {(!stats.categoryStats || stats.categoryStats.length === 0) && (
                            <p className="text-sm text-center py-4 text-muted">Ma'lumot yo'q</p>
                        )}
                    </div>
                </div>

                {/* Recent Activity Placeholder */}
                <div className="card opacity-60">
                    <h3 className="text-lg mb-2" style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--font-heading-weight)" }}>So'nggi faoliyatlar</h3>
                    <p className="text-sm text-muted">Tez orada...</p>
                </div>
            </div>
        </div>
    );
}
