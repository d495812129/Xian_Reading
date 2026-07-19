"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";
import { Plus, Trash2, Loader2 } from "lucide-react";

export default function CategoryManager({
  categories,
}: {
  categories: Category[];
}) {
  const supabase = createClient();
  const [list, setList] = useState(categories);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function makeSlug(text: string) {
    // 简单转 slug：中文保留，空格转横线
    return text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u4e00-\u9fa5-]/g, "");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);

    const finalSlug = slug.trim() || makeSlug(name);

    const { data, error } = await supabase
      .from("categories")
      .insert({ name: name.trim(), slug: finalSlug })
      .select()
      .single();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data) {
      setList([...list, data]);
    }
    setName("");
    setSlug("");
    setLoading(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`删除分类「${name}」？该分类下的书籍会变成未分类`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    setList(list.filter((c) => c.id !== id));
  }

  return (
    <div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded mb-4">
          {error}
        </p>
      )}

      {/* 添加分类 */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="分类名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <input
          type="text"
          placeholder="URL标识（留空自动生成）"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-48 px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="inline-flex items-center gap-1 px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          添加
        </button>
      </form>

      {/* 分类列表 */}
      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium">名称</th>
              <th className="text-left px-4 py-3 font-medium">URL标识</th>
              <th className="text-right px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.length > 0 ? (
              list.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-stone-100 hover:bg-stone-50"
                >
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-stone-500 font-mono text-xs">
                    {c.slug}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="p-1.5 rounded hover:bg-red-100 transition text-stone-600 hover:text-red-600"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-8 text-stone-400">
                  还没有分类
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
