import { getEntriesWithCategories } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MonthPage({ params, searchParams }: { params: { month: string }; searchParams: { sort?: string } }) {
  // 解析路由参数（格式：2025-06）
  const [year, month] = params.month.split("-").map(Number);
  if (!year || !month || month < 1 || month > 12) {
    notFound(); // 无效月份跳转到 404
  }

  // 获取排序参数，默认降序（从晚到早）
  const sortOrder = searchParams.sort === "asc" ? "asc" : "desc";

  // 获取所有条目，包含分类

  const entries = await getEntriesWithCategories();

  // 过滤该月份的条目
  const filteredEntries = entries.filter((entry) => {
    const date = new Date(entry.updatedAt);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  });

  // 根据 sortOrder 排序
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // 格式化月份显示
  const monthDisplay = `${year}年${month}月`;

  return (
    <div className="pl-0 pr-4 pt-10 max-w-4xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold">{monthDisplay} 的日志</h1>
        <div className="flex space-x-2">
          <Link
            href={`/month/${params.month}?sort=${sortOrder === "asc" ? "desc" : "asc"}`}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition"
            aria-label={`切换为${sortOrder === "asc" ? "从晚到早" : "从早到晚"}排序`}
          >
            切换排序（{sortOrder === "asc" ? "从早到晚" : "从晚到早"}）
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 transition"
            aria-label="返回主页"
          >
            返回主页
          </Link>
        </div>
      </div>
      {sortedEntries.length === 0 ? (
        <p className="text-gray-500">该月份暂无记录</p>
      ) : (
        <ul className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {sortedEntries.map((entry) => (
            <li key={entry.id} className="p-4 bg-white rounded-md shadow hover:bg-blue-50 transition">
              <Link
                href={`/${entry.categoryId}/${entry.id}`}
                className="block"
                aria-label={`查看 ${entry.title}`}
              >
                <h2 className="text-lg font-medium text-black">{entry.title}</h2>
                <p className="text-gray-600 text-sm">
                  分类：{entry.category.name || "未知分类"}
                </p>
                <p className="text-gray-600 text-sm">
                  创建时间：{new Date(entry.createdAt).toLocaleDateString()}
                  <br />
                  最后更新：{new Date(entry.updatedAt).toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}