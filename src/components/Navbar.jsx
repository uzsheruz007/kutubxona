import { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/Logo.png";
import { useUser } from "../context/UserContext";
import { useTranslation } from "react-i18next";

const languages = [
    { code: "uz", label: "UZ" },
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
];

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const { user, logout } = useUser();
    const location = useLocation();
    const navigate = useNavigate();

    const userRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const currentLang = i18n.language || "uz";

    const navItems = [
        { key: "home", to: "/", label: t("navbar.home") },
        { key: "stats", scrollTo: "stats", label: t("navbar.statistics") },
        { key: "news", to: "/news", label: t("navbar.news") },
        // removed contact
        { key: "books", to: "/books", label: t("navbar.books") },
    ];

    const handleSectionClick = (sectionId) => {
        if (location.pathname !== "/") {
            navigate("/", { replace: false });
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    scroll.scrollTo(element.offsetTop - 100, { smooth: true, duration: 600 });
                }
            }, 50);
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                scroll.scrollTo(element.offsetTop - 100, { smooth: true, duration: 600 });
            }
        }
        setMobileMenuOpen(false);
    };

    const handleNavClick = (item) => {
        if (item.scrollTo) {
            handleSectionClick(item.scrollTo);
        } else if (item.to) {
            navigate(item.to);
            setMobileMenuOpen(false);
        } else {
            setMobileMenuOpen(false);
        }
    };

    const isActive = (item) => Boolean(item.to) && location.pathname === item.to;

    // Close CLICK OUTSIDE
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userRef.current && !userRef.current.contains(event.target)) setUserDropdown(false);
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-button')) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <>
            <header
                style={{
                    position: "sticky",
                    top: 36,
                    zIndex: 40,
                    background: "color-mix(in srgb, var(--color-bg) 92%, transparent)",
                    backdropFilter: "blur(8px)",
                    borderBottom: "1px solid var(--color-divider)",
                }}
            >
                <div
                    className="max-w-[1180px] mx-auto flex items-center gap-6 px-4 sm:px-6"
                    style={{ paddingTop: "var(--space-3)", paddingBottom: "var(--space-3)" }}
                >
                    {/* 1. LOGO */}
                    <RouterLink to="/" className="flex items-center gap-2 mr-auto">
                        <img src={Logo} alt="Logo" className="h-7 w-7 object-contain" />
                        <span
                            className="hidden sm:inline"
                            style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--font-heading-weight)", fontSize: 19, letterSpacing: "-0.01em" }}
                        >
                            {t("navbar.brand")}
                        </span>
                    </RouterLink>

                    {/* 2. DESKTOP MENU */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {navItems.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => handleNavClick(item)}
                                className={`pb-0.5 text-sm border-b transition-colors ${isActive(item)
                                        ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                                        : "border-transparent hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* 3. ACTIONS (Lang & User) */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Lang */}
                        <div className="seg">
                            {languages.map((lang) => (
                                <label key={lang.code} className="seg-opt">
                                    <input
                                        type="radio"
                                        name="lang"
                                        checked={currentLang === lang.code}
                                        onChange={() => changeLanguage(lang.code)}
                                    />
                                    {lang.label}
                                </label>
                            ))}
                        </div>

                        {/* User */}
                        {user ? (
                            <div className="relative" ref={userRef}>
                                <button onClick={() => setUserDropdown(!userDropdown)} className="btn btn-secondary btn-icon" aria-label={t("navbar.profile")}>
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="User" className="w-full h-full object-cover" style={{ borderRadius: "var(--radius-sm)" }} />
                                    ) : (
                                        <User size={18} style={{ color: "var(--color-accent)" }} />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {userDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 6 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-48"
                                            style={{ background: "var(--color-surface)", border: "1px solid var(--color-divider)", borderRadius: "var(--radius-md)", padding: "var(--space-1)" }}
                                        >
                                            <RouterLink to="/profile" onClick={() => setUserDropdown(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:text-[var(--color-accent)]">
                                                <User size={14} /> {t("navbar.profile")}
                                            </RouterLink>
                                            <button onClick={() => { logout(); setUserDropdown(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:text-[var(--color-accent)]">
                                                <LogOut size={14} /> {t("navbar.logout")}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <RouterLink to="/login" className="btn btn-primary">
                                {t("navbar.login")}
                            </RouterLink>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="lg:hidden mobile-menu-button btn btn-icon" onClick={() => setMobileMenuOpen(true)} aria-label="Menu">
                        <Menu size={24} />
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        ref={mobileMenuRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8"
                        style={{ background: "var(--color-bg)" }}
                    >
                        <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 btn btn-icon" aria-label="Close">
                            <X size={24} />
                        </button>

                        <div className="flex flex-col items-center gap-6">
                            {navItems.map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => handleNavClick(item)}
                                    style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--font-heading-weight)", fontSize: 28 }}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Actions */}
                        <div className="flex flex-col gap-6 items-center w-full px-8 max-w-xs">
                            {/* Language Switcher */}
                            <div className="seg">
                                {languages.map((lang) => (
                                    <label key={lang.code} className="seg-opt">
                                        <input
                                            type="radio"
                                            name="lang-mobile"
                                            checked={currentLang === lang.code}
                                            onChange={() => { changeLanguage(lang.code); }}
                                        />
                                        {lang.label}
                                    </label>
                                ))}
                            </div>

                            {/* User Actions */}
                            {user ? (
                                <div className="flex flex-col gap-3 w-full items-center">
                                    <RouterLink to="/profile" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-block">
                                        <User size={18} /> {t("navbar.profile")}
                                    </RouterLink>
                                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="btn btn-block">
                                        <LogOut size={18} /> {t("navbar.logout")}
                                    </button>
                                </div>
                            ) : (
                                <RouterLink to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-block">
                                    {t("navbar.login")}
                                </RouterLink>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
