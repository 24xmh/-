// /app/api/entries/[categoryId]/[entryId]/route.ts
import { prismaEntries } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: 获取某个条目
export async function GET(_: Request, context: { params: { categoryId: string; entryId: string } }) {
  try {
    const categoryId = Number(context.params.categoryId);
    const entryId = Number(context.params.entryId);

    if (isNaN(categoryId) || isNaN(entryId)) {
      return NextResponse.json({ error: "无效的 categoryId 或 entryId" }, { status: 400 });
    }

    const entry = await prismaEntries.entry.findFirst({
      where: {
        AND: [
          { categoryId },
          { id: entryId },
        ],
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

// PUT: 更新条目的内容
export async function PUT(req: Request, context: { params: { categoryId: string; entryId: string } }) {
  try {
    const categoryId = Number(context.params.categoryId);
    const entryId = Number(context.params.entryId);

    if (isNaN(categoryId) || isNaN(entryId)) {
      return NextResponse.json({ error: "无效的 categoryId 或 entryId" }, { status: 400 });
    }

    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "缺少 content 参数" }, { status: 400 });
    }

    const updatedEntry = await prismaEntries.entry.update({
      where: {
        id: entryId,
      },
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