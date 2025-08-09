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

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-10 space-x-2">
      {/* Oldingi */}
      <button
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded disabled:opacity-50 flex items-center gap-1 text-sm"
      >
        <ChevronLeft size={16} />
        Oldingi
      </button>

      {/* Sahifa raqamlari */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-3 py-2 text-sm rounded transition font-medium ${
            page === currentPage
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Keyingi */}
      <button
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded disabled:opacity-50 flex items-center gap-1 text-sm"
      >
        Keyingi
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
