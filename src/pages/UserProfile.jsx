import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { FiLogOut, FiHeart, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleLogout = () => {
        setUser(null);
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center mb-8">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-blue-100 shadow mb-4" />
                    ) : (
                        <FiUser size={64} className="text-gray-400 mb-4" />
                    )}
                    <h2 className="text-2xl font-bold text-blue-700 mb-1">{user.name}</h2>
                    <p className="text-gray-500 mb-4">{user.email}</p>
                    <button onClick={handleLogout} className="cursor-pointer flex items-center gap-2 px-5 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 font-semibold shadow transition">
                        <FiLogOut /> Chiqish
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-700">
                        <FiHeart className="text-pink-500" /> Sevimli kitoblar
                    </h3>
                    {user.favourites && user.favourites.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {user.favourites.map((book) => (
                                <Link
                                    to={`/book/${book.id}`}
                                    key={book.id}
                                    className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 shadow hover:shadow-lg transition flex gap-3 items-center" 
                                >
                                    <img src={book.coverUrl || "image/no-image.png"} alt={book.title} className="w-16 h-24 object-cover rounded-md shadow" />
                                    <div>
                                        <div className="font-bold text-blue-700 line-clamp-2">{book.title}</div>
                                        <div className="text-sm text-gray-500">{book.author}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-400 text-center py-8">
                            Sevimli kitoblar yo'q.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}