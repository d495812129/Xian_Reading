import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { mockBooks, mockCategories, isMockMode } from "@/lib/mock-data";

const baseUrl = "https://xianshuku.cn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isMockMode) {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      ...mockBooks.map((book) => ({
        url: `${baseUrl}/book/${book.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...mockCategories.map((cat) => ({
        url: `${baseUrl}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  }

  const supabase = createPublicClient();

  const [{ data: books }, { data: categories }] = await Promise.all([
    supabase.from("books").select("id, updated_at"),
    supabase.from("categories").select("slug, created_at"),
  ]);

  const bookUrls: MetadataRoute.Sitemap = (books ?? []).map((book) => ({
    url: `${baseUrl}/book/${book.id}`,
    lastModified: new Date(book.updated_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = (categories ?? []).map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(cat.created_at),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...bookUrls,
    ...categoryUrls,
  ];
}
