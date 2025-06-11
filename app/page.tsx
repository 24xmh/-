import { getEntriesWithCategories } from "@/lib/db";
import Link from "next/link";

export default async function HomePage() {
  // 获取所有条目，包含分类
  const entries = await getEntriesWithCategories();

  // 按年月分组
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = new Date(entry.updatedAt);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`; // 格式：2025年6月
    const yearMonthSlug = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // 路由格式：2025-06
    if (!acc[yearMonth]) {
      acc[yearMonth] = { entries: [], slug: yearMonthSlug, categories: new Set() };
    }
    acc[yearMonth].entries.push(entry);
    acc[yearMonth].categories.add(entry.category.name); // 使用 category.name
    return acc;
  }, {} as Record<string, { entries: typeof entries; slug: string; categories: Set<string> }>);

  return (
    <div className="pl-4 pr-4 pt-12 pd-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">日志首页 - 按月份浏览</h1>
      {Object.keys(groupedEntries).length === 0 ? (
        <p className="text-gray-500">暂无记录</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.keys(groupedEntries)
            .sort((a, b) => b.localeCompare(a)) // 按年月降序
            .map((yearMonth) => (
              <Link
                key={yearMonth}
                href={`/month/${groupedEntries[yearMonth].slug}`}
                className="block p-4 bg-white rounded-md shadow hover:bg-blue-50 transition"
              >
                <h2 className="text-lg font-semibold text-blue-600">{yearMonth}</h2>
                <p className="text-gray-600 text-sm">
                  共 {groupedEntries[yearMonth].entries.length} 条记录
                </p>
                <p className="text-gray-600 text-sm">
                  包含分类：{Array.from(groupedEntries[yearMonth].categories).join(", ") || "无"}
                </p>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}