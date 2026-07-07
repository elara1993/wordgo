"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  SpeakerWaveIcon,
  MicrophoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  BookmarkIcon,
  PlusCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid, StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLearningStore, useTodayStatsStore, submitReview } from "@/store/learningStore";
import { useRouter, useSearchParams } from "next/navigation";
import type { Word, LearningPhase } from "@/types";

const PHASE_LABELS: Record<LearningPhase, string> = {
  recognition: "认识单词",
  listening: "听音辨词",
  speaking: "跟读练习",
  writing: "默写单词",
  completed: "学习完成",
};

function LearnPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    currentWord,
    currentPhase,
    currentIndex,
    words,
    startLearning,
    finishLearning,
    advancePhase,
    goToWord,
    nextWord,
  } = useLearningStore();
  const { incrementLearned, incrementCorrect, incrementWrong, addXPToday } = useTodayStatsStore();

  const [isRecognized, setIsRecognized] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [dictationText, setDictationText] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  // Initialize learning session with real data from API
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const category = searchParams.get("category");
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    params.set("limit", "10");

    fetch(`/api/words?${params}`)
      .then((r) => r.json())
      .then((data) => {
        const fetchedWords = data.words || data;
        if (Array.isArray(fetchedWords) && fetchedWords.length > 0) {
          startLearning(fetchedWords);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams, startLearning]);

  const handleKnow = useCallback(() => {
    setIsRecognized(true);
    if (currentWord) {
      submitReview(currentWord.id, true);
      incrementCorrect();
      addXPToday(5);
    }
    advancePhase();
  }, [currentWord, advancePhase, incrementCorrect, addXPToday]);

  const [isInWordbook, setIsInWordbook] = useState(false);
  const [addingToWordbook, setAddingToWordbook] = useState(false);

  const handleAddToWordbook = useCallback(async () => {
    if (!currentWord || isInWordbook) return;
    setAddingToWordbook(true);
    try {
      const res = await fetch("/api/wordbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordId: currentWord.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsInWordbook(true);
      } else {
        console.error("加入生词本失败:", data.error);
      }
    } catch (err) {
      console.error("加入生词本请求异常:", err);
    } finally {
      setAddingToWordbook(false);
    }
  }, [currentWord, isInWordbook]);

  const handleDontKnow = useCallback(() => {
    setShowHint(true);
  }, []);

  const handleListen = useCallback(() => {
    if (currentWord && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentWord]);

  const handleStartRecording = useCallback(() => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const randomScore = Math.floor(Math.random() * 30) + 70;
      setPronunciationScore(randomScore);
      if (currentWord) {
        submitReview(currentWord.id, randomScore >= 80);
      }
    }, 3000);
  }, [currentWord]);

  const handleDictation = useCallback(() => {
    if (!currentWord) return;
    const normalizedInput = dictationText.trim().toLowerCase();
    const normalizedTarget = currentWord.word.toLowerCase();
    const correct = normalizedInput === normalizedTarget;
    setIsCorrect(correct);

    submitReview(currentWord.id, correct);

    if (correct) {
      incrementCorrect();
      incrementLearned();
      addXPToday(10);
    } else {
      incrementWrong();
    }
  }, [currentWord, dictationText, incrementCorrect, incrementLearned, incrementWrong, addXPToday]);

  const handleNextWord = useCallback(() => {
    if (currentIndex + 1 < words.length) {
      // Reset for next word
      setIsRecognized(false);
      setIsBookmarked(false);
      setIsInWordbook(false);
      setDictationText("");
      setIsCorrect(null);
      setShowHint(false);
      setPronunciationScore(null);
      nextWord();
    } else {
      // All words done
      finishLearning({
        totalWords: words.length,
        correctCount: 1,
        wrongCount: 0,
        accuracy: 100,
        xpEarned: 30,
        duration: 300,
      });
      router.push("/learn/completion");
    }
  }, [currentIndex, words, nextWord, finishLearning, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500">加载单词中...</p>
        </div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center space-y-4">
          <p className="text-gray-500 text-lg">没有找到单词</p>
          <Button variant="outline" onClick={() => router.push("/")}>
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="info">{PHASE_LABELS[currentPhase]}</Badge>
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {currentIndex + 1} / {words.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-800">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentIndex + 1) / words.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* ===== Recognition Phase ===== */}
          {currentPhase === "recognition" && (
            <motion.div
              key="recognition"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Word Card */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 text-center space-y-4">
                <div className="relative inline-block">
                  <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
                    {currentWord.word}
                  </h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 w-8 h-8 !p-0"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    {isBookmarked ? (
                      <BookmarkSolid className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <BookmarkIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                </div>

                {currentWord.phonetic && (
                  <p className="text-xl text-gray-500 dark:text-gray-400 font-mono">
                    {currentWord.phonetic}
                  </p>
                )}

                <div className="flex items-center justify-center gap-3">
                  <Button variant="secondary" size="icon" onClick={handleListen}>
                    <SpeakerWaveIcon className="w-6 h-6" />
                  </Button>
                  <Badge variant="info" className="text-sm px-4 py-1">
                    {currentWord.difficulty === "easy"
                      ? "简单"
                      : currentWord.difficulty === "medium"
                      ? "中等"
                      : "困难"}
                  </Badge>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-2xl font-medium text-gray-900 dark:text-white">
                    {currentWord.meaning}
                  </p>
                </div>

                {currentWord.example && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    "{currentWord.example}"
                  </p>
                )}
              </div>

              {/* Add to Wordbook */}
              <div className="flex justify-center">
                <button
                  onClick={handleAddToWordbook}
                  disabled={isInWordbook || addingToWordbook}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    isInWordbook
                      ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 cursor-default"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-600 dark:hover:text-yellow-400"
                  }`}
                >
                  {isInWordbook ? (
                    <StarSolid className="w-5 h-5" />
                  ) : (
                    <PlusCircleIcon className="w-5 h-5" />
                  )}
                  {isInWordbook
                    ? "已加入生词本"
                    : addingToWordbook
                    ? "添加中..."
                    : "加入生词本"}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="!rounded-2xl !text-lg !font-semibold"
                  onClick={handleDontKnow}
                >
                  不认识
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="!rounded-2xl !text-lg !font-semibold"
                  onClick={handleKnow}
                >
                  认识
                </Button>
              </div>
            </motion.div>
          )}

          {/* ===== Listening Phase ===== */}
          {currentPhase === "listening" && (
            <motion.div
              key="listening"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 text-center space-y-6">
                <SpeakerWaveIcon className="w-20 h-20 mx-auto text-indigo-500" />
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  仔细听这个单词
                </p>
                <Button
                  variant="primary"
                  size="xl"
                  className="!rounded-2xl !w-full"
                  onClick={handleListen}
                >
                  <SpeakerWaveIcon className="w-6 h-6 mr-2" />
                  播放发音
                </Button>
                <Button
                  variant="success"
                  size="lg"
                  className="!rounded-2xl !w-full"
                  onClick={() => advancePhase()}
                >
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  我听懂了
                </Button>
              </div>
            </motion.div>
          )}

          {/* ===== Speaking Phase ===== */}
          {currentPhase === "speaking" && (
            <motion.div
              key="speaking"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 text-center space-y-6">
                <MicrophoneIcon
                  className={`w-20 h-20 mx-auto transition-all duration-300 ${
                    isRecording
                      ? "text-red-500 animate-pulse scale-110"
                      : "text-indigo-500"
                  }`}
                />
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {isRecording
                    ? "正在录音..."
                    : pronunciationScore !== null
                    ? `得分: ${pronunciationScore}`
                    : "点击麦克风跟读单词"}
                </p>

                {!isRecording && pronunciationScore === null && (
                  <Button
                    variant="primary"
                    size="xl"
                    className="!rounded-2xl !w-full"
                    onClick={handleStartRecording}
                  >
                    <MicrophoneIcon className="w-6 h-6 mr-2" />
                    开始跟读
                  </Button>
                )}

                {pronunciationScore !== null && (
                  <div className="space-y-3">
                    <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                      {pronunciationScore}
                    </div>
                    <Button
                      variant="success"
                      size="lg"
                      className="!rounded-2xl !w-full"
                      onClick={() => advancePhase()}
                    >
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      继续
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ===== Writing Phase ===== */}
          {currentPhase === "writing" && (
            <motion.div
              key="writing"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 text-center space-y-6">
                <p className="text-3xl font-medium text-gray-900 dark:text-white">
                  {currentWord.meaning}
                </p>

                <div className="flex items-center justify-center gap-2">
                  <Badge variant="info">{currentWord.category}</Badge>
                  <Badge variant="warning">{currentWord.difficulty}</Badge>
                </div>

                {/* Hint display */}
                <div className="flex items-center justify-center gap-2 text-xl font-mono text-gray-400 dark:text-gray-500">
                  {currentWord.word.split("").map((letter, i) => (
                    <span key={i} className="w-8 h-10 border-b-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-lg">
                      {showHint && i < 3 ? letter : ""}
                    </span>
                  ))}
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={dictationText}
                    onChange={(e) => setDictationText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleDictation();
                    }}
                    placeholder="请输入英文单词..."
                    className="w-full text-center text-2xl font-bold py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    autoFocus
                  />

                  {isCorrect === null ? (
                    <Button
                      variant="primary"
                      size="xl"
                      className="!rounded-2xl !w-full"
                      onClick={handleDictation}
                      disabled={!dictationText.trim()}
                    >
                      提交
                    </Button>
                  ) : isCorrect ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-center gap-2 text-green-500">
                        <CheckCircleIcon className="w-8 h-8" />
                        <span className="text-xl font-bold">正确!</span>
                      </div>
                      <p className="text-sm text-gray-500">+10 XP</p>
                      <Button
                        variant="success"
                        size="lg"
                        className="!rounded-2xl !w-full"
                        onClick={handleNextWord}
                      >
                        下一题
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-center gap-2 text-red-500">
                        <XCircleIcon className="w-8 h-8" />
                        <span className="text-xl font-bold">错误</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        正确答案: <span className="font-bold text-gray-900 dark:text-white">{currentWord.word}</span>
                      </p>
                      <Button
                        variant="outline"
                        size="lg"
                        className="!rounded-2xl !w-full"
                        onClick={() => {
                          setIsCorrect(null);
                          setDictationText("");
                        }}
                      >
                        重试
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    }>
      <LearnPageContent />
    </Suspense>
  );
}