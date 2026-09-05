import { Mail, MapPin, ChevronUp } from "lucide-react";
import { FaFacebook, FaTelegram, FaInstagram, FaYoutube } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Logo from "../assets/Logo.png";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useTranslation();

  const socialLinks = [
    { name: "Telegram", icon: FaTelegram, url: "https://t.me/samdu_urgut_filial" },
    { name: "Instagram", icon: FaInstagram, url: "https://www.instagram.com/samduuf_edu?igsh=MWF5bWhvZ3ZhbTI5ZA%3D%3D&utm_source=qr" },
    { name: "Facebook", icon: FaFacebook, url: "https://www.facebook.com/samduufeduuz" },
    { name: "YouTube", icon: FaYoutube, url: "https://www.youtube.com/@samduufeducation7037" },
  ];

  return (
    <footer style={{ borderTop: "1px solid var(--color-divider)", background: "var(--color-bg)" }} className="pt-12 pb-8">
      <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

        {/* Brand Column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={Logo} alt="Logo" className="h-7 w-7 object-contain" />
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--font-heading-weight)", fontSize: 18 }}>
              {t("footer.brand")}
            </span>
          </div>
          <p className="text-sm text-muted mb-4">
            {t("footer.p")}
          </p>
          <div className="flex gap-2">
            {socialLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-icon"
                aria-label={item.name}
              >
                <item.icon size={16} style={{ color: "var(--color-accent)" }} />
              </a>
            ))}
          </div>
        </div>

        {/* Social / Links */}
        <div>
          <h6 className="mb-4">{t("footer.socialMedia", "Ijtimoiy Tarmoqlar")}</h6>
          <ul className="space-y-2">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-[var(--color-accent)] transition-colors"
                  style={{ color: "inherit" }}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h6 className="mb-4">{t("footer.contactUs")}</h6>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <MapPin size={16} style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: 2 }} />
              <span className="text-sm text-muted">{t("footer.address")}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
              <a href="mailto:devonxona@samduuf.uz" className="text-sm text-muted hover:text-[var(--color-accent)] transition-colors">devonxona@samduuf.uz</a>
            </li>
          </ul>
        </div>

        {/* Map */}
        <div>
          <h6 className="mb-4">{t("footer.ourAddress")}</h6>
          <div style={{ height: 160, border: "1px solid var(--color-divider)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <iframe
              title="SamDPI manzili"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3082.136143652394!2d67.17281889007441!3d39.42104574246436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f4cc5b64e13e317%3A0x8d93018fdf14d8c3!2sSharof%20Rashidov%20nomidagi%20Samarqand%20davlat%20universiteti%20Urgut%20filiali!5e0!3m2!1sen!2sus!4v1750918084719!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(60%)" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <hr className="hr max-w-[1180px] mx-auto" />

      <div className="max-w-[1180px] mx-auto px-6 pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted">
        <p>© {year} {t("brand.name", "SamDPI Kutubxonasi")}. Barcha huquqlar himoyalangan.</p>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="btn btn-ghost"
        >
          {t("footer.up")} <ChevronUp size={14} />
        </button>
      </div>
    </footer>
  );
}
