// /app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import { getCategoriesWithEntries } from "@/lib/db";

export const metadata: Metadata = {
  title: "日志网站",
  description: "日志笔记网站",
};

// 强制动态渲染
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategoriesWithEntries();
  return (
    <html lang="zh-CN">
      <body className="flex h-screen text-gray-800 bg-gray-50">
        <Sidebar categories={categories} />
        <main className="flex-1 flex min-h-0 overflow-hidden">
          <section className="flex-1 min-w-0 overflow-y-auto pl-2 pr-8">
            {children}
          </section>
        </main>
      </body>
    </html>
  );
}

