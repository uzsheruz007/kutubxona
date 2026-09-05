import { useState } from "react";
import Logo from '../../assets/Logo.png';
import { useUser } from "../../context/UserContext";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--color-bg)" }}>
            <div className="card w-full max-w-md p-8" style={{ background: "var(--color-surface)" }}>
                <div className="flex flex-col items-center mb-6 text-center">
                    <img src={Logo} alt="Logo" className="h-12 w-12 mb-4" />
                    <h1 className="text-xl">Admin panelga kirish</h1>
                    <p className="text-xs text-muted mt-2">Faqat administratorlar uchun</p>
                </div>

                {error && (
                    <div
                        className="text-sm p-3 mb-4"
                        style={{ borderRadius: "var(--radius-md)", border: "1px solid #a13a2b", color: "#a13a2b" }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="field">
                        <label>Login</label>
                        <input
                            type="text"
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="field">
                        <label>Parol</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-primary btn-block">
                        {loading && <Loader className="w-4 h-4 animate-spin" />}
                        Kirish
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button onClick={() => navigate("/")} className="btn btn-ghost" style={{ color: "var(--color-text)" }}>
                        Bosh sahifaga qaytish
                    </button>
                </div>
            </div>
        </div>
    );
}
