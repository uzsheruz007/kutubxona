import { Search, CloudDownload, BookOpen, Globe } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="relative py-16 bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold mb-12 text-gray-800">
          Kutubxonamizning Afzalliklari
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Feature */}
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full shadow hover:shadow-md transition duration-300">
              <Search size={36} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              Tezkor Qidiruv
            </h3>
            <p className="mt-2 text-gray-600 text-sm">
              Kutubxonamizda xohlagan kitobni soniyalarda toping.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-green-100 text-green-600 p-4 rounded-full shadow hover:shadow-md transition duration-300">
              <CloudDownload size={36} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              Yuklab olish
            </h3>
            <p className="mt-2 text-gray-600 text-sm">
              Kitoblarni bir klik bilan yuklab oling.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-yellow-100 text-yellow-600 p-4 rounded-full shadow hover:shadow-md transition duration-300">
              <BookOpen size={36} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              100,000+ Kitob
            </h3>
            <p className="mt-2 text-gray-600 text-sm">
              Cheksiz elektron kitoblar kutubxonasi.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-purple-100 text-purple-600 p-4 rounded-full shadow hover:shadow-md transition duration-300">
              <Globe size={36} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              24/7 Onlayn
            </h3>
            <p className="mt-2 text-gray-600 text-sm">
              Kutubxonamiz doimo siz uchun ochiq.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
