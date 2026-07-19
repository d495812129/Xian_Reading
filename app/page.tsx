import { createClient } from "@/lib/supabase/server";
import BookGrid from "@/components/BookGrid";
import { mockBooks, isMockMode } from "@/lib/mock-data";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  if (isMockMode) {
    const q = searchParams.q?.toLowerCase();
    const books = q
      ? mockBooks.filter(
          (b) =>
            b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
        )
      : mockBooks;
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded inline-block">
          预览模式 · 配置 Supabase 后显示真实数据
        </div>
        {searchParams.q ? (
          <h1 className="text-2xl font-bold mb-6">
            搜索 &ldquo;{searchParams.q}&rdquo; 的结果
          </h1>
        ) : (
          <h1 className="text-2xl font-bold mb-6">全部书籍</h1>
        )}
        <BookGrid books={books} />
      </div>
    );
  }

  const supabase = createClient();

  let query = supabase
    .from("books")
    .select("*, categories(*)")
    .order("created_at", { ascending: false });

  if (searchParams.q) {
    query = query.or(
      `title.ilike.%${searchParams.q}%,author.ilike.%${searchParams.q}%`
    );
  }

  const { data: books } = await query;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {searchParams.q ? (
        <h1 className="text-2xl font-bold mb-6">
          搜索 &ldquo;{searchParams.q}&rdquo; 的结果
        </h1>
      ) : (
        <h1 className="text-2xl font-bold mb-6">全部书籍</h1>
      )}
      <BookGrid books={books ?? []} />
    </div>
  );
}
