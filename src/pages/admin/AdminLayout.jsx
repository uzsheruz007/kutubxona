import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { FiHome, FiBook, FiUsers, FiFileText, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import Logo from "../../assets/Logo.png";

export default function AdminLayout() {
    const { user, logout } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Simple Admin Guard
    useEffect(() => {
        if (user === null) return; // Wait for load
        if (!user || (!user.is_staff && !user.is_superuser)) {
            navigate("/");
        }
    }, [user, navigate]);

    if (!user) return null;

    const navItems = [
        { path: "/admin-panel", icon: FiHome, label: "Boshqaruv" },
        { path: "/admin-panel/books", icon: FiBook, label: "Kitoblar" },
        { path: "/admin-panel/users", icon: FiUsers, label: "Foydalanuvchilar" },
        { path: "/admin-panel/news", icon: FiFileText, label: "Yangiliklar" },
    ];

    return (
        <div className="flex h-screen bg-stone-50">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-200 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}>
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center gap-3 px-6 border-b border-stone-100">
                        <img src={Logo} alt="Logo" className="h-8 w-8" />
                        <span className="font-bold text-stone-800 text-lg">Admin Panel</span>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${location.pathname === item.path ? "bg-amber-100 text-amber-700" : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"}`}
                            >
                                <item.icon />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-stone-100">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs">
                                {user.username[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-stone-900 truncate">{user.first_name || "Admin"}</p>
                                <p className="text-xs text-stone-500 truncate">{user.email || user.username}</p>
                            </div>
                        </div>
                        <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                            <FiLogOut /> Chiqish
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b border-stone-200 h-16 flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <img src={Logo} alt="Logo" className="h-8 w-8" />
                        <span className="font-bold text-stone-800">Admin</span>
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-stone-600">
                        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}
