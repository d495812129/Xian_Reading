import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://xianshuku.cn"),
  title: {
    default: "闲书库 - 免费电子书下载分享",
    template: "%s | 闲书库",
  },
  description:
    "闲书库是一个免费电子书分享平台，提供海量电子书网盘下载，涵盖小说、文学、技术等各类书籍，百度网盘直接保存。",
  keywords: [
    "电子书",
    "电子书下载",
    "免费电子书",
    "网盘电子书",
    "闲书库",
    "pdf下载",
    "epub下载",
  ],
  authors: [{ name: "闲书库" }],
  creator: "闲书库",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://xianshuku.cn",
    siteName: "闲书库",
    title: "闲书库 - 免费电子书下载分享",
    description:
      "免费电子书分享平台，海量书籍网盘下载，涵盖小说、文学、技术等各类书籍。",
  },
  twitter: {
    card: "summary_large_image",
    title: "闲书库 - 免费电子书下载分享",
    description: "免费电子书分享平台，海量书籍网盘下载。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
