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
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-purple-100 dark:border-purple-900">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            WordGo
          </h1>
          <p className="text-gray-500 dark:text-gray-400">极简背单词</p>
        </div>
      </header>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md text-center border border-purple-100 dark:border-purple-900">
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
              {stats?.totalXP || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">总经验值</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md text-center border border-purple-100 dark:border-purple-900">
            <p className="text-4xl font-bold text-purple-500">{stats?.streak || 0}</p>
            <p className="text-sm text-gray-500 mt-2">连续天数</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md text-center border border-purple-100 dark:border-purple-900">
            <p className="text-4xl font-bold text-purple-700">{stats?.level || 1}</p>
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
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-purple-100 dark:border-purple-900"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {w.word}
                    </h3>
                    <p className="text-sm text-gray-500">{w.meaning}</p>
                  </div>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full">
                    {w.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Action Buttons - Centered */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {/* 继续学习 */}
          <button
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-10 rounded-2xl shadow-lg transition-all transform hover:scale-105"
            onClick={() => alert("进入学习模式")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            继续学习
          </button>
          {/* 我会说 */}
          <button
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white hover:bg-purple-50 text-purple-600 font-semibold py-4 px-10 rounded-2xl shadow-lg border-2 border-purple-600 transition-all transform hover:scale-105"
            onClick={() => alert("进入口语练习")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            我会说
          </button>
          {/* 生词本 */}
          <button
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white hover:bg-purple-50 text-purple-600 font-semibold py-4 px-10 rounded-2xl shadow-lg border-2 border-purple-600 transition-all transform hover:scale-105"
            onClick={() => alert("打开生词本")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            生词本
          </button>
        </div>
      </section>
    </div>
  );
}
