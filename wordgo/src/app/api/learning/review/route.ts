import { NextResponse } from "next/server";
import prisma from "@/lib/db";

const DEFAULT_USER_ID = "demo_user";

/** POST /api/learning/review - Record a word review result */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wordId, correct, userId: requestedUserId } = body;

    const userId = requestedUserId ||
      (await prisma.user.findFirst({ where: { username: DEFAULT_USER_ID } }))?.id;

    if (!userId || !wordId) {
      return NextResponse.json({ error: "Missing userId or wordId" }, { status: 400 });
    }

    // Update word progress
    const existing = await prisma.wordProgress.findUnique({
      where: { userId_wordId: { userId, wordId } },
    });

    let progress;
    if (!existing) {
      progress = await prisma.wordProgress.create({
        data: {
          userId,
          wordId,
          correct: correct ? 1 : 0,
          wrong: correct ? 0 : 1,
          mastery: correct ? 0.3 : 0,
          reviewCount: 1,
          lastReview: new Date(),
          nextReview: new Date(
            Date.now() + (correct ? 4 * 60 * 60 * 1000 : 60 * 60 * 1000)
          ),
        },
      });
    } else {
      const newCorrect = existing.correct + (correct ? 1 : 0);
      const newWrong = existing.wrong + (correct ? 0 : 1);
      const newCount = existing.reviewCount + 1;
      const newMastery = Math.min(
        1.0,
        newCorrect / Math.max(1, newCorrect + newWrong)
      );

      progress = await prisma.wordProgress.update({
        where: { id: existing.id },
        data: {
          correct: newCorrect,
          wrong: newWrong,
          mastery: newMastery,
          reviewCount: newCount,
          lastReview: new Date(),
          nextReview: new Date(
            Date.now() + (correct ? 24 * 60 * 60 * 1000 : 4 * 60 * 60 * 1000)
          ),
        },
      });
    }

    // Update daily stats
    const today = new Date().toISOString().split("T")[0];
    await prisma.dailyStat.upsert({
      where: { userId_date: { userId, date: today } },
      update: {
        reviewed: { increment: 1 },
        correct: correct ? { increment: 1 } : undefined,
        wrong: correct ? undefined : { increment: 1 },
        learned: existing ? undefined : { increment: 1 },
        xpEarned: { increment: correct ? 10 : 5 },
      },
      create: {
        userId,
        date: today,
        reviewed: 1,
        correct: correct ? 1 : 0,
        wrong: correct ? 0 : 1,
        learned: existing ? 0 : 1,
        xpEarned: correct ? 10 : 5,
      },
    });

    // Update user XP
    await prisma.user.update({
      where: { id: userId },
      data: { totalXP: { increment: correct ? 10 : 5 } },
    });

    return NextResponse.json(progress, { status: 201 });
  } catch (error) {
    console.error("POST /api/learning/review error:", error);
    return NextResponse.json({ error: "Failed to record review" }, { status: 500 });
  }
}