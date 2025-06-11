import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/sidebar";
// ✅ 引入 prisma 查询方法
import { getCategoriesWithEntries } from "@/lib/db";

export const metadata: Metadata = {
  title: "日志网站",
  description: "日志笔记网站",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategoriesWithEntries();
  return (
    <html lang="zh-CN">
      <body className="flex h-screen text-gray-800 bg-gray-50">
        {/* 左侧边栏，确保在小屏幕上最小宽度 16rem，中等屏幕占比 1/5，大屏固定 64px */}
        <Sidebar categories={categories} />
        {/* 中间和右侧区域 */}
        <main className="flex-1 flex min-h-0 overflow-hidden">
          {/* 主内容区域，避免 flex 子元素默认最小宽度问题 */}
          <section className="flex-1 min-w-0 y-auto pl-2 pr-8">{children}</section>
          {/* 右侧栏：小屏隐藏，中等屏幕占比 1/5，大屏固定 64px */}
        </main>
      </body>
    </html>
  );
}

