/**
 * Learning Service - Word progress & daily stats
 */
import prisma from '@/lib/db';

export const learningService = {
  /** Get word progress for a user */
  async getUserProgress(userId: string, options?: { category?: string; limit?: number }) {
    const where: Record<string, unknown> = { userId };
    if (options?.category) {
      return prisma.wordProgress.findMany({
        where,
        include: { word: true },
        orderBy: { mastery: 'asc' },
        take: options.limit ?? 50,
      });
    }
    return prisma.wordProgress.findMany({
      where,
      include: { word: true },
      orderBy: { mastery: 'asc' },
      take: options?.limit ?? 50,
    });
  },

  /** Get progress for a specific word */
  async getWordProgress(userId: string, wordId: string) {
    return prisma.wordProgress.findUnique({
      where: { userId_wordId: { userId, wordId } },
      include: { word: true },
    });
  },

  /** Update word progress after a review */
  async recordReview(
    userId: string,
    wordId: string,
    correct: boolean,
  ) {
    const existing = await prisma.wordProgress.findUnique({
      where: { userId_wordId: { userId, wordId } },
    });

    if (!existing) {
      // Create new progress record
      return prisma.wordProgress.create({
        data: {
          userId,
          wordId,
          correct: correct ? 1 : 0,
          wrong: correct ? 0 : 1,
          mastery: correct ? 0.3 : 0,
          reviewCount: 1,
          lastReview: new Date(),
          nextReview: new Date(Date.now() + (correct ? 4 * 60 * 60 * 1000 : 60 * 60 * 1000)), // 4h or 1h
        },
      });
    }

    // Update existing
    const newCorrect = existing.correct + (correct ? 1 : 0);
    const newWrong = existing.wrong + (correct ? 0 : 1);
    const newCount = existing.reviewCount + 1;
    const newMastery = Math.min(1.0, newCorrect / Math.max(1, newCorrect + newWrong));

    return prisma.wordProgress.update({
      where: { id: existing.id },
      data: {
        correct: newCorrect,
        wrong: newWrong,
        mastery: newMastery,
        reviewCount: newCount,
        lastReview: new Date(),
        nextReview: new Date(Date.now() + (correct ? 24 * 60 * 60 * 1000 : 4 * 60 * 60 * 1000)),
      },
    });
  },

  /** Get daily stats for a user */
  async getDailyStats(userId: string, date: string) {
    return prisma.dailyStat.findUnique({
      where: { userId_date: { userId, date } },
    });
  },

  /** Get today's stats (creates if not exists) */
  async getOrCreateTodayStats(userId: string) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const existing = await prisma.dailyStat.findUnique({
      where: { userId_date: { userId, date: today } },
    });
    if (existing) return existing;
    return prisma.dailyStat.create({
      data: { userId, date: today },
    });
  },

  /** Update daily stats */
  async updateDailyStats(
    userId: string,
    data: { learned?: number; reviewed?: number; correct?: number; wrong?: number; xpEarned?: number }
  ) {
    const today = new Date().toISOString().split('T')[0];
    return prisma.dailyStat.upsert({
      where: { userId_date: { userId, date: today } },
      update: {
        learned: data.learned ? { increment: data.learned } : undefined,
        reviewed: data.reviewed ? { increment: data.reviewed } : undefined,
        correct: data.correct ? { increment: data.correct } : undefined,
        wrong: data.wrong ? { increment: data.wrong } : undefined,
        xpEarned: data.xpEarned ? { increment: data.xpEarned } : undefined,
      },
      create: {
        userId,
        date: today,
        learned: data.learned ?? 0,
        reviewed: data.reviewed ?? 0,
        correct: data.correct ?? 0,
        wrong: data.wrong ?? 0,
        xpEarned: data.xpEarned ?? 0,
      },
    });
  },

  /** Get words due for review (spaced repetition) */
  async getWordsForReview(userId: string, limit = 20) {
    const now = new Date();
    return prisma.wordProgress.findMany({
      where: {
        userId,
        nextReview: { lte: now },
      },
      include: { word: true },
      orderBy: { mastery: 'asc' },
      take: limit,
    });
  },

  /** Get new words not yet learned by user */
  async getNewWords(userId: string, limit = 10) {
    // Find word IDs the user has progress on
    const progressWordIds = await prisma.wordProgress.findMany({
      where: { userId },
      select: { wordId: true },
    });
    const learnedIds = progressWordIds.map((p) => p.wordId);

    return prisma.word.findMany({
      where: {
        id: { notIn: learnedIds },
      },
      take: limit,
      orderBy: { level: 'asc' },
    });
  },
};