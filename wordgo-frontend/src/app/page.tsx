"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function HomePage() {
  const { login, fetchWords, stats, words, loading } = useStore();

  useEffect(() => {
    login("demo_user");
    fetchWords(1, 20, "all");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            WordGo
          </h1>
          <p className="text-gray-500 dark:text-gray-400">极简背单词</p>
        </div>
      </header>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md text-center">
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats?.totalXP || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">总经验值</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md text-center">
            <p className="text-4xl font-bold text-orange-500">{stats?.streak || 0}</p>
            <p className="text-sm text-gray-500 mt-2">连续天数</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md text-center">
            <p className="text-4xl font-bold text-green-500">{stats?.level || 1}</p>
            <p className="text-sm text-gray-500 mt-2">等级</p>
          </div>
        </div>
      </section>

      {/* Words */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">今日单词</h2>
        {loading ? (
          <p className="text-gray-500">加载中...</p>
        ) : (
          <div className="space-y-3">
            {words.map((w) => (
              <div
                key={w.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {w.word}
                    </h3>
                    <p className="text-sm text-gray-500">{w.meaning}</p>
                  </div>
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full">
                    {w.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Continue Button */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105"
          onClick={() => alert("进入学习模式")}
        >
          继续学习
        </button>
      </section>
    </div>
  );
}
