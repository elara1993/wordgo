import { create } from "zustand";
import type { Word, LearningPhase, LearningResult, PronunciationScore } from "@/types";

// ==================== User Store ====================
interface UserState {
  username: string;
  streak: number;
  totalXP: number;
  isLoaded: boolean;
  updateStreak: (delta: number) => void;
  addXP: (amount: number) => void;
  loadFromServer: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  username: "demo_user",
  streak: 0,
  totalXP: 0,
  isLoaded: false,
  updateStreak: (delta: number) =>
    set((state) => ({ streak: Math.max(0, state.streak + delta) })),
  addXP: (amount: number) =>
    set((state) => ({ totalXP: state.totalXP + amount })),
  loadFromServer: async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) return;
      const data = await res.json();
      set({
        username: data.user?.username || "demo_user",
        streak: data.user?.streak || 0,
        totalXP: data.user?.totalXP || 0,
        isLoaded: true,
      });
    } catch {
      // Keep defaults on error
    }
  },
}));

// ==================== Learning Store ====================
interface LearningState {
  currentPhase: LearningPhase;
  currentIndex: number;
  currentWord: Word | null;
  words: Word[];
  isLearning: boolean;
  result: LearningResult | null;
  pronunciationScore: PronunciationScore | null;

  // Actions
  setWords: (words: Word[]) => void;
  setCurrentWord: (word: Word) => void;
  advancePhase: () => void;
  resetPhase: () => void;
  startLearning: (words: Word[]) => void;
  finishLearning: (result: LearningResult) => void;
  setPronunciationScore: (score: PronunciationScore) => void;
  goToWord: (index: number) => void;
  nextWord: () => void;
  reset: () => void;
}

export const useLearningStore = create<LearningState>((set, get) => ({
  currentPhase: "recognition",
  currentIndex: 0,
  currentWord: null,
  words: [],
  isLearning: false,
  result: null,
  pronunciationScore: null,

  setWords: (words) => set({ words }),
  setCurrentWord: (word) => set({ currentWord: word }),
  goToWord: (index) => set({ currentIndex: index }),

  nextWord: () => {
    const { currentIndex, words } = get();
    if (currentIndex + 1 < words.length) {
      set({
        currentIndex: currentIndex + 1,
        currentWord: words[currentIndex + 1] ?? null,
      });
    } else {
      set({ currentPhase: "completed" });
    }
  },

  advancePhase: () => {
    const phases: LearningPhase[] = [
      "recognition",
      "listening",
      "speaking",
      "writing",
      "completed",
    ];
    const current = get().currentPhase;
    const nextIndex = phases.indexOf(current) + 1;
    if (nextIndex < phases.length) {
      set({ currentPhase: phases[nextIndex] });
    }
  },

  resetPhase: () => {
    set({ currentPhase: "recognition" });
  },

  startLearning: (words) => {
    const firstWord = words[0] ?? null;
    set({
      words,
      currentWord: firstWord,
      currentIndex: 0,
      currentPhase: "recognition",
      isLearning: true,
      result: null,
      pronunciationScore: null,
    });
  },

  finishLearning: (result) => {
    set({
      result,
      isLearning: false,
      currentPhase: "completed",
    });
  },

  setPronunciationScore: (score) => {
    set({ pronunciationScore: score });
  },

  reset: () => {
    set({
      currentPhase: "recognition",
      currentIndex: 0,
      currentWord: null,
      words: [],
      isLearning: false,
      result: null,
      pronunciationScore: null,
    });
  },
}));

// ==================== Today Stats Store ====================
interface TodayStatsState {
  learnedToday: number;
  correctToday: number;
  wrongToday: number;
  xpToday: number;
  isLoaded: boolean;
  incrementLearned: () => void;
  incrementCorrect: () => void;
  incrementWrong: () => void;
  addXPToday: (amount: number) => void;
  resetToday: () => void;
  loadFromServer: () => Promise<void>;
}

export const useTodayStatsStore = create<TodayStatsState>((set) => ({
  learnedToday: 0,
  correctToday: 0,
  wrongToday: 0,
  xpToday: 0,
  isLoaded: false,
  incrementLearned: () => set((s) => ({ learnedToday: s.learnedToday + 1 })),
  incrementCorrect: () => set((s) => ({ correctToday: s.correctToday + 1 })),
  incrementWrong: () => set((s) => ({ wrongToday: s.wrongToday + 1 })),
  addXPToday: (amount) => set((s) => ({ xpToday: s.xpToday + amount })),
  resetToday: () =>
    set({ learnedToday: 0, correctToday: 0, wrongToday: 0, xpToday: 0 }),
  loadFromServer: async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) return;
      const data = await res.json();
      set({
        learnedToday: data.today?.learned || 0,
        correctToday: data.today?.correct || 0,
        wrongToday: data.today?.wrong || 0,
        xpToday: data.today?.xpEarned || 0,
        isLoaded: true,
      });
    } catch {
      // Keep defaults on error
    }
  },
}));

// ==================== API Helpers ====================
export async function fetchWords(options?: {
  category?: string;
  limit?: number;
  search?: string;
}) {
  const params = new URLSearchParams();
  if (options?.category) params.set("category", options.category);
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.search) params.set("search", options.search);

  const res = await fetch(`/api/words?${params}`);
  if (!res.ok) return { words: [], total: 0 };
  return res.json() as Promise<{ words: Word[]; total: number }>;
}

export async function submitReview(wordId: string, correct: boolean) {
  const res = await fetch("/api/learning/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wordId, correct }),
  });
  if (!res.ok) return null;
  return res.json();
}