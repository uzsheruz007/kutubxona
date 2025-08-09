import { useState, useEffect, useRef } from "react";
import { Menu, X, Globe, LogIn, LogOut, ChevronDown } from "lucide-react";
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
    
    const langRef = useRef(null);
    const userRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const currentLang = i18n.language || "uz";

    // Navigation items for consistent rendering
    const navItems = [
        { key: "home", to: "/", label: t("navbar.home") },
        { key: "stats", scrollTo: "stats", label: t("navbar.statistics") },
        { key: "news", scrollTo: "news", label: t("navbar.news") },
        { key: "contact", scrollTo: "contact", label: t("navbar.contact") },
        { key: "books", to: "/books", label: t("navbar.books") },
    ];

    const handleSectionClick = (sectionId) => {
        if (location.pathname !== "/") {
            navigate("/", { replace: false });
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    scroll.scrollTo(element.offsetTop - 80, {
                        smooth: true,
                        duration: 600,
                    });
                }
            }, 50);
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                scroll.scrollTo(element.offsetTop - 80, {
                    smooth: true,
                    duration: 600,
                });
            }
        }
        setMobileMenuOpen(false);
    };

    const handleNavClick = (item) => {
        if (item.scrollTo) {
            handleSectionClick(item.scrollTo);
        } else {
            setMobileMenuOpen(false);
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (langRef.current && !langRef.current.contains(event.target)) {
                setLangDropdown(false);
            }
            if (userRef.current && !userRef.current.contains(event.target)) {
                setUserDropdown(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
                !event.target.closest('.mobile-menu-button')) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setMobileMenuOpen(false);
                setLangDropdown(false);
                setUserDropdown(false);
            }
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setLangDropdown(false);
    };

    const handleLogout = () => {
        logout();
        setUserDropdown(false);
        setMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    {/* Logo */}
                    <RouterLink to="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                        <img src={Logo} alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 object-contain" />
                        <span className="font-bold text-blue-700 text-base sm:text-lg lg:text-xl truncate">
                            {t("navbar.brand")}
                        </span>
                    </RouterLink>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
                        {navItems.map((item) => (
                            <PremiumNavLink
                                key={item.key}
                                to={item.to}
                                scrollTo={item.scrollTo}
                            >
                                {item.label}
                            </PremiumNavLink>
                        ))}
                    </div>

                    {/* Right Side - Desktop */}
                    <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
                        {/* Language Dropdown */}
                        <div className="relative" ref={langRef}>
                            <button
                                onClick={() => setLangDropdown(!langDropdown)}
                                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-all duration-200 text-sm"
                            >
                                <Globe size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span className="font-medium uppercase text-xs sm:text-sm">{currentLang}</span>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${langDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <AnimatePresence>
                                {langDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => changeLanguage(lang.code)}
                                                className={`flex items-center w-full px-4 py-3 text-sm hover:bg-blue-50 transition-colors duration-150 ${
                                                    currentLang === lang.code
                                                        ? "bg-blue-100 text-blue-700 font-semibold"
                                                        : "text-gray-700"
                                                }`}
                                            >
                                                <span className="mr-3">{lang.flag}</span>
                                                {lang.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* User Section */}
                        {user ? (
                            <div className="relative" ref={userRef}>
                                <button
                                    onClick={() => setUserDropdown(!userDropdown)}
                                    className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-all duration-200"
                                >
                                    <img
                                        src={user.avatar || "/images/avatar-placeholder.png"}
                                        alt="Avatar"
                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-gray-200"
                                    />
                                    <span className="hidden lg:inline font-medium text-sm truncate max-w-24 xl:max-w-32">
                                        {user.name}
                                    </span>
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${userDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {userDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                                        >
                                            <RouterLink
                                                to="/profile"
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150"
                                                onClick={() => setUserDropdown(false)}
                                            >
                                                <img
                                                    src={user.avatar || "/images/avatar-placeholder.png"}
                                                    alt="Avatar"
                                                    className="w-6 h-6 rounded-full object-cover mr-3"
                                                />
                                                {t("navbar.profile", "Profile")}
                                            </RouterLink>
                                            <hr className="border-gray-200" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                                            >
                                                <LogOut size={16} className="mr-3" />
                                                {t("navbar.logout")}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <RouterLink
                                to="/login"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 text-sm font-medium"
                            >
                                <LogIn size={16} />
                                <span className="hidden lg:inline">{t("navbar.login")}</span>
                            </RouterLink>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden mobile-menu-button text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 -mr-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Background Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Menu Drawer */}
                        <motion.div
                            ref={mobileMenuRef}
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 w-80 max-w-[85vw] h-screen bg-white shadow-2xl z-50 md:hidden border-l border-gray-200"
                            style={{ height: '100vh', height: '100dvh' }}
                        >
                            <div className="flex flex-col h-full min-h-screen">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white flex-shrink-0">
                                    <div className="flex items-center space-x-3">
                                        <img src={Logo} alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
                                        <span className="font-bold text-blue-700 text-base sm:text-lg">
                                            {t("navbar.brand")}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X size={22} />
                                    </button>
                                </div>

                                {/* Navigation Items - Scrollable Middle Section */}
                                <div className="flex-1 overflow-y-auto bg-white">
                                    <div className="p-4 sm:p-6 space-y-2">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                            {t("navbar.navigation", "Navigation")}
                                        </h3>
                                        {navItems.map((item) => (
                                            <div key={item.key}>
                                                {item.scrollTo ? (
                                                    <button
                                                        onClick={() => handleNavClick(item)}
                                                        className="flex items-center w-full px-4 py-4 text-left text-gray-800 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 text-base"
                                                    >
                                                        {item.label}
                                                    </button>
                                                ) : (
                                                    <RouterLink
                                                        to={item.to}
                                                        className="flex items-center px-4 py-4 text-gray-800 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 text-base"
                                                        onClick={() => handleNavClick(item)}
                                                    >
                                                        {item.label}
                                                    </RouterLink>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Language Selection - Mobile */}
                                    <div className="px-4 sm:px-6 py-4 border-t border-gray-100">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                            {t("navbar.language", "Language")}
                                        </h3>
                                        <div className="space-y-2">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => changeLanguage(lang.code)}
                                                    className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 text-base ${
                                                        currentLang === lang.code
                                                            ? "bg-blue-100 text-blue-700 font-semibold"
                                                            : "text-gray-700 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <span className="mr-3 text-xl">{lang.flag}</span>
                                                    {lang.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* User Section - Fixed Bottom */}
                                <div className="border-t border-gray-200 p-4 sm:p-6 bg-white flex-shrink-0">
                                    {user ? (
                                        <div className="space-y-3">
                                            <RouterLink
                                                to="/profile"
                                                className="flex items-center px-4 py-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <img
                                                    src={user.avatar || "/images/avatar-placeholder.png"}
                                                    alt="Avatar"
                                                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-gray-200"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900 text-base">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{t("navbar.viewProfile", "View Profile")}</div>
                                                </div>
                                            </RouterLink>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-4 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                                            >
                                                <LogOut size={22} className="mr-3" />
                                                <span className="text-base">{t("navbar.logout")}</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <RouterLink
                                            to="/login"
                                            className="flex items-center justify-center w-full px-4 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold text-base"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <LogIn size={22} className="mr-3" />
                                            {t("navbar.login")}
                                        </RouterLink>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}