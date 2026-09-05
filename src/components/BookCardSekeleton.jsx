export default function BookCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="plate"
        style={{
          width: "100%",
          aspectRatio: "2 / 3",
          background: "linear-gradient(90deg, var(--color-neutral-200) 25%, var(--color-neutral-100) 50%, var(--color-neutral-200) 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
      <div style={{ height: 14, width: "85%", background: "var(--color-neutral-200)" }} />
      <div style={{ height: 11, width: "55%", background: "var(--color-neutral-200)" }} />

      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
    </div>
  );
}
