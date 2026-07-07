"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/navigation/bottom-nav";

const categories = [
  { name: "全部", emoji: "📚", count: 100 },
  { name: "水果", emoji: "🍎", count: 15 },
  { name: "动物", emoji: "🐶", count: 15 },
  { name: "颜色", emoji: "🎨", count: 10 },
  { name: "数字", emoji: "🔢", count: 10 },
  { name: "家庭", emoji: "👨‍👩‍👧", count: 10 },
  { name: "食物", emoji: "🍕", count: 20 },
  { name: "通用", emoji: "✨", count: 20 },
];

const mockWords = [
  { word: "apple", meaning: "苹果", phonetic: "/ˈæp.əl/", level: 1 },
  { word: "banana", meaning: "香蕉", phonetic: "/bəˈnæn.ə/", level: 1 },
  { word: "elephant", meaning: "大象", phonetic: "/ˈel.ɪ.fənt/", level: 3 },
  { word: "tiger", meaning: "老虎", phonetic: "/ˈtaɪ.ɡər/", level: 2 },
  { word: "crimson", meaning: "深红色", phonetic: "/ˈkrɪm.zən/", level: 5 },
  { word: "delicious", meaning: "美味的", phonetic: "/dɪˈlɪʃ.əs/", level: 2 },
  { word: "beautiful", meaning: "美丽的", phonetic: "/ˈbjuː.tɪ.fəl/", level: 3 },
  { word: "important", meaning: "重要的", phonetic: "/ɪmˈpɔːr.tənt/", level: 3 },
];

export default function DictionaryPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWords = mockWords.filter((w) => {
    const matchSearch =
      !searchQuery ||
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaning.includes(searchQuery);
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">词库</h1>

        {/* Search */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索单词或中文意思..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.name
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Word List */}
      <div className="px-6 space-y-3">
        {filteredWords.map((w, i) => (
          <MotionCard key={w.word} delay={i * 0.05}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {w.word}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{w.phonetic}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-700 dark:text-gray-300">{w.meaning}</p>
                <Badge
                  variant={w.level <= 2 ? "success" : w.level <= 3 ? "warning" : "danger"}
                  className="text-xs"
                >
                  Lv.{w.level}
                </Badge>
              </div>
            </div>
          </MotionCard>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

function MotionCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div
      style={{ animation: `fadeInUp 0.3s ease ${delay}s forwards`, opacity: 0 }}
      className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800"
    >
      {children}
    </div>
  );
}
