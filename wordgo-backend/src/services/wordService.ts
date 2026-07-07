import prisma from "../lib/prisma";
import { Word } from "../types";

export const wordService = {
  async getAll(page: number = 1, limit: number = 20, category?: string, search?: string): Promise<{
    items: Word[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const where: Record<string, unknown> = {};
    if (category && category !== "all") where.category = category;
    if (search) where.word = { contains: search, mode: "insensitive" };

    const [total, items] = await Promise.all([
      prisma.word.count({ where }),
      prisma.word.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { word: "asc" },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getById(id: string): Promise<Word | null> {
    return prisma.word.findUnique({ where: { id } });
  },

  async getByWord(word: string): Promise<Word | null> {
    return prisma.word.findUnique({ where: { word } });
  },

  async getCategories(): Promise<{ category: string; _count: { category: number } }[]> {
    return prisma.word.groupBy({
      by: ["category"],
      _count: { category: true },
    });
  },
};
