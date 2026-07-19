import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, BookMarked, User as UserIcon } from "lucide-react";
import { mockBooks, isMockMode } from "@/lib/mock-data";

export default async function BookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (isMockMode) {
    const book = mockBooks.find((b) => b.id === params.id);
    if (!book) notFound();
    return <BookDetailContent book={book!} mock />;
  }

  const supabase = createClient();

  const { data: book } = await supabase
    .from("books")
    .select("*, categories(*)")
    .eq("id", params.id)
    .single();

  if (!book) notFound();

  return <BookDetailContent book={book} />;
}

function BookDetailContent({
  book,
  mock = false,
}: {
  book: any;
  mock?: boolean;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {mock && (
        <div className="mb-4 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded inline-block">
          预览模式 · 配置 Supabase 后显示真实数据
        </div>
      )}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        返回
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-48 md:w-56 flex-shrink-0">
          <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-100 shadow-md">
            {book.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="cover-placeholder w-full h-full flex flex-col items-center justify-center text-stone-500 p-4 text-center">
                <BookMarked className="w-12 h-12 mb-3" />
                <span className="text-sm">{book.title}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-3">{book.title}</h1>

          <div className="flex items-center gap-4 text-sm text-stone-600 mb-4">
            <span className="flex items-center gap-1">
              <UserIcon className="w-4 h-4" />
              {book.author}
            </span>
            {book.categories && (
              <Link
                href={`/category/${book.categories.slug}`}
                className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 transition"
              >
                {book.categories.name}
              </Link>
            )}
          </div>

          {book.description && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-stone-500 mb-2">简介</h2>
              <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
                {book.description}
              </p>
            </div>
          )}

          <div className="border border-stone-200 rounded-lg p-4 bg-white">
            <h2 className="flex items-center gap-2 font-medium mb-3">
              <Download className="w-5 h-5 text-brand-600" />
              下载地址
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-stone-500">网盘链接：</span>
                <a
                  href={book.pan_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 hover:underline break-all"
                >
                  {book.pan_link}
                </a>
              </div>
              {book.pan_password && (
                <div>
                  <span className="text-stone-500">提取码：</span>
                  <code className="px-2 py-0.5 bg-stone-100 rounded font-mono">
                    {book.pan_password}
                  </code>
                </div>
              )}
            </div>
            <a
              href={book.pan_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition text-sm"
            >
              <Download className="w-4 h-4" />
              前往网盘下载
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
