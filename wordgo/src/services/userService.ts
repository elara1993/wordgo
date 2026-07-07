/**
 * User Service - Database operations for users
 */
import prisma from '@/lib/db';

export const userService = {
  /** Get user by ID */
  async getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  /** Get user by username */
  async getUserByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  },

  /** Create or get default user */
  async getOrCreateDefaultUser() {
    const existing = await prisma.user.findFirst({
      where: { username: 'demo_user' },
    });
    if (existing) return existing;
    return prisma.user.create({
      data: { username: 'demo_user', streak: 0, totalXP: 0 },
    });
  },

  /** Update user streak */
  async updateStreak(userId: string, streak: number) {
    return prisma.user.update({
      where: { id: userId },
      data: { streak },
    });
  },

  /** Add XP to user */
  async addXP(userId: string, xp: number) {
    return prisma.user.update({
      where: { id: userId },
      data: { totalXP: { increment: xp } },
    });
  },

  /** Get user with stats */
  async getUserStats(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { wordProgresses: true, dailyStats: true },
        },
      },
    });
  },
};