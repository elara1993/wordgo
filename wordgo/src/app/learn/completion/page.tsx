"use client";

import { motion } from "framer-motion";
import { StarIcon, TrophyIcon, ArrowPathIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useLearningStore, useTodayStatsStore, useUserStore } from "@/store/learningStore";
import { useRouter } from "next/navigation";

export default function CompletionPage() {
  const router = useRouter();
  const { result } = useLearningStore();
  const { xpToday } = useTodayStatsStore();
  const { addXP, updateStreak } = useUserStore();

  // Apply XP to user
  if (result) {
    addXP(result.xpEarned);
    updateStreak(1);
  }

  const xp = result?.xpEarned ?? 30;
  const accuracy = result?.accuracy ?? 85;
  const total = result?.totalWords ?? 5;
  const correct = result?.correctCount ?? 4;

  const confettiParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    color: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"][i % 5],
    size: Math.random() * 8 + 4,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettiParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: p.color,
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: "-10px",
            }}
            animate={{
              y: ["0vh", "100vh"],
              x: [0, (Math.random() - 0.5) * 200],
              rotate: [0, Math.random() * 720],
              opacity: [1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 text-center space-y-8 max-w-sm"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Trophy */}
        <motion.div
          className="mx-auto w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <TrophyIcon className="w-12 h-12 text-yellow-300" />
        </motion.div>

        {/* Title */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">太棒了! 🎉</h1>
          <p className="text-white/80 text-lg">今日学习完成</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-3xl font-bold text-white">{total}</p>
            <p className="text-xs text-white/70">总词数</p>
          </motion.div>
          <motion.div
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-3xl font-bold text-green-300">{accuracy}%</p>
            <p className="text-xs text-white/70">正确率</p>
          </motion.div>
          <motion.div
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-3xl font-bold text-yellow-300">+{xp}</p>
            <p className="text-xs text-white/70">获得XP</p>
          </motion.div>
        </div>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((star) => (
            <motion.div
              key={star}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: star * 0.2, type: "spring" }}
            >
              <StarIcon
                className={`w-10 h-10 ${
                  accuracy >= star * 33 ? "text-yellow-300 fill-yellow-300" : "text-white/30"
                }`}
              />
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="secondary"
            size="lg"
            className="!rounded-2xl !w-full !text-lg !font-semibold !bg-white !text-indigo-600 hover:!bg-white/90"
            onClick={() => router.push("/learn")}
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            继续学习
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="!rounded-2xl !w-full !text-lg text-white hover:!bg-white/20"
            onClick={() => router.push("/")}
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            返回首页
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
