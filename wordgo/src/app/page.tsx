"use client";

import { motion } from "framer-motion";
import { PlayIcon, ChatBubbleLeftRightIcon, BookmarkSquareIcon, ChartBarIcon, FireIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useLearningStore, useTodayStatsStore, useUserStore } from "@/store/learningStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function HomePage() {
  const router = useRouter();
  const { streak, totalXP, addXP, loadFromServer } = useUserStore();
  const { learnedToday, correctToday, loadFromServer: loadStats } = useTodayStatsStore();
  const [categories, setCategories] = useState<Array<{ name: string; label: string; emoji: string; count: number }>>([]);

  // Sync store with server on mount
  useEffect(() => {
    loadFromServer();
    loadStats();
    // Fetch categories
    fetch("/api/words/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, [loadFromServer, loadStats]);

  const todayGoal = 20;
  const progressPercent = Math.min(100, (learnedToday / todayGoal) * 100);
  const todayAccuracy = learnedToday > 0 ? Math.round((correctToday / learnedToday) * 100) : 0;

  const handleStartLearning = () => {
    router.push("/learn");
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/learn?category=${category}`);
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <motion.div
        className="px-6 pt-12 pb-6 bg-white dark:bg-gray-900 rounded-b-3xl shadow-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Word<span className="text-indigo-600 dark:text-indigo-400">Go</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">每天10分钟，轻松记单词</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <FireIcon className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">{streak}</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <SparklesIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">{totalXP} XP</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Today Stats */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">今日目标</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {learnedToday} / {todayGoal}
            </span>
          </div>
          <ProgressBar progress={progressPercent} showLabel height="h-3" />
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="px-6 py-6 space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Continue Learning Card */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold mb-1">继续学习</h2>
                <p className="text-sm text-white/80">
                  还有 {todayGoal - learnedToday} 个单词等你掌握
                </p>
              </div>
              <motion.div
                className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayIcon className="w-7 h-7 ml-1" />
              </motion.div>
            </div>
            <Button
              variant="secondary"
              size="lg"
              className="w-full !bg-white !text-indigo-600 !font-semibold !rounded-xl hover:!bg-white/90"
              onClick={handleStartLearning}
            >
              开始学习
            </Button>
          </div>
        </motion.div>

        {/* Quick Entry Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Speak Entry */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => router.push("/speak")}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-4 text-white shadow-md hover:shadow-lg transition-shadow text-left h-full"
            >
              <div className="flex flex-col justify-between h-full">
                <p className="text-lg font-bold mb-1">🗣️ 我会说</p>
                <p className="text-xs text-white/70">说出完整句子</p>
              </div>
            </button>
          </motion.div>

          {/* Wordbook Entry */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => router.push("/wordbook")}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 text-white shadow-md hover:shadow-lg transition-shadow text-left h-full"
            >
              <div className="flex flex-col justify-between h-full">
                <p className="text-lg font-bold mb-1">📖 生词本</p>
                <p className="text-xs text-white/70">查看已收藏的单词</p>
              </div>
            </button>
          </motion.div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <ChartBarIcon className="w-6 h-6 text-indigo-500 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayAccuracy}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">正确率</p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <FireIcon className="w-6 h-6 text-orange-500 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{streak}天</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">连续学习</p>
          </motion.div>
        </div>

        {/* Word Categories */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">词库分类</h3>
          <div className="grid grid-cols-3 gap-3">
            {(categories.length > 0 ? categories.slice(0, 9) : [
              { name: "fruit", label: "水果", emoji: "🍎", count: 0 },
              { name: "animal", label: "动物", emoji: "🐶", count: 0 },
              { name: "color", label: "颜色", emoji: "🎨", count: 0 },
              { name: "number", label: "数字", emoji: "🔢", count: 0 },
              { name: "family", label: "家庭", emoji: "👨‍👩‍👧", count: 0 },
              { name: "food", label: "食物", emoji: "🍕", count: 0 },
              { name: "weather", label: "天气", emoji: "🌤️", count: 0 },
              { name: "mood", label: "心情", emoji: "😊", count: 0 },
              { name: "sport", label: "运动", emoji: "⚽", count: 0 },
            ]).map((cat) => (
              <motion.button
                key={cat.name}
                className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCategoryClick(cat.name)}
              >
                <span className="text-2xl block mb-1">{cat.emoji}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}