import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Edit3, Trash2 } from "lucide-react";
import DeleteBookButton from "@/components/DeleteBookButton";

export default async function AdminPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold mb-2">无权访问</h1>
        <p className="text-stone-500">你不是管理员</p>
      </div>
    );
  }

  const { data: books } = await supabase
    .from("books")
    .select("*, categories(*)")
    .order("created_at", { ascending: false });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">后台管理</h1>
        <Link
          href="/admin/books/new"
          className="inline-flex items-center gap-1 px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition text-sm"
        >
          <Plus className="w-4 h-4" />
          添加书籍
        </Link>
      </div>

      {/* 分类管理入口 */}
      <div className="mb-6">
        <Link
          href="/admin/categories"
          className="text-sm text-brand-600 hover:underline"
        >
          管理分类 →
        </Link>
      </div>

      {/* 书籍列表表格 */}
      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium">书名</th>
              <th className="text-left px-4 py-3 font-medium">作者</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                分类
              </th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                网盘链接
              </th>
              <th className="text-right px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {books && books.length > 0 ? (
              books.map((book) => (
                <tr
                  key={book.id}
                  className="border-b border-stone-100 hover:bg-stone-50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {book.cover_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={book.cover_url}
                          alt=""
                          className="w-8 h-10 object-cover rounded"
                        />
                      )}
                      <Link
                        href={`/book/${book.id}`}
                        className="font-medium hover:text-brand-600"
                      >
                        {book.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{book.author}</td>
                  <td className="px-4 py-3 text-stone-600 hidden md:table-cell">
                    {book.categories?.name ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-stone-500 hidden md:table-cell">
                    <span className="text-xs">
                      {book.pan_link ? "已设置" : "未设置"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/books/${book.id}/edit`}
                        className="p-1.5 rounded hover:bg-stone-200 transition text-stone-600"
                        title="编辑"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <DeleteBookButton bookId={book.id} title={book.title} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-12 text-stone-400">
                  还没有书籍，点击右上角添加
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
