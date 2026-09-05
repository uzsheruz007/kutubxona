import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const getCategoryKey = (cat) => {
  const map = {
    "Yangilik": "news",
    "E'lon": "announcement",
    "Tadbir": "event",
    "Yangi": "new",
    "Texnik": "technical",
    "Xizmat": "service",
    "yangilik": "news",
    "e'lon": "announcement",
    "tadbir": "event",
    "yangi": "new",
    "texnik": "technical",
    "xizmat": "service",
  };
  return map[cat] || "news";
};

export default function NewsCard({
  id,
  title,
  description,
  image,
  date,
  category = "Yangilik",
  variant = "row",
}) {
  const { t, i18n } = useTranslation();

  const dateOptions = { day: "numeric", month: "long", year: "numeric" };
  const localeMap = { uz: "uz-UZ", ru: "ru-RU", en: "en-US" };
  const currentLocale = localeMap[i18n.language] || "uz-UZ";
  const formattedDate = date ? new Date(date).toLocaleDateString(currentLocale, dateOptions) : "";
  const categoryLabel = t(`news.categories.${getCategoryKey(category)}`, category);

  const plainDescription =
    typeof description === "string" ? description.replace(/<[^>]*>/g, "") : "";

  if (variant === "full") {
    return (
      <Link
        to={`/news/${id}`}
        className="grid gap-4 no-underline"
        style={{
          gridTemplateColumns: "1fr 200px",
          padding: "var(--space-4) 0",
          borderTop: "1px solid var(--color-divider)",
          color: "inherit",
        }}
      >
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
            <span className="num" style={{ fontSize: 11, color: "color-mix(in srgb, var(--color-text) 50%, transparent)" }}>
              {formattedDate}
            </span>
            <span
              style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-accent)" }}
            >
              {categoryLabel}
            </span>
          </div>
          <h3 style={{ margin: "0 0 var(--space-2)", maxWidth: "34ch" }}>{title}</h3>
          <p
            className="line-clamp-2"
            style={{ margin: 0, fontSize: 14, textAlign: "justify", color: "color-mix(in srgb, var(--color-text) 78%, transparent)" }}
          >
            {plainDescription}
          </p>
        </div>
        <div
          className="plate"
          style={{ aspectRatio: "4 / 3", background: "var(--color-neutral-100)", overflow: "hidden" }}
        >
          {image && (
            <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/news/${id}`}
      className="grid gap-3 no-underline"
      style={{
        gridTemplateColumns: "96px 1fr",
        padding: "var(--space-3) 0",
        borderBottom: "1px solid var(--color-divider)",
        color: "inherit",
      }}
    >
      <span className="num" style={{ fontSize: 11, color: "color-mix(in srgb, var(--color-text) 50%, transparent)", paddingTop: 5 }}>
        {formattedDate}
      </span>
      <div>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-heading)",
            fontWeight: "var(--font-heading-weight)",
            fontSize: 19,
            lineHeight: 1.2,
            marginBottom: 4,
          }}
        >
          {title}
        </span>
        <p
          className="line-clamp-2"
          style={{ margin: 0, fontSize: 13, textAlign: "justify", color: "color-mix(in srgb, var(--color-text) 78%, transparent)" }}
        >
          {plainDescription}
        </p>
      </div>
    </Link>
  );
}
