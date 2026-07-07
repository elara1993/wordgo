import prisma from "../lib/prisma";
import { User, WordProgress, DailyStat } from "../types";

export const userService = {
  async getOrCreate(username: string): Promise<User> {
    let user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      user = await prisma.user.create({
        data: { username, totalXP: 0, streak: 0, level: 1 },
      });
    }
    return user;
  },

  async getStats(userId: string): Promise<{
    user: User;
    progress: WordProgress[];
    stats: DailyStat[];
  }> {
    const [user, progress, stats] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.wordProgress.findMany({ where: { userId } }),
      prisma.dailyStat.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 30,
      }),
    ]);
    return { user: user!, progress, stats };
  },

  async updateProgress(
    userId: string,
    wordId: string,
    isCorrect: boolean
  ): Promise<void> {
    const today = new Date().toISOString().split("T")[0];

    await prisma.$transaction([
      prisma.wordProgress.upsert({
        where: { userId_wordId: { userId, wordId } },
        create: {
          userId,
          wordId,
          correct: isCorrect ? 1 : 0,
          wrong: isCorrect ? 0 : 1,
          mastery: isCorrect ? 0.2 : 0,
          reviewCount: 1,
          lastReview: new Date(),
          nextReview: new Date(Date.now() + 86400000),
        },
        update: {
          correct: { increment: isCorrect ? 1 : 0 },
          wrong: { increment: isCorrect ? 0 : 1 },
          reviewCount: { increment: 1 },
          lastReview: new Date(),
          nextReview: new Date(Date.now() + 86400000),
          mastery: {
            increment: isCorrect ? 0.1 : -0.05,
          },
        },
      }),
      prisma.dailyStat.upsert({
        where: { userId_date: { userId, date: today } },
        create: {
          userId,
          date: today,
          learned: isCorrect ? 1 : 0,
          correct: isCorrect ? 1 : 0,
          xpEarned: isCorrect ? 10 : 0,
        },
        update: {
          learned: { increment: 1 },
          correct: { increment: isCorrect ? 1 : 0 },
          xpEarned: { increment: isCorrect ? 10 : 0 },
        },
      }),
    ]);
  },
};
