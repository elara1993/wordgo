import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

const USERNAME = "demo_user";

async function getUserId() {
  let user = await prisma.user.findFirst({ where: { username: USERNAME } });
  if (!user) {
    user = await prisma.user.create({
      data: { username: USERNAME, streak: 0, totalXP: 0 },
    });
  }
  return user.id;
}

/** GET /api/wordbook - List all bookmarked words */
export async function GET() {
  try {
    const userId = await getUserId();

    const entries = await prisma.wordBook.findMany({
      where: { userId },
      include: {
        word: {
          select: {
            id: true,
            word: true,
            phonetic: true,
            meaning: true,
            category: true,
            difficulty: true,
            level: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("GET /api/wordbook error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wordbook" },
      { status: 500 }
    );
  }
}

/** POST /api/wordbook - Add a word to wordbook */
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { wordId } = await request.json();

    if (!wordId) {
      return NextResponse.json(
        { error: "wordId is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.wordBook.findUnique({
      where: { userId_wordId: { userId, wordId } },
    });

    if (existing) {
      return NextResponse.json({ entry: existing, alreadyExists: true });
    }

    const entry = await prisma.wordBook.create({
      data: { userId, wordId },
    });

    return NextResponse.json({ entry });
  } catch (error) {
    console.error("POST /api/wordbook error:", error);
    return NextResponse.json(
      { error: "Failed to add to wordbook" },
      { status: 500 }
    );
  }
}

/** DELETE /api/wordbook?wordId=xxx - Remove a word from wordbook */
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);
    const wordId = searchParams.get("wordId");

    if (!wordId) {
      return NextResponse.json(
        { error: "wordId is required" },
        { status: 400 }
      );
    }

    await prisma.wordBook.deleteMany({
      where: { userId, wordId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/wordbook error:", error);
    return NextResponse.json(
      { error: "Failed to remove from wordbook" },
      { status: 500 }
    );
  }
}