import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { mockCategories, isMockMode } from "@/lib/mock-data";
import { BookOpen, LogOut, Settings, User } from "lucide-react";

export default async function Navbar() {
  if (isMockMode) {
    return (
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <BookOpen className="w-5 h-5 text-brand-600" />
            <span>闲书库</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-md hover:bg-stone-100 transition"
            >
              全部
            </Link>
            {mockCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="px-3 py-1.5 rounded-md hover:bg-stone-100 transition"
              >
                {c.name}
              </Link>
            ))}
          </nav>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-md hover:bg-stone-100 transition"
            >
              登录
            </Link>
          </div>
        </div>
        <nav className="md:hidden flex items-center gap-1 px-4 pb-2 text-sm overflow-x-auto">
          <Link href="/" className="px-2 py-1 whitespace-nowrap">
            全部
          </Link>
          {mockCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="px-2 py-1 whitespace-nowrap"
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </header>
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isAdmin = false;
  let username: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin, username")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.is_admin ?? false;
    username = profile?.username ?? null;
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("name, slug")
    .order("name");

  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <BookOpen className="w-5 h-5 text-brand-600" />
          <span>闲书库</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-md hover:bg-stone-100 transition"
          >
            全部
          </Link>
          {categories?.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="px-3 py-1.5 rounded-md hover:bg-stone-100 transition"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {user ? (
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-stone-100 transition"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">后台</span>
              </Link>
            )}
            <span className="flex items-center gap-1 text-sm text-stone-600">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{username ?? "用户"}</span>
            </span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="p-1.5 rounded-md hover:bg-stone-100 transition text-stone-500"
                title="退出登录"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-md hover:bg-stone-100 transition"
            >
              登录
            </Link>
          </div>
        )}
      </div>

      <nav className="md:hidden flex items-center gap-1 px-4 pb-2 text-sm overflow-x-auto">
        <Link href="/" className="px-2 py-1 whitespace-nowrap">
          全部
        </Link>
        {categories?.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="px-2 py-1 whitespace-nowrap"
          >
            {c.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
