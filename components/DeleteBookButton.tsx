"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DeleteBookButton({
  bookId,
  title,
}: {
  bookId: string;
  title: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    const supabase = createClient();
    await supabase.from("books").delete().eq("id", bookId);
    router.refresh();
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="p-1.5 rounded hover:bg-red-100 transition text-stone-600 hover:text-red-600"
        title="删除"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-red-600 mr-1">删除《{title}》?</span>
      <button
        onClick={handleDelete}
        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
      >
        确定
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="px-2 py-1 text-xs bg-stone-200 rounded hover:bg-stone-300"
      >
        取消
      </button>
    </div>
  );
}
