import { prismaEntries } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: 获取某个条目
export async function GET(_: Request, { params }: { params: { categoryId: string; entryId: string } }) {
  const entry = await prismaEntries.entry.findFirst({
    where: {
      id: Number(params.entryId),
      categoryId: Number(params.categoryId),
    },
  });

  if (!entry) return NextResponse.json({ error: "未找到条目" }, { status: 404 });
  return NextResponse.json(entry);
}

// PUT: 更新条目的内容
export async function PUT(req: Request, { params }: { params: { categoryId: string; entryId: string } }) {
  const body = await req.json();
  const content = body.content;

  const updated = await prismaEntries.entry.update({
    where: {
      id: Number(params.entryId),
    },
    data: {
      content,
    },
  });

  return NextResponse.json(updated);
}