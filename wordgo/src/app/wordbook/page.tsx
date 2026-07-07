"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  TrashIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { useRouter } from "next/navigation";
import type { WordBook } from "@/types";

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

export default function WordbookPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<WordBook[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = useCallback(() => {
    setLoading(true);
    fetch("/api/wordbook")
      .then((r) => r.json())
      .then((data) => setEntries(data.entries || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleRemove = useCallback(
    async (wordId: string) => {
      try {
        await fetch(`/api/wordbook?wordId=${wordId}`, { method: "DELETE" });
        setEntries((prev) => prev.filter((e) => e.wordId !== wordId));
      } catch {
        // ignore
      }
    },
    []
  );

  const handleSpeak = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            📖 生词本
          </h1>
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {entries.length} 个单词
          </span>
        </div>
      </div>

      {/* Word List */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="text-5xl">📭</p>
            <p className="text-gray-400 dark:text-gray-500">生词本还是空的</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              学习时点击「加入生词本」即可收藏单词
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push("/learn")}
              className="!rounded-xl"
            >
              去学习
            </Button>
          </div>
        ) : (
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                variants={itemVariants}
                className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {entry.word?.word}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 !p-0"
                        onClick={() =>
                          entry.word && handleSpeak(entry.word.word)
                        }
                      >
                        <SpeakerWaveIcon className="w-4 h-4 text-gray-400" />
                      </Button>
                    </div>
                    {entry.word?.phonetic && (
                      <p className="text-sm text-gray-400 dark:text-gray-500 font-mono mb-1">
                        {entry.word.phonetic}
                      </p>
                    )}
                    <p className="text-base text-gray-700 dark:text-gray-300">
                      {entry.word?.meaning}
                    </p>
                    {entry.word && (
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="info" className="text-[10px]">
                          {entry.word.category}
                        </Badge>
                        <Badge
                          variant={
                            entry.word.difficulty === "easy"
                              ? "success"
                              : entry.word.difficulty === "medium"
                              ? "warning"
                              : "danger"
                          }
                          className="text-[10px]"
                        >
                          {entry.word.difficulty === "easy"
                            ? "简单"
                            : entry.word.difficulty === "medium"
                            ? "中等"
                            : "困难"}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(entry.wordId)}
                    className="flex-shrink-0 ml-3 p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
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