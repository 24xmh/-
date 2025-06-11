// /app/api/entries/[categoryId]/[entryId]/route.ts
import { prismaEntries } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { categoryId: string; entryId: string } }) {
  try {
    const categoryId = Number(params.categoryId);
    const entryId = Number(params.entryId);

    if (isNaN(categoryId) || isNaN(entryId)) {
      return NextResponse.json({ error: '无效的 categoryId 或 entryId' }, { status: 400 });
    }

    const entry = await prismaEntries.entry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      return NextResponse.json({ error: '条目不存在' }, { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error('获取条目失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, categoryId } = await req.json();

    // 确保 `categoryId` 是有效的数字
    const categoryIdNumber = Number(categoryId);
    if (!title || isNaN(categoryIdNumber)) {
      return NextResponse.json({ error: '缺少必要参数或参数无效' }, { status: 400 });
    }

    // 检查分类是否存在
    const categoryExists = await prismaEntries.category.findUnique({
      where: { id: categoryIdNumber },
    });

    if (!categoryExists) {
      return NextResponse.json({ error: '指定分类不存在' }, { status: 404 });
    }

    // 创建新条目
    const newEntry = await prismaEntries.entry.create({
      data: {
        title,
        content: {}, // 初始化空 JSON
        categoryId: categoryIdNumber,
      },
    });

    return NextResponse.json(newEntry);
  } catch (error) {
    console.error('条目创建失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { entryId } = await req.json();

    if (!entryId || isNaN(Number(entryId))) {
      return NextResponse.json({ error: '无效的条目ID' }, { status: 400 });
    }

    await prismaEntries.entry.delete({
      where: { id: Number(entryId) },
    });

    return new NextResponse(null, { status: 204 }); // 204 No Content
  } catch (error) {
    console.error('删除条目失败:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}

