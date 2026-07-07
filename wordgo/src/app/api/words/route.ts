import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const level = searchParams.get("level");
    const search = searchParams.get("search");
    const limit = Number(searchParams.get("limit")) || 50;
    const offset = Number(searchParams.get("offset")) || 0;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (level) where.level = Number(level);
    if (search) where.word = { startsWith: search.toLowerCase() };

    const [words, total] = await Promise.all([
      prisma.word.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "asc" },
      }),
      prisma.word.count({ where }),
    ]);

    return NextResponse.json({ words, total });
  } catch (error) {
    console.error("GET /api/words error:", error);
    return NextResponse.json({ error: "Failed to fetch words" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const word = await prisma.word.create({ data: body });
    return NextResponse.json(word, { status: 201 });
  } catch (error) {
    console.error("POST /api/words error:", error);
    return NextResponse.json({ error: "Failed to create word" }, { status: 500 });
  }
}