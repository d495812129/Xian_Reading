import Link from "next/link";
import type { Book } from "@/lib/types";
import { BookMarked } from "lucide-react";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/book/${book.id}`} className="group block">
      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-100 relative shadow-sm group-hover:shadow-md transition">
        {book.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="cover-placeholder w-full h-full flex flex-col items-center justify-center text-stone-500 p-2 text-center">
            <BookMarked className="w-8 h-8 mb-2" />
            <span className="text-xs line-clamp-3">{book.title}</span>
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-brand-600 transition">
          {book.title}
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">{book.author}</p>
      </div>
    </Link>
  );
}
