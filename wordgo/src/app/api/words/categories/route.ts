export async function GET() {
  return Response.json({ categories });
}

const categories = [
  { name: "fruit", label: "水果", emoji: "🍎", count: 15 },
  { name: "animal", label: "动物", emoji: "🐶", count: 15 },
  { name: "color", label: "颜色", emoji: "🎨", count: 10 },
  { name: "number", label: "数字", emoji: "🔢", count: 10 },
  { name: "family", label: "家庭", emoji: "👨‍👩‍👧", count: 10 },
  { name: "food", label: "食物", emoji: "🍕", count: 20 },
  { name: "general", label: "通用", emoji: "📚", count: 20 },
];