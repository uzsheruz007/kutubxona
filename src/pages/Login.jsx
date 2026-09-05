import { useState } from "react";
import Logo from '../assets/Logo.png';
import { useUser } from "../context/UserContext";
import { Loader } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function Login() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const { getHemisAuthUrl } = useUser();
    const [error, setError] = useState("");

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
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center" style={{ paddingTop: "calc(var(--space-8) * 2.6)", paddingBottom: "var(--space-8)" }}>
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md mx-4"
                    style={{
                        border: "1px solid var(--color-divider)",
                        background: "var(--color-surface)",
                        borderRadius: "var(--radius-lg)",
                        padding: "var(--space-6)",
                    }}
                >
                    <div className="flex flex-col items-center" style={{ marginBottom: "var(--space-6)" }}>
                        <div
                            style={{
                                width: 72, height: 72, borderRadius: "50%",
                                border: "1px solid var(--color-divider)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginBottom: "var(--space-3)",
                            }}
                        >
                            <img src={Logo} alt="University Logo" style={{ height: 40, width: "auto" }} />
                        </div>
                        <h2 style={{ fontWeight: 400, textAlign: "center" }}>
                            {t("loginPage.title")}
                        </h2>
                        <p className="text-muted" style={{ fontSize: 13, textAlign: "center" }}>
                            {t("loginPage.subtitle")}
                        </p>
                    </div>

                    {error && (
                        <div
                            style={{
                                background: "var(--color-accent-100)",
                                color: "var(--color-accent-800)",
                                border: "1px solid var(--color-accent)",
                                borderRadius: "var(--radius-md)",
                                padding: "var(--space-2) var(--space-3)",
                                fontSize: 13,
                                marginBottom: "var(--space-4)",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        onClick={() => handleHemisLogin('student')}
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? <Loader size={16} className="animate-spin" /> : "Talabalar uchun kirish"}
                    </button>

                    <button
                        onClick={() => handleHemisLogin('staff')}
                        className="btn btn-secondary btn-block"
                        disabled={loading}
                    >
                        {loading ? <Loader size={16} className="animate-spin" /> : "Xodimlar uchun kirish"}
                    </button>

                    <p className="text-muted text-center" style={{ fontSize: 12, marginTop: "var(--space-4)" }}>
                        Talaba yoki Xodim ekanligingizga qarab mos tugmani tanlang.
                    </p>

                    <hr className="hr" />

                    <p className="text-muted text-center" style={{ fontSize: 11 }}>
                        {t("footer.rights")}
                    </p>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
