"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LIMIT_MINUTES = 5;
const LIMIT_MS = LIMIT_MINUTES * 60 * 1000;

/* ---------- helpers ---------- */

function randomProblem() {
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;

  switch (op) {
    case "+":
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      answer = a + b;
      break;
    case "-":
      a = Math.floor(Math.random() * 20) + 10;
      b = Math.floor(Math.random() * a);
      answer = a - b;
      break;
    case "×":
      a = Math.floor(Math.random() * 9) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      answer = a * b;
      break;
    default:
      a = 1;
      b = 1;
      answer = 2;
  }

  return { text: `${a} ${op} ${b} = ?`, answer };
}

function getElapsedKey() {
  return `wordgo_study_elapsed_${new Date().toISOString().slice(0, 10)}`;
}

/* ---------- component ---------- */

export default function StudyTimer({ children }: { children: React.ReactNode }) {
  const [elapsed, setElapsed] = useState<number>(0);
  const [locked, setLocked] = useState(false);
  const [problem, setProblem] = useState<{ text: string; answer: number } | null>(null);
  const [input, setInput] = useState("");
  const [wrongCount, setWrongCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore partial elapsed from today (so navigating between pages doesn't reset)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(getElapsedKey());
      if (saved) {
        const parsed = JSON.parse(saved) as { ts: number; elapsed: number };
        const now = Date.now();
        const recovered = parsed.elapsed + (now - parsed.ts);
        setElapsed(recovered);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Tick every second to keep UI responsive
  useEffect(() => {
    if (locked || elapsed >= LIMIT_MS) return;
    const id = setInterval(() => setElapsed((e) => e + 1000), 1000);
    return () => clearInterval(id);
  }, [locked, elapsed]);

  // Persist partial elapsed for cross-page continuity
  useEffect(() => {
    if (elapsed > 0 && !locked) {
      sessionStorage.setItem(getElapsedKey(), JSON.stringify({ ts: Date.now(), elapsed }));
    }
  }, [elapsed, locked]);

  // Trigger lock when limit reached
  useEffect(() => {
    if (elapsed >= LIMIT_MS && !locked) {
      setLocked(true);
      setProblem(randomProblem());
      setInput("");
      setWrongCount(0);
    }
  }, [elapsed, locked]);

  // Focus input after problem appears
  useEffect(() => {
    if (locked && inputRef.current) inputRef.current.focus();
  }, [locked]);

  const handleCheck = useCallback(() => {
    const num = parseInt(input, 10);
    if (Number.isNaN(num)) return;

    if (num === problem?.answer) {
      // Correct → unlock and reset timer
      setLocked(false);
      setProblem(null);
      setInput("");
      setWrongCount(0);
      sessionStorage.removeItem(getElapsedKey());
      setElapsed(0);
    } else {
      setWrongCount((c) => c + 1);
      // Generate harder / new problem on wrong answer
      setProblem(randomProblem());
      setInput("");
    }
  }, [input, problem]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCheck();
  };

  /* ---- locked overlay ---- */
  if (locked) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4"
        >
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🛑</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">学习时间到！</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              你已经学习了 {LIMIT_MINUTES} 分钟，休息一下眼睛吧～
            </p>
            <p className="text-xs text-red-500 mt-2">
              {wrongCount > 0 && `已答错 ${wrongCount} 次，继续加油！`}
            </p>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-6 mb-4">
            <p className="text-3xl font-mono font-bold text-indigo-600 dark:text-indigo-400 text-center mb-4">
              {problem?.text}
            </p>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入答案"
                className="flex-1 px-4 py-3 text-lg border-2 border-indigo-200 dark:border-indigo-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-colors"
              />
              <button
                onClick={handleCheck}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all active:scale-95"
              >
                确认
              </button>
            </div>
            {input && parseInt(input, 10) !== problem?.answer && (
              <p className="text-red-500 text-sm text-center mt-2 animate-pulse">❌ 不对哦，再想想！</p>
            )}
          </div>

          <p className="text-xs text-gray-400 text-center">
            答对题目后即可继续学习
          </p>
        </motion.div>
      </div>
    );
  }

  /* ---- normal mode with countdown toast ---- */
  const remaining = Math.max(0, LIMIT_MS - elapsed);
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const progress = Math.min(100, (elapsed / LIMIT_MS) * 100);

  return (
    <>
      {/* Countdown pill */}
      <AnimatePresence>
        {progress > 50 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur shadow-lg rounded-full px-4 py-2 flex items-center gap-2 border border-indigo-100 dark:border-indigo-800"
          >
            <span className="text-sm text-gray-600 dark:text-gray-300">
              ⏱️ {mins}:{secs.toString().padStart(2, "0")} 后需答题
            </span>
            <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  );
}
