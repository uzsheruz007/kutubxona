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
        <div className="flex h-screen" style={{ background: "var(--color-bg)" }}>
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}
                style={{ background: "var(--color-surface)", borderRight: "1px solid var(--color-divider)" }}
            >
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center gap-3 px-6" style={{ borderBottom: "1px solid var(--color-divider)" }}>
                        <img src={Logo} alt="Logo" className="h-8 w-8" />
                        <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--font-heading-weight)" }} className="text-lg">
                            Admin Panel
                        </span>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const active = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                                    style={{
                                        borderLeft: active ? "2px solid var(--color-accent)" : "2px solid transparent",
                                        color: active ? "var(--color-accent)" : "var(--color-text)",
                                        background: active ? "color-mix(in srgb, var(--color-accent) 8%, transparent)" : "transparent",
                                    }}
                                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "color-mix(in srgb, var(--color-text) 6%, transparent)"; }}
                                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4" style={{ borderTop: "1px solid var(--color-divider)" }}>
                        <div className="flex items-center gap-3 px-2 py-2 mb-2">
                            <div
                                className="w-8 h-8 flex items-center justify-center text-xs shrink-0"
                                style={{ borderRadius: "var(--radius-sm)", border: "1px solid var(--color-divider)", color: "var(--color-accent)" }}
                            >
                                {user.username[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{user.first_name || "Admin"}</p>
                                <p className="text-xs truncate text-muted">{user.email || user.username}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { logout(); navigate("/"); }}
                            className="btn btn-ghost btn-block justify-start"
                            style={{ color: "#a13a2b" }}
                        >
                            <FiLogOut size={16} /> Chiqish
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header
                    className="lg:hidden h-16 flex items-center justify-between px-4"
                    style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-divider)" }}
                >
                    <div className="flex items-center gap-3">
                        <img src={Logo} alt="Logo" className="h-8 w-8" />
                        <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--font-heading-weight)" }}>Admin</span>
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn btn-icon btn-ghost">
                        {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    style={{ background: "color-mix(in srgb, var(--color-neutral-900) 30%, transparent)" }}
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}
