import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

const DEFAULT_USER_ID = "demo_user";

/** GET /api/learning - Get user's word progress & words for review */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") ||
      (await prisma.user.findFirst({ where: { username: DEFAULT_USER_ID } }))?.id;

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const mode = searchParams.get("mode") || "progress";

    if (mode === "review") {
      // Words due for review
      const now = new Date();
      const words = await prisma.wordProgress.findMany({
        where: { userId, nextReview: { lte: now } },
        include: { word: true },
        orderBy: { mastery: "asc" },
        take: 20,
      });
      return NextResponse.json({ words: words.map((w) => ({ ...w.word, progress: w })) });
    }

    if (mode === "new") {
      // New words not yet learned
      const limit = Number(searchParams.get("limit")) || 10;
      const progressWordIds = await prisma.wordProgress.findMany({
        where: { userId },
        select: { wordId: true },
      });
      const learnedIds = progressWordIds.map((p) => p.wordId);

      const words = await prisma.word.findMany({
        where: { id: { notIn: learnedIds } },
        take: limit,
        orderBy: { level: "asc" },
      });
      return NextResponse.json({ words });
    }

    // Default: get all progress
    const progress = await prisma.wordProgress.findMany({
      where: { userId },
      include: { word: true },
      orderBy: { mastery: "asc" },
    });
    return NextResponse.json({ progress });
  } catch (error) {
    console.error("GET /api/learning error:", error);
    return NextResponse.json({ error: "Failed to fetch learning data" }, { status: 500 });
  }
}