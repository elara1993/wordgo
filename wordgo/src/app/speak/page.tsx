"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { SpeakerWaveIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/navigation/bottom-nav";
import type { Sentence } from "@/types";

const categories = [
  { name: "全部", emoji: "📚" },
  { name: "fruit", emoji: "🍎", label: "水果" },
  { name: "animal", emoji: "🐶", label: "动物" },
  { name: "color", emoji: "🎨", label: "颜色" },
  { name: "number", emoji: "🔢", label: "数字" },
  { name: "family", emoji: "👨‍👩‍👧", label: "家庭" },
  { name: "food", emoji: "🍕", label: "食物" },
  { name: "weather", emoji: "🌤️", label: "天气" },
  { name: "mood", emoji: "😊", label: "心情" },
  { name: "sport", emoji: "⚽", label: "运动" },
  { name: "general", emoji: "✨", label: "通用" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export default function SpeakPage() {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== "全部") params.set("category", selectedCategory);
    params.set("limit", "50");

    fetch(`/api/sentences?${params}`)
      .then((r) => r.json())
      .then((data) => setSentences(data.sentences || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handleSpeak = useCallback((text: string, id: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      utterance.onstart = () => setSpeakingId(id);
      utterance.onend = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="px-6 pt-12 pb-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            🗣️ 我会说
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            练习用英语说出完整的句子
          </p>
        </div>
        {/* Category Filter */}
        <div className="flex gap-2 px-6 pb-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.name
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat.emoji} {cat.label || cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sentence Cards */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sentences.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">暂无例句</p>
          </div>
        ) : (
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sentences.map((sentence) => (
              <motion.div
                key={sentence.id}
                variants={itemVariants}
                className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800"
              >
                {/* Word badge */}
                {sentence.word && (
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="info" className="text-xs">
                        {sentence.word.word}
                      </Badge>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {sentence.word.meaning}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-300 dark:text-gray-600">
                      Lv.{sentence.level}
                    </span>
                  </div>
                )}

                {/* Sentence text */}
                <div className="flex items-start gap-3">
                  <Button
                    variant="secondary"
                    size="icon"
                    className={`flex-shrink-0 w-10 h-10 !rounded-xl transition-all ${
                      speakingId === sentence.id
                        ? "!bg-indigo-100 dark:!bg-indigo-900/40 !text-indigo-600 animate-pulse"
                        : ""
                    }`}
                    onClick={() => handleSpeak(sentence.text, sentence.id)}
                  >
                    <SpeakerWaveIcon className="w-5 h-5" />
                  </Button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-lg font-medium leading-relaxed transition-colors ${
                        speakingId === sentence.id
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {highlightSentence(sentence.text)}
                    </p>
                    {sentence.translation && (
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        {sentence.translation}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => toggleBookmark(sentence.id)}
                    className="flex-shrink-0 p-1"
                  >
                    {bookmarks.has(sentence.id) ? (
                      <BookmarkSolid className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <BookmarkIcon className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

/** Highlight key patterns like "I see a ..." with a purple accent */
function highlightSentence(text: string): React.ReactNode {
  // Bold the pattern "I see ..." parts
  const pattern = /(I see)\s(.+?)([.,!?]?$)/i;
  const match = text.match(pattern);
  if (match) {
    return (
      <>
        <span className="text-purple-600 dark:text-purple-400 font-semibold">
          {match[1]}
        </span>{" "}
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
          {match[2]}
        </span>
        {match[3]}
      </>
    );
  }
  return text;
}