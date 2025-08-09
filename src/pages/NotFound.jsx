import { BookOpen, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="relative mb-8">
                    <div className="text-9xl font-bold text-blue-200 select-none">404</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-blue-600 animate-bounce" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Sahifa topilmadi
                </h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
                </p>

                <div className="space-y-4">
                    <a href="/" className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                    <Home className="w-5 h-5 mr-2" /> Bosh sahifaga qaytish
                    </a>

                    <button onClick={() => window.history.back()} className="inline-flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Orqaga qaytish
                    </button>
                </div>
                
            </div>
        </div>
    )
}