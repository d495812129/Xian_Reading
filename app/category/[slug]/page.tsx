import { createClient } from "@/lib/supabase/server";
import BookGrid from "@/components/BookGrid";
import { notFound } from "next/navigation";
import { mockBooks, mockCategories, isMockMode } from "@/lib/mock-data";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  if (isMockMode) {
    const category = mockCategories.find((c) => c.slug === params.slug);
    if (!category) notFound();
    const books = mockBooks.filter((b) => b.category_id === category!.id);
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded inline-block">
          预览模式 · 配置 Supabase 后显示真实数据
        </div>
        <h1 className="text-2xl font-bold mb-6">{category!.name}</h1>
        <BookGrid books={books} />
      </div>
    );
  }

  const supabase = createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!category) notFound();

  const { data: books } = await supabase
    .from("books")
    .select("*, categories(*)")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{category.name}</h1>
      <BookGrid books={books ?? []} />
    </div>
  );
}
