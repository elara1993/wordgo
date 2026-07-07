import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

const DEFAULT_USER_ID = "demo_user";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || null;

    // Get daily stats
    const where: Record<string, unknown> = {};
    if (userId) {
      where.userId = userId;
    } else {
      // Try to find default user
      const defaultUser = await prisma.user.findFirst({
        where: { username: DEFAULT_USER_ID },
      });
      where.userId = defaultUser?.id || "";
    }

    const stats = await prisma.dailyStat.findMany({
      where,
      orderBy: { date: "desc" },
      take: 30,
    });

    // Get today's stats
    const today = new Date().toISOString().split("T")[0];
    const todayStat = stats.find((s) => s.date === today) || null;

    return NextResponse.json({
      stats,
      today: todayStat,
    });
  } catch (error) {
    console.error("GET /api/progress error:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId: requestedUserId, learned, reviewed, correct, wrong, xpEarned } = body;

    const userId = requestedUserId ||
      (await prisma.user.findFirst({ where: { username: DEFAULT_USER_ID } }))?.id;

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0];
    const stat = await prisma.dailyStat.upsert({
      where: { userId_date: { userId, date: today } },
      update: {
        learned: learned ? { increment: learned } : undefined,
        reviewed: reviewed ? { increment: reviewed } : undefined,
        correct: correct ? { increment: correct } : undefined,
        wrong: wrong ? { increment: wrong } : undefined,
        xpEarned: xpEarned ? { increment: xpEarned } : undefined,
      },
      create: {
        userId,
        date: today,
        learned: learned ?? 0,
        reviewed: reviewed ?? 0,
        correct: correct ?? 0,
        wrong: wrong ?? 0,
        xpEarned: xpEarned ?? 0,
      },
    });

    return NextResponse.json(stat, { status: 201 });
  } catch (error) {
    console.error("POST /api/progress error:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}