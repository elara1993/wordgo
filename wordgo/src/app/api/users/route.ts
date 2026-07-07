import { NextResponse } from "next/server";
import prisma from "@/lib/db";

const DEFAULT_USER_ID = "demo_user";

/** GET /api/users - Get current user info & stats */
export async function GET() {
  try {
    // Get or create default user
    let user = await prisma.user.findFirst({
      where: { username: DEFAULT_USER_ID },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { username: DEFAULT_USER_ID, streak: 0, totalXP: 0 },
      });
    }

    // Get today's stats
    const today = new Date().toISOString().split("T")[0];
    const todayStat = await prisma.dailyStat.findUnique({
      where: { userId_date: { userId: user.id, date: today } },
    });

    // Get total stats
    const totalStats = await prisma.wordProgress.aggregate({
      where: { userId: user.id },
      _sum: { correct: true, wrong: true, reviewCount: true },
    });

    return NextResponse.json({
      user,
      today: todayStat || {
        learned: 0,
        reviewed: 0,
        correct: 0,
        wrong: 0,
        xpEarned: 0,
      },
      total: {
        correct: totalStats._sum.correct || 0,
        wrong: totalStats._sum.wrong || 0,
        reviews: totalStats._sum.reviewCount || 0,
      },
    });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}