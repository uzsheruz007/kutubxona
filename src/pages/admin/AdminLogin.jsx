import { useState } from "react";
import Logo from '../../assets/Logo.png';
import { useUser } from "../../context/UserContext";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdminLogin() {
    const { login } = useUser();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await login(username, password);

        if (result.success) {
            navigate("/admin-panel");
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <img src={Logo} alt="Logo" className="h-12 w-12 mb-4" />
                    <h1 className="text-xl font-bold text-stone-900 border-b-2 border-amber-500 pb-1">Admin Panelga Kirish</h1>
                    <p className="text-xs text-stone-500 mt-2">Faqat administratorlar uchun</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-stone-700 block mb-1">Login</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-stone-700 block mb-1">Parol</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-stone-900 text-white font-bold rounded-lg hover:bg-black transition-colors flex justify-center items-center gap-2"
                    >
                        {loading && <Loader className="w-4 h-4 animate-spin" />}
                        Kirish
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button onClick={() => navigate("/")} className="text-sm text-stone-400 hover:text-stone-600">
                        Bosh sahifaga qaytish
                    </button>
                </div>
            </div>
        </div>
    );
}
