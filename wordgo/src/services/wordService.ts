/**
 * Word Service - Database operations for words
 */
import prisma from '@/lib/db';

export interface GetWordsOptions {
  category?: string;
  difficulty?: string;
  level?: number;
  limit?: number;
  offset?: number;
}

export const wordService = {
  /** Get all words with optional filters */
  async getWords(options: GetWordsOptions = {}) {
    const { category, difficulty, level, limit = 20, offset = 0 } = options;
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (level) where.level = level;

    const [words, total] = await Promise.all([
      prisma.word.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.word.count({ where }),
    ]);
    return { words, total };
  },

  /** Get a single word by ID */
  async getWordById(id: string) {
    return prisma.word.findUnique({ where: { id } });
  },

  /** Get a single word by word text */
  async getWordByText(word: string) {
    return prisma.word.findUnique({ where: { word } });
  },

  /** Get words by category */
  async getWordsByCategory(category: string, limit = 20) {
    return prisma.word.findMany({
      where: { category },
      take: limit,
      orderBy: { level: 'asc' },
    });
  },

  /** Get all distinct categories with word counts */
  async getCategories() {
    const result = await prisma.word.groupBy({
      by: ['category'],
      _count: true,
      orderBy: { category: 'asc' },
    });
    return result.map((r) => ({ category: r.category, count: r._count }));
  },

  /** Search words by prefix */
  async searchWords(query: string, limit = 10) {
    return prisma.word.findMany({
      where: {
        word: { startsWith: query.toLowerCase() },
      },
      take: limit,
    });
  },
};