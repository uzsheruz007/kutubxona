import { useState, useEffect, useRef } from "react";
import { Menu, X, Globe, LogIn, LogOut, ChevronDown, User } from "lucide-react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";
import PremiumNavLink from "./NavLink";
import Logo from "../assets/Logo.png";
import { useUser } from "../context/UserContext";
import { useTranslation } from "react-i18next";

const languages = [
    { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [langDropdown, setLangDropdown] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const { user, logout } = useUser();
    const location = useLocation();
    const navigate = useNavigate();

    // Scrolled state for visual changes
    const [isScrolled, setIsScrolled] = useState(false);

    const langRef = useRef(null);
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

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

    // Close CLICK OUTSIDE
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (langRef.current && !langRef.current.contains(event.target)) setLangDropdown(false);
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
        setLangDropdown(false);
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={`fixed left-0 right-0 z-50 mx-auto px-4 max-w-7xl transition-all duration-300 ${isScrolled ? "top-10" : "top-12"}`}
            >
                <div className={`
                    rounded-full border border-stone-200 backdrop-blur-xl
                    ${isScrolled ? "bg-white/90 py-2 shadow-sm" : "bg-white/70 py-3"}
                    transition-all duration-300 px-6 sm:px-8
                `}>
                    <div className="flex justify-between items-center">

                        {/* 1. LOGO */}
                        <RouterLink to="/" className="flex items-center gap-2 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-amber-600 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                                <img src={Logo} alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain relative z-10" />
                            </div>
                            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600 text-lg sm:text-xl tracking-tight hidden sm:block">
                                {t("navbar.brand")}
                            </span>
                        </RouterLink>

                        {/* 2. DESKTOP MENU */}
                        <div className="hidden lg:flex items-center gap-8 bg-stone-100/50 p-1 px-2 rounded-full border border-white/50 ring-1 ring-stone-200/50">
                            {navItems.map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => handleNavClick(item)}
                                    className="px-5 py-2 rounded-full text-sm font-medium text-stone-600 hover:text-amber-700 hover:bg-amber-50 transition-all shadow-sm hover:shadow-orange-100/50"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* 3. ACTIONS (Lang & User) */}
                        <div className="hidden md:flex items-center gap-3">
                            {/* Lang */}
                            <div className="relative" ref={langRef}>
                                <button
                                    onClick={() => setLangDropdown(!langDropdown)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-50 hover:bg-amber-50 text-stone-700 transition hover:scale-105 border border-stone-200"
                                >
                                    <Globe size={18} className="text-amber-600" />
                                </button>
                                <AnimatePresence>
                                    {langDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                            className="absolute right-0 mt-3 w-40 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden p-1 ring-1 ring-stone-900/5"
                                        >
                                            {languages.map(lang => (
                                                <button key={lang.code} onClick={() => changeLanguage(lang.code)} className={`w-full text-left px-3 py-2 rounded-xl text-sm ${currentLang === lang.code ? "bg-amber-100 text-amber-700" : "hover:bg-stone-50 text-stone-700"}`}>
                                                    <span className="mr-2">{lang.flag}</span> {lang.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* User */}
                            {user ? (
                                <div className="relative" ref={userRef}>
                                    <button onClick={() => setUserDropdown(!userDropdown)} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-gradient-to-r from-stone-50 to-amber-50 border border-stone-200 hover:shadow-lg transition">
                                        <div className="w-8 h-8 rounded-full bg-white border-2 border-amber-100 flex items-center justify-center shadow-sm overflow-hidden">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={18} className="text-amber-500" />
                                            )}
                                        </div>
                                        <span className="text-sm font-semibold text-stone-800 max-w-[80px] truncate">{user.first_name || user.username}</span>
                                    </button>
                                    {/* User Dropdown (Simplified) */}
                                    <AnimatePresence>
                                        {userDropdown && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 ring-1 ring-stone-900/5">
                                                <RouterLink to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-50 text-stone-700 text-sm">
                                                    <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center">
                                                        <User size={14} className="text-amber-500" />
                                                    </div>
                                                    Profile
                                                </RouterLink>
                                                <button onClick={() => { logout(); setUserDropdown(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 text-sm mt-1">
                                                    <LogOut size={16} /> Chiqish
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <RouterLink to="/login" className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold text-sm shadow-lg shadow-amber-500/30 hover:shadow-amber-600/40 hover:scale-105 transition-all active:scale-95">
                                    {t("navbar.login")}
                                </RouterLink>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <button className="md:hidden p-2 text-gray-600 hover:text-amber-600 mobile-menu-button" onClick={() => setMobileMenuOpen(true)}>
                            <Menu size={28} />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8"
                    >
                        <button onClick={() => setMobileMenuOpen(false)} className="absolute top-8 right-8 p-2 bg-gray-100 rounded-full text-gray-500 hover:text-red-500">
                            <X size={32} />
                        </button>

                        <div className="flex flex-col items-center gap-6">
                            {navItems.map((item) => (
                                <button key={item.key} onClick={() => handleNavClick(item)} className="text-2xl font-bold text-gray-800 hover:text-amber-600">
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Actions */}
                        <div className="flex flex-col gap-6 items-center w-full px-8">
                            {/* Language Switcher */}
                            <div className="flex gap-4 p-1 bg-stone-100/50 rounded-xl">
                                {languages.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => { changeLanguage(lang.code); setMobileMenuOpen(false); }}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${currentLang === lang.code ? "bg-white shadow-sm text-amber-600 font-bold" : "text-stone-500"}`}
                                    >
                                        <span className="mr-1">{lang.flag}</span> {lang.code.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            {/* User Actions */}
                            {user ? (
                                <div className="flex flex-col gap-4 w-full items-center">
                                    <RouterLink to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-6 py-3 bg-stone-50 rounded-2xl w-full justify-center hover:bg-amber-50 transition border border-stone-100">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full object-cover border border-amber-200" />
                                        ) : (
                                            <User size={20} className="text-amber-500" />
                                        )}
                                        <span className="font-semibold text-stone-700">{t("navbar.profile")}</span>
                                    </RouterLink>
                                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-red-500 font-semibold flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-xl transition">
                                        <LogOut size={18} /> {t("navbar.logout")}
                                    </button>
                                </div>
                            ) : (
                                <RouterLink to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-lg shadow-xl shadow-amber-200">
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