import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function Pagination({ totalItems, itemsPerPage = 18 }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get("category") || "Barchasi";
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page) => {
    setSearchParams({
      category: currentCategory,
      page: page.toString(),
    });
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      {/* Oldingi */}
      <button
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        className="btn btn-secondary btn-icon"
        aria-label="Oldingi"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Sahifa hisoblagichi */}
      <span className="num text-sm" style={{ color: "var(--color-accent)" }}>
        {currentPage} / {totalPages}
      </span>

      {/* Keyingi */}
      <button
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="btn btn-secondary btn-icon"
        aria-label="Keyingi"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
