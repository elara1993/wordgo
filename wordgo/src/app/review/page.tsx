"use client";

import { motion } from "framer-motion";
import { ClockIcon, ArrowsRightLeftIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { BottomNav } from "@/components/navigation/bottom-nav";

export default function ReviewPage() {
  const dueWords = 8;
  const newWords = 12;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">复习</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          根据遗忘曲线，今天需要复习 {dueWords} 个单词
        </p>
      </div>

      <div className="px-6 space-y-4">
        {/* Due Review Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold mb-1">待复习</h2>
              <p className="text-sm text-white/80">{dueWords} 个单词需要复习</p>
            </div>
            <ArrowsRightLeftIcon className="w-12 h-12 text-white/30" />
          </div>
          <Button
            variant="secondary"
            size="lg"
            className="!rounded-xl !w-full !bg-white !text-indigo-600 !font-semibold"
          >
            <ArrowsRightLeftIcon className="w-5 h-5 mr-2" />
            开始复习
          </Button>
        </motion.div>

        {/* New Words Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">新学单词</h3>
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {newWords}
            </span>
          </div>
          <ProgressBar progress={45} showLabel height="h-2" />
        </motion.div>

        {/* Review History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center gap-3 mb-4">
            <ChartBarIcon className="w-6 h-6 text-indigo-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">本周复习统计</h3>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {["一", "二", "三", "四", "五", "六", "日"].map((day, i) => (
              <div key={day} className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{day}</p>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    i < 4
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                  }`}
                >
                  {i < 4 ? Math.floor(Math.random() * 15 + 5) : "-"}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
