import { useState } from "react";
import Logo from '../assets/Logo.png';
import { useUser } from "../context/UserContext";
import { Loader } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const { getHemisAuthUrl, login } = useUser();
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleHemisLogin = async (userType) => {
        setLoading(true);
        setError("");
        const url = await getHemisAuthUrl(userType);
        if (url) {
            window.location.href = url;
        } else {
            setError("Hemis tizimiga ulanishda xatolik bo'ldi.");
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <Navbar />

            <main className="flex-grow flex items-center justify-center relative overflow-hidden pt-36 pb-20 px-4">
                {/* Atmospheric Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/2"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl w-full max-w-md border border-white/50 p-8 md:p-10"
                >
                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-amber-100"
                        >
                            <img src={Logo} alt="University Logo" className="h-12 w-auto" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-stone-900 font-serif text-center">
                            {t("loginPage.title")}
                        </h2>
                        <p className="text-stone-500 text-sm mt-2 text-center">
                            {t("loginPage.subtitle")}
                        </p>
                    </div>

                    <div className="space-y-5">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100 flex items-center gap-2"
                            >
                                <span className="block w-1.5 h-1.5 bg-red-500 rounded-full" />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleHemisLogin('student')}
                                className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-bold shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 flex items-center justify-center gap-3 group relative overflow-hidden"
                                disabled={loading}
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                {loading ? (
                                    <Loader className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span className="text-xl group-hover:scale-110 transition-transform">🎓</span>
                                        <span>Talabalar uchun kirish</span>
                                    </>
                                )}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleHemisLogin('staff')}
                                className="w-full py-4 bg-white hover:bg-stone-50 text-stone-700 border-2 border-stone-100 hover:border-stone-200 rounded-xl font-bold shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 group"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader className="w-5 h-5 animate-spin text-stone-400" />
                                ) : (
                                    <>
                                        <span className="text-xl group-hover:scale-110 transition-transform">💼</span>
                                        <span>Xodimlar uchun kirish</span>
                                    </>
                                )}
                            </motion.button>
                        </div>

                        <p className="text-xs text-stone-400 text-center px-4 mt-4">
                            Talaba yoki Xodim ekanligingizga qarab mos tugmani tanlang.
                        </p>

                    </div>



                    <div className="mt-8 pt-6 border-t border-stone-100 text-center">
                        <p className="text-xs text-stone-400">
                            {t("footer.rights")}
                        </p>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}