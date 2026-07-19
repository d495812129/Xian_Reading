import Link from "next/link";

export default function Pagination({
  currentPage,
  totalPages,
  searchQuery,
}: {
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
}) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    params.set("page", String(page));
    return `/?${params.toString()}`;
  };

  // 生成页码：当前页前后各2页，超出范围用省略号
  const pages: (number | "...")[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  const btnBase =
    "min-w-[36px] h-9 px-2 flex items-center justify-center rounded-md text-sm transition";
  const btnIdle =
    "border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900";
  const btnActive = "bg-brand-600 text-white border border-brand-600";
  const btnDisabled = "text-stone-300 cursor-not-allowed";

  return (
    <nav
      className="flex items-center justify-center gap-1.5 mt-10"
      aria-label="分页导航"
    >
      {/* 上一页 */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className={`${btnBase} ${btnIdle} gap-1`}
        >
          上一页
        </Link>
      ) : (
        <span className={`${btnBase} ${btnDisabled} gap-1`}>上一页</span>
      )}

      {/* 页码 */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`gap-${i}`} className="px-1 text-stone-400">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildUrl(p)}
            className={`${btnBase} ${p === currentPage ? btnActive : btnIdle}`}
          >
            {p}
          </Link>
        )
      )}

      {/* 下一页 */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className={`${btnBase} ${btnIdle} gap-1`}
        >
          下一页
        </Link>
      ) : (
        <span className={`${btnBase} ${btnDisabled} gap-1`}>下一页</span>
      )}
    </nav>
  );
}
