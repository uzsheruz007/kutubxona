import { Facebook, Twitter, Instagram, Mail, MapPin, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <>
      <footer className="relative bg-gradient-to-br from-blue-950 via-gray-900 to-blue-900 text-gray-100 pt-12 pb-6 overflow-hidden rounded-t-4xl">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo va brand */}
          <div className="flex flex-col items-start gap-3">
            <img src="/Logo.png" alt="logo" className="h-14 w-14 rounded bg-white p-1 shadow-lg" />
            <span className="font-bold text-xl tracking-wide text-blue-300 drop-shadow-lg">{t("footer.brand")}</span>
            <p className="text-gray-400 text-sm mt-2">{t("footer.p")}</p>
          </div>
          {/* Ijtimoiy tarmoqlar */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.socialMedia")}</h4>
            <div className="flex space-x-5">
              <a
                href="#"
                aria-label="Facebook"
                className="group p-2 rounded-full transition relative"
              >
                <Facebook size={28} className="transition group-hover:scale-110 group-hover:text-blue-400" />
                <span className="absolute inset-0 rounded-full blur-sm opacity-0 group-hover:opacity-80 group-hover:bg-blue-500 group-hover:animate-pulse transition"></span>
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="group p-2 rounded-full transition relative"
              >
                <Twitter size={28} className="transition group-hover:scale-110 group-hover:text-sky-400" />
                <span className="absolute inset-0 rounded-full blur-sm opacity-0 group-hover:opacity-80 group-hover:bg-sky-400 group-hover:animate-pulse transition"></span>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="group p-2 rounded-full transition relative"
              >
                <Instagram size={28} className="transition group-hover:scale-110 group-hover:text-pink-400" />
                <span className="absolute inset-0 rounded-full blur-sm opacity-0 group-hover:opacity-80 group-hover:bg-pink-500 group-hover:animate-pulse transition"></span>
              </a>
            </div>
          </div>
          {/* Bog‘lanish */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.contactUs")}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:devonxona@samduuf.uz" className="hover:underline text-blue-300">devonxona@samduuf.uz</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t("footer.address")}
              </li>
              <li>
                Tel: <a href="tel:+998936670389" className="hover:underline text-blue-300">+998 93 667 03 89</a>
              </li>
            </ul>
          </div>
          {/* Xarita joylashuvi */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.ourAddress")}</h4>
            <iframe
              title="SamDUUF manzili"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3082.136143652394!2d67.17281889007441!3d39.42104574246436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f4cc5b64e13e317%3A0x8d93018fdf14d8c3!2sSharof%20Rashidov%20nomidagi%20Samarqand%20davlat%20universiteti%20Urgut%20filiali!5e0!3m2!1sen!2sus!4v1750918084719!5m2!1sen!2sus"
              width="100%"
              height="150"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-md shadow"
            ></iframe>
          </div>
        </div>

        {/* Pastki qism */}
        <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-400 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 gap-2 relative">
          <span>© {year} {t("footer.rights")}</span>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-blue-300 transition">{t("footer.privacyPolicy")}</a>
            <a href="/about" className="hover:text-blue-300 transition">{t("footer.aboutUs")}</a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-800/60 hover:bg-blue-700/80 text-blue-200 hover:text-white shadow transition group"
              aria-label="Yuqoriga"
            >
              <ChevronUp className="w-5 h-5 group-hover:animate-bounce" />
              <span className="hidden sm:inline cursor-pointer">{t("footer.up")}</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}