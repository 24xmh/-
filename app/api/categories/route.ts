import { prismaCategories } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    
    // 验证输入
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: "无效的分类名称" },
        { status: 400 }
      );
    }

    // 检查是否存在相同名称的分类（确保 `name` 是唯一的）
    const existingCategory = await prismaCategories.category.findFirst({
      where: { name }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "分类名称已存在" },
        { status: 409 }
      );
    }

    // 创建新分类
    const newCategory = await prismaCategories.category.create({
      data: { name }
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error('分类创建失败:', error);
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
  try {
    // 从请求体中获取 categoryId
    const { categoryId } = await req.json();

    // 验证 categoryId 是否有效
    if (!categoryId || isNaN(Number(categoryId))) {
      return NextResponse.json(
        { error: "无效的分类ID" },
        { status: 400 }
      );
    }

    // 删除分类
    const deletedCategory = await prismaCategories.category.delete({
      where: { id: Number(categoryId) },  // 假设 categoryId 是数字类型
    });

    return NextResponse.json(deletedCategory);
  } catch (error) {
    console.error("删除分类失败:", error);
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}