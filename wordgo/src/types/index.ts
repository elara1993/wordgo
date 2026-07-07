// ==================== Word Entity ====================
export interface Word {
  id: string;
  word: string;
  phonetic: string | null;
  meaning: string;
  image: string | null;
  example: string | null;
  audioUrl: string | null;
  level: number;
  category: string;
  difficulty: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Word Progress ====================
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
  createdAt: Date;
  updatedAt: Date;
}

// ==================== User ====================
export interface User {
  id: string;
  username: string;
  email: string | null;
  avatar: string | null;
  streak: number;
  totalXP: number;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Daily Stat ====================
export interface DailyStat {
  id: string;
  userId: string;
  date: string;
  learned: number;
  reviewed: number;
  correct: number;
  wrong: number;
  xpEarned: number;
  createdAt: Date;
}

// ==================== Learning State ====================
export type LearningPhase = 'recognition' | 'listening' | 'speaking' | 'writing' | 'completed';

export interface LearningSession {
  currentWordIndex: number;
  totalWords: number;
  phase: LearningPhase;
  words: Word[];
  startTime: Date;
}

// ==================== AI Scoring ====================
export interface PronunciationScore {
  accuracy: number;
  fluency: number;
  completeness: number;
  overall: number;
}

// ==================== Learning Result ====================
export interface LearningResult {
  totalWords: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  xpEarned: number;
  duration: number;
}

// ==================== Sentence Entity ====================
export interface Sentence {
  id: string;
  wordId: string;
  text: string;
  translation: string | null;
  audioUrl: string | null;
  level: number;
  createdAt: Date;
  word?: Word;
}

// ==================== Category Types ====================
export type WordCategory = 'fruit' | 'animal' | 'color' | 'number' | 'family' | 'food' | 'general' | 'weather' | 'mood' | 'sport';
