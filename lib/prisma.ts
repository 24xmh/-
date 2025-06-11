import { PrismaClient } from "@prisma/client";

// 为 globalThis 扩展类型，确保 Prisma 实例可以添加到 globalThis 上
declare global {
  // 具体声明类型，确保类型安全
  // eslint-disable-next-line no-var
  var prismaCategories: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var prismaEntries: PrismaClient | undefined;
}

// 只在 globalThis 上创建单例，避免重复连接
const prismaCategories =
  globalThis.prismaCategories ?? new PrismaClient();
const prismaEntries =
  globalThis.prismaEntries ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaCategories = prismaCategories;
  globalThis.prismaEntries = prismaEntries;
}

// 导出两个实例
export { prismaCategories, prismaEntries };
