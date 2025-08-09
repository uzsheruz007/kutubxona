import { useState } from "react";
import Logo from '../assets/Logo.png';
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export default function Login () {
    const [loading, setLoading] = useState(false);
    const { setUser } = useUser();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const username = e.target[0].value;
        const password = e.target[1].value;

        if (username === "student" && password === "123456") {
            setUser({
                name: "Student",
                email: "student@samduuf.uz",
                avatar: null,
                favourites: [],
            });
            setLoading(false);
            navigate('/');
        } else {
            setLoading(false);
            setError("Login yoki praol noto'g'ri!");
        }
    };

    const handleHemisLogin = () => {
        alert("Hemis orqali kirish hozircha mavjud emas!");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <img src={Logo} alt="University Logo" className="h-14 mb-2" />
                    <h2 className="text-2xl font-bold text-blue-700">Kutubxona tizimiga kirish</h2>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input 
                        type="text"
                        placeholder="login" 
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        required
                        autoFocus
                    />
                    <input 
                        type="password"
                        placeholder="parol"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400" 
                        required
                    />
                    {error && <div className="text-red-500 text-center">{error}</div>}
                    <button
                        type="submit"
                        className="w-full py-3 cursor-pointer bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        disabled={loading}
                    >
                        { loading ? "Kirish..." : "Kirish" }
                    </button>
                </form>
                <div className="my-6 text-center text-gray-500">yoki</div>
                <button onClick={handleHemisLogin} className="w-full cursor-pointer py-3 bg-gradient-to-r from-blue-700 to-blue-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:scale-105 transition">
                    Hemis orqali kirish
                </button>
            </div>
        </div>
    );
}