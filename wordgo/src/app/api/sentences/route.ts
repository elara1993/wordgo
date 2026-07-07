import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wordId = searchParams.get("wordId");
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

  try {
    const where: Record<string, unknown> = {};

    if (wordId) {
      where.wordId = wordId;
    }
    if (category) {
      where.word = { category };
    }

    const [sentences, total] = await Promise.all([
      prisma.sentence.findMany({
        where,
        include: {
          word: {
            select: {
              id: true,
              word: true,
              meaning: true,
              phonetic: true,
              category: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { level: "asc" },
      }),
      prisma.sentence.count({ where }),
    ]);

    return NextResponse.json({
      sentences,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Failed to fetch sentences:", error);
    return NextResponse.json(
      { error: "Failed to fetch sentences" },
      { status: 500 }
    );
  }
}