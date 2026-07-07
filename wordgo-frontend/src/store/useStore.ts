import { create } from "zustand";
import { apiGet, apiPost } from "@/lib/api";

interface Word {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string | null;
  category: string;
  difficulty: number;
  level: number;
}

interface UserStats {
  totalXP: number;
  streak: number;
  level: number;
}

interface AppState {
  user: { id: string; username: string } | null;
  stats: UserStats | null;
  currentWord: Word | null;
  words: Word[];
  loading: boolean;
  login: (username: string) => Promise<void>;
  fetchWords: (page?: number, limit?: number, category?: string) => Promise<void>;
  fetchStats: (userId: string) => Promise<void>;
  submitAnswer: (userId: string, wordId: string, isCorrect: boolean) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  stats: null,
  currentWord: null,
  words: [],
  loading: false,

  login: async (username: string) => {
    const res = await apiPost("/users/login", { username });
    set({ user: { id: res.data.id, username: res.data.username } });
  },

  fetchWords: async (page = 1, limit = 20, category = "all") => {
    set({ loading: true });
    const res = await apiGet(`/words?page=${page}&limit=${limit}&category=${category}`);
    set({ words: res.data.items, loading: false });
  },

  fetchStats: async (userId: string) => {
    const res = await apiGet(`/users/${userId}/stats`);
    set({ stats: res.data.user });
  },

  submitAnswer: async (userId: string, wordId: string, isCorrect: boolean) => {
    await apiPost(`/users/${userId}/progress`, { wordId, isCorrect });
  },
}));
