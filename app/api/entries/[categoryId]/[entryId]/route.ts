import { prismaEntries } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// 工具函数：从 URL 中提取 params
function extractParams(request: Request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/");

  // 假设路径为 /api/entries/[categoryId]/[entryId]
  const categoryId = Number(pathParts.at(-2));
  const entryId = Number(pathParts.at(-1));
  return { categoryId, entryId };
}

// GET: 获取条目
export async function GET(request: NextRequest) {
  try {
    const { categoryId, entryId } = extractParams(request);

    if (isNaN(categoryId) || isNaN(entryId)) {
      return NextResponse.json({ error: "无效的 categoryId 或 entryId" }, { status: 400 });
    }

    const entry = await prismaEntries.entry.findFirst({
      where: {
        categoryId,
        id: entryId,
      },
    });

    if (!entry) {
      return NextResponse.json({ error: "未找到条目" }, { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error("获取条目失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// PUT: 更新条目
export async function PUT(request: NextRequest) {
  try {
    const { categoryId, entryId } = extractParams(request);

    if (isNaN(categoryId) || isNaN(entryId)) {
      return NextResponse.json({ error: "无效的 categoryId 或 entryId" }, { status: 400 });
    }

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "缺少 content 参数" }, { status: 400 });
    }

    const updatedEntry = await prismaEntries.entry.update({
      where: { id: entryId },
      data: {
        content,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error("更新条目失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
