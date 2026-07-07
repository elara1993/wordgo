export interface Word {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  image?: string;
  example?: string;
  audio?: string;
  level: number;
  category: string;
  difficulty: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WordProgress {
  id: string;
  userId: string;
  wordId: string;
  correct: number;
  wrong: number;
  mastery: number;
  lastReview: Date | null;
  nextReview: Date | null;
  reviewCount: number;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  totalXP: number;
  streak: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyStat {
  id: string;
  userId: string;
  date: string;
  learned: number;
  reviewed: number;
  correct: number;
  xpEarned: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
