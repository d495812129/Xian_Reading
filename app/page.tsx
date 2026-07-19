import { createClient } from "@/lib/supabase/server";
import BookGrid from "@/components/BookGrid";
import Pagination from "@/components/Pagination";
import { mockBooks, isMockMode } from "@/lib/mock-data";

const PAGE_SIZE = 12;

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // 搜索关键字
  const q = searchParams.q?.toLowerCase().trim();

  if (isMockMode) {
    const filtered = q
      ? mockBooks.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q)
        )
      : mockBooks;

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const paged = filtered.slice(from, to + 1);

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded inline-block">
          预览模式 · 配置 Supabase 后显示真实数据
        </div>
        {q ? (
          <h1 className="text-2xl font-bold mb-6">
            搜索 &ldquo;{searchParams.q}&rdquo; 的结果
            <span className="text-base font-normal text-stone-500 ml-2">
              共 {total} 本
            </span>
          </h1>
        ) : (
          <h1 className="text-2xl font-bold mb-6">
            全部书籍
            <span className="text-base font-normal text-stone-500 ml-2">
              共 {total} 本
            </span>
          </h1>
        )}
        <BookGrid books={paged} />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          searchQuery={searchParams.q}
        />
      </div>
    );
  }

  const supabase = createClient();

  let query = supabase
    .from("books")
    .select("*, categories(*)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (searchParams.q) {
    query = query.or(
      `title.ilike.%${searchParams.q}%,author.ilike.%${searchParams.q}%`
    );
  }

  const { data: books, count } = await query.range(from, to);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {searchParams.q ? (
        <h1 className="text-2xl font-bold mb-6">
          搜索 &ldquo;{searchParams.q}&rdquo; 的结果
          <span className="text-base font-normal text-stone-500 ml-2">
            共 {total} 本
          </span>
        </h1>
      ) : (
        <h1 className="text-2xl font-bold mb-6">
          全部书籍
          <span className="text-base font-normal text-stone-500 ml-2">
            共 {total} 本
          </span>
        </h1>
      )}
      <BookGrid books={books ?? []} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        searchQuery={searchParams.q}
      />
    </div>
  );
}
