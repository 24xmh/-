import { prismaCategories, prismaEntries } from "@/lib/prisma";

// 查询分类和条目
export async function getCategoriesWithEntries() {
  const categories = await prismaCategories.category.findMany({
    include: {
      entries: {
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  return categories;
}

// 首页展示所有条目
export async function getEntries() {
  return prismaEntries.entry.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getEntriesWithCategories() {
  return prismaEntries.entry.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// 获取单个条目
export async function getEntryByCategoryAndId(categoryId: number, entryId: number) {
  return await prismaEntries.entry.findFirst({
    where: {
      id: entryId,
      categoryId: categoryId, // 确保 entry 属于指定的 category
    },
    include: {
      category: true, // 如果你需要category的信息，可以一并返回
    },
  });
}
