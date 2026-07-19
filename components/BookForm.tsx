"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category, Book } from "@/lib/types";
import { Upload, Loader2 } from "lucide-react";

export default function BookForm({
  book,
  categories,
}: {
  book?: Book;
  categories: Category[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [description, setDescription] = useState(book?.description ?? "");
  const [categoryId, setCategoryId] = useState(book?.category_id ?? "");
  const [coverUrl, setCoverUrl] = useState(book?.cover_url ?? "");
  const [panLink, setPanLink] = useState(book?.pan_link ?? "");
  const [panPassword, setPanPassword] = useState(book?.pan_password ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("covers")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("covers").getPublicUrl(fileName);
      setCoverUrl(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title,
      author,
      description: description || null,
      category_id: categoryId || null,
      cover_url: coverUrl || null,
      pan_link: panLink,
      pan_password: panPassword || null,
    };

    try {
      if (book) {
        // 编辑
        const { error } = await supabase
          .from("books")
          .update(payload)
          .eq("id", book.id);
        if (error) throw error;
        router.push("/admin");
        router.refresh();
      } else {
        // 新增
        const { data: userData } = await supabase.auth.getUser();
        const { error } = await supabase.from("books").insert({
          ...payload,
          created_by: userData.user?.id ?? null,
        });
        if (error) throw error;
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 封面上传 */}
      <div>
        <label className="block text-sm font-medium mb-2">封面</label>
        <div className="flex items-start gap-4">
          <div className="w-24 h-32 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverUrl}
                alt="封面"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs text-center px-1">
                暂无封面
              </div>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-stone-300 rounded-md hover:bg-stone-50 transition disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? "上传中..." : "上传封面"}
            </button>
            <p className="text-xs text-stone-400 mt-1">JPG/PNG，建议 3:4 比例</p>
            {/* 也可以直接贴 URL */}
            <input
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="或粘贴封面图片 URL"
              className="mt-2 w-full px-3 py-1.5 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* 书名 */}
      <div>
        <label className="block text-sm font-medium mb-1">书名 *</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* 作者 */}
      <div>
        <label className="block text-sm font-medium mb-1">作者 *</label>
        <input
          type="text"
          required
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* 分类 */}
      <div>
        <label className="block text-sm font-medium mb-1">分类</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        >
          <option value="">未分类</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 简介 */}
      <div>
        <label className="block text-sm font-medium mb-1">简介</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
          placeholder="书籍简介..."
        />
      </div>

      {/* 网盘链接 */}
      <div className="border-t border-stone-200 pt-4">
        <h3 className="font-medium mb-1">网盘下载</h3>
        <p className="text-xs text-amber-600 mb-3">
          务必填百度网盘推广链接（带推广参数），否则用户保存不计佣金
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              推广链接 *
            </label>
            <input
              type="url"
              required
              value={panLink}
              onChange={(e) => setPanLink(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="https://pan.baidu.com/s/...（推广链接）"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">提取码</label>
            <input
              type="text"
              value={panPassword}
              onChange={(e) => setPanPassword(e.target.value)}
              className="w-32 px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="如 abcd"
            />
            <p className="text-xs text-stone-400 mt-1">
              用户点击下载后才会显示提取码
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
          {error}
        </p>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition disabled:opacity-50"
        >
          {saving ? "保存中..." : book ? "保存修改" : "添加书籍"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-6 py-2 border border-stone-300 rounded-md hover:bg-stone-50 transition"
        >
          取消
        </button>
      </div>
    </form>
  );
}
