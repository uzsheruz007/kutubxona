export default function BookCardSkeleton() {
  return (
    <div className="group bg-white rounded-2xl shadow-sm transition-all duration-300 overflow-hidden relative">
      {/* Image Placeholder with Shimmer */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
        <div
          className="absolute inset-0 bg-gray-200 overflow-hidden rounded-xl"
          style={{
            background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />

        {/* Fake Category Badge */}
        <div className="absolute top-3 right-3">
          <div className="w-16 h-4 bg-gray-300 rounded-full shadow" />
        </div>
      </div>

      {/* Info Placeholder */}
      <div className="p-4 space-y-2">
        {/* Title Placeholder */}
        <div className="h-4 bg-gray-300 rounded w-5/6" />
        <div className="h-4 bg-gray-300 rounded w-3/4" />

        {/* Author Placeholder */}
        <div className="h-3 bg-gray-200 rounded w-1/2" />

        {/* Description Placeholder */}
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />

        {/* Button Placeholder */}
        <div className="h-8 bg-gray-300 rounded-full w-24 mt-4" />
      </div>

      {/* Inline Shimmer Animation */}
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      </style>
    </div>
  );
}
