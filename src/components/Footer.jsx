import { Mail, MapPin, ChevronUp, BookOpen } from "lucide-react";
import { FaFacebook, FaTelegram, FaInstagram, FaYoutube } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useTranslation();

  const socialLinks = [
    { name: "Telegram", icon: FaTelegram, url: "https://t.me/samdu_urgut_filial", color: "hover:bg-blue-500" },
    { name: "Instagram", icon: FaInstagram, url: "https://www.instagram.com/samduuf_edu?igsh=MWF5bWhvZ3ZhbTI5ZA%3D%3D&utm_source=qr", color: "hover:bg-pink-600" },
    { name: "Facebook", icon: FaFacebook, url: "https://www.facebook.com/samduufeduuz", color: "hover:bg-blue-600" },
    { name: "YouTube", icon: FaYoutube, url: "https://www.youtube.com/@samduufeducation7037", color: "hover:bg-red-600" },
  ];

  return (
    <footer className="bg-stone-900 text-stone-300 pt-20 pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

        {/* Brand Column */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-600/20 p-2 rounded-lg border border-amber-500/30">
              <BookOpen className="text-amber-400 h-8 w-8" />
            </div>
            <span className="font-bold text-2xl text-white tracking-wide">{t("footer.brand")}</span>
          </div>
          <p className="leading-relaxed mb-6 text-sm text-stone-400">
            {t("footer.p")}
          </p>
          <div className="flex gap-4">
            {socialLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 ${item.color} hover:text-white transition-all duration-300 shadow-md`}
              >
                <item.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Social / Links */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">{t("footer.socialMedia", "Ijtimoiy Tarmoqlar")}</h4>
          <ul className="space-y-3">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">{t("footer.contactUs")}</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="mt-1 text-amber-500">
                <MapPin size={18} />
              </div>
              <span className="text-sm text-stone-400 leading-relaxed">{t("footer.address")}</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="text-amber-500">
                <Mail size={18} />
              </div>
              <a href="mailto:devonxona@samduuf.uz" className="text-sm text-stone-400 hover:text-white transition-colors">devonxona@samduuf.uz</a>
            </li>
          </ul>
        </div>

        {/* Map */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">{t("footer.ourAddress")}</h4>
          <div className="rounded-xl overflow-hidden border border-stone-700 shadow-lg h-48">
            <iframe
              title="SamDUUF manzili"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3082.136143652394!2d67.17281889007441!3d39.42104574246436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f4cc5b64e13e317%3A0x8d93018fdf14d8c3!2sSharof%20Rashidov%20nomidagi%20Samarqand%20davlat%20universiteti%20Urgut%20filiali!5e0!3m2!1sen!2sus!4v1750918084719!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(100%) invert(90%)" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone-500">
        <p>© {year} {t("brand.name", "SamDUUF Kutubxonasi")}. Barcha huquqlar himoyalangan.</p>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 text-stone-300 hover:bg-amber-600 hover:text-white transition-all duration-300"
        >
          <span className="font-bold text-xs">{t("footer.up")}</span>
          <ChevronUp size={14} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </footer>
  );
}