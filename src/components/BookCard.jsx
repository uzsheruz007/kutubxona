import { useState } from "react";
import { Link } from "react-router-dom";

export default function BookCard({
  title,
  author,
  coverUrl,
  id,
  category,
  meta,
  variant = "grid",
}) {
  const fallbackCover = "/images/no-image.png";
  const validCoverUrl = coverUrl || fallbackCover;
  const [imgSrc, setImgSrc] = useState(validCoverUrl);

  const cover = (
    <div
      className="plate shrink-0"
      style={{
        width: variant === "row" ? 86 : "100%",
        aspectRatio: "2 / 3",
        backgroundColor: "var(--color-neutral-100)",
        overflow: "hidden",
      }}
    >
      <img
        src={imgSrc}
        alt={title}
        onError={() => setImgSrc(fallbackCover)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );

  if (variant === "row") {
    return (
      <Link
        to={`/book/${id}`}
        className="flex gap-3 p-3 no-underline"
        style={{ border: "1px solid var(--color-divider)", borderRadius: "var(--radius-md)", color: "inherit" }}
      >
        {cover}
        <div className="flex flex-col gap-1 min-w-0">
          {category && <span className="card-kicker">{category}</span>}
          <span className="card-title line-clamp-2">{title}</span>
          <span style={{ fontSize: 12, fontStyle: "italic", color: "color-mix(in srgb, var(--color-text) 55%, transparent)" }}>
            {author}
          </span>
          {meta && (
            <span className="num mt-auto" style={{ fontSize: 11, color: "color-mix(in srgb, var(--color-text) 45%, transparent)" }}>
              {meta}
            </span>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/book/${id}`} className="flex flex-col gap-2 no-underline" style={{ color: "inherit" }}>
      {cover}
      <div>
        <div
          className="line-clamp-2"
          style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--font-heading-weight)", fontSize: 17, lineHeight: 1.2 }}
        >
          {title}
        </div>
        <div style={{ fontSize: 12, fontStyle: "italic", color: "color-mix(in srgb, var(--color-text) 55%, transparent)" }}>
          {author}
        </div>
      </div>
    </Link>
  );
}
