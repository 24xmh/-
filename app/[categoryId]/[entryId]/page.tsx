// /app/[categoryId]/[entryId]/page.tsx
import { getEntryByCategoryAndId } from "@/lib/db";
import { notFound } from "next/navigation";
import Toggle from "@/components/toggle";

interface Props {
  params: Promise<{
    categoryId: string;
    entryId: string;
  }>;
}

export default async function EntryPage({ params }: Props) {
  // 异步解析 params
  const { categoryId, entryId } = await params;

  const categoryIdNum = parseInt(categoryId, 10);
  const entryIdNum = parseInt(entryId, 10);

  if (isNaN(categoryIdNum) || isNaN(entryIdNum)) notFound();

  const entry = await getEntryByCategoryAndId(categoryIdNum, entryIdNum);
  if (!entry) notFound();

  return (
    <div>
      <h1 className="pl-6 pt-6 pb-2 text-3xl font-bold mb-3">{entry.title}</h1>
      <p className="text-gray-600 pl-6">
        创建时间：
        {new Date(entry.createdAt).toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}
        <span style={{ display: "inline-block", width: "1em" }} />
        更新时间：
        {new Date(entry.updatedAt).toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}
      </p>
      <div className="pl-4">
        <Toggle entryId={entryIdNum} categoryId={categoryIdNum} />
      </div>
    </div>
  );
}