import Link from "next/link";
import { Lock } from "lucide-react";

export default function RegisterClosedPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="flex justify-center mb-4">
        <Lock className="w-12 h-12 text-stone-400" />
      </div>
      <h1 className="text-2xl font-bold mb-3">注册已关闭</h1>
      <p className="text-stone-500 mb-6">
        本站暂不开放公开注册。
      </p>
      <Link
        href="/login"
        className="inline-block px-6 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition"
      >
        前往登录
      </Link>
    </div>
  );
}
