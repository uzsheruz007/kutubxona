import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div
                className="num"
                style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 120, lineHeight: 1, color: "var(--color-accent)", opacity: 0.35 }}
            >
                404
            </div>

            <h1 style={{ fontWeight: 400 }} className="mt-4 mb-2">
                Sahifa topilmadi
            </h1>
            <p className="max-w-md text-muted">
                Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
            </p>

            <div className="flex gap-3 mt-6">
                <a href="/" className="btn btn-primary">
                    <Home size={16} /> Bosh sahifaga qaytish
                </a>

                <button onClick={() => window.history.back()} className="btn btn-secondary">
                    <ArrowLeft size={16} /> Orqaga qaytish
                </button>
            </div>
        </div>
    )
}
