import { useRef, useEffect } from "react";

export default function TestModeBanner() {
    return (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-amber-700 to-red-700 text-white h-8 flex items-center overflow-hidden shadow-md">
            <div className="whitespace-nowrap animate-marquee-rl text-sm font-semibold tracking-wide w-full px-4">
                Diqqat! Ushbu elektron kutubxona platformasi hozirda test rejimida ishlamoqda. Taklif va mulohazalaringizni mamnuniyat bilan qabul qilamiz. 🛠️
            </div>
            <style jsx>{`
                @keyframes marquee-rl {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee-rl {
                    display: inline-block;
                    animation: marquee-rl 30s linear infinite;
                    padding-left: 100%; /* Ensure it starts off-screen */
                }
            `}</style>
        </div>
    );
}
