import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TodayReading() {
  const { t } = useTranslation();

  const scrollToReader = () => {
    document.getElementById("reader")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 style={{ marginBottom: "var(--space-4)" }}>{t("todayReading.title")}</h2>
        <div className="flex gap-4">
          <div
            className="plate shrink-0"
            style={{ width: 130, aspectRatio: "2 / 3", background: "var(--color-neutral-100)" }}
          />
          <div>
            <span className="tag tag-outline">{t("categories.adabiyotlar")}</span>
            <h3 style={{ margin: "var(--space-2) 0 2px" }}>O'tkan kunlar</h3>
            <p
              style={{
                margin: "0 0 var(--space-3)",
                fontStyle: "italic",
                fontSize: 13,
                color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
              }}
            >
              Abdulla Qodiriy · 1926
            </p>
            <p style={{ margin: "0 0 var(--space-3)", fontSize: 13, textAlign: "justify" }}>
              O'zbek tilida yozilgan birinchi roman. Otabek va Kumush taqdiri orqali XIX asr oxiri jamiyati tasvirlanadi.
            </p>
            <button className="btn btn-primary" onClick={scrollToReader}>
              <BookOpen size={15} />
              {t("todayReading.cta")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
