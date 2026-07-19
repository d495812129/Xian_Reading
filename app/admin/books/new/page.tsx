import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BookForm from "@/components/BookForm";

export default async function NewBookPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/admin/books/new");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) redirect("/");

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        返回后台
      </Link>
      <h1 className="text-2xl font-bold mb-6">添加书籍</h1>
      <BookForm categories={categories ?? []} />
    </div>
  );
}
