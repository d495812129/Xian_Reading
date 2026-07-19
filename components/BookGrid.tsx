import BookCard from "./BookCard";
import type { Book } from "@/lib/types";

export default function BookGrid({ books }: { books: Book[] }) {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-20 text-stone-400">
        <p className="text-lg">还没有书籍</p>
        <p className="text-sm mt-1">登录后台添加第一本书吧</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
