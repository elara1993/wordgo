"use client";

import { motion } from "framer-motion";
import { UserCircleIcon, FireIcon, SparklesIcon, CogIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useUserStore } from "@/store/learningStore";
import { BottomNav } from "@/components/navigation/bottom-nav";

export default function ProfilePage() {
  const { username, streak, totalXP } = useUserStore();

  const menuItems = [
    { icon: CogIcon, label: "设置", color: "text-gray-500" },
    { icon: SparklesIcon, label: "学习报告", color: "text-indigo-500" },
    { icon: FireIcon, label: "成就系统", color: "text-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">我的</h1>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <UserCircleIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{username}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">WordGo 学习者</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <FireIcon className="w-5 h-5 text-orange-500" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">{streak}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">连续天数</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <SparklesIcon className="w-5 h-5 text-yellow-500" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">{totalXP}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">总经验值</p>
            </div>
            <div className="text-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">Lv.3</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">当前等级</p>
            </div>
          </div>

          <div className="mt-4">
            <ProgressBar progress={65} showLabel height="h-2" />
          </div>
        </motion.div>

        {/* Menu Items */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <item.icon className={`w-6 h-6 ${item.color}`} />
              <span className="flex-1 font-medium text-gray-900 dark:text-white">{item.label}</span>
              <span className="text-gray-400">›</span>
            </motion.button>
          ))}
        </div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full mt-6 flex items-center justify-center gap-2 py-3 text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
        >
          <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
          退出登录
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
