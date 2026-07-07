/**
 * Abstract AI service interface for WordGo.
 * All AI operations go through this interface.
 * Implementation can be swapped (OpenAI, Azure, Gemini, etc.)
 */

export interface PronunciationScore {
  accuracy: number;
  fluency: number;
  completeness: number;
  overall: number;
}

export interface AIResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export abstract class AIService {
  /** Text-to-Speech: convert text to audio */
  abstract tts(text: string): Promise<Blob>;

  /** Speech-to-Text: convert audio to text */
  abstract speechToText(audioBlob: Blob): Promise<string>;

  /** Score pronunciation */
  abstract scorePronunciation(
    audioBlob: Blob,
    expectedWord: string
  ): Promise<PronunciationScore>;

  /** Generate example sentence */
  abstract generateExample(word: string): Promise<string>;
}

// ==================== Mock Implementation ====================
// Replace this with real API calls when integrating OpenAI/Azure/etc.

export class MockAIService extends AIService {
  async tts(text: string): Promise<Blob> {
    // In production, call TTS API and return audio blob
    console.log("[MockTTS]", text);
    // Return a minimal valid WAV blob as mock
    return new Blob([], { type: "audio/wav" });
  }

  async speechToText(audioBlob: Blob): Promise<string> {
    // In production, call STT API
    console.log("[MockSTT] Received audio blob:", audioBlob.size, "bytes");
    // Mock: return random word from common words
    const mockWords = ["apple", "banana", "cat", "dog", "happy"];
    return mockWords[Math.floor(Math.random() * mockWords.length)];
  }

  async scorePronunciation(
    audioBlob: Blob,
    expectedWord: string
  ): Promise<PronunciationScore> {
    // In production, call pronunciation scoring API
    console.log(
      "[MockScore] Expected:",
      expectedWord,
      "Audio:",
      audioBlob.size,
      "bytes"
    );
    // Return random scores between 60-100
    const accuracy = Math.floor(Math.random() * 40) + 60;
    const fluency = Math.floor(Math.random() * 40) + 60;
    const completeness = Math.floor(Math.random() * 30) + 70;
    const overall = Math.round((accuracy + fluency + completeness) / 3);
    return { accuracy, fluency, completeness, overall };
  }

  async generateExample(word: string): Promise<string> {
    console.log("[MockGenEx] Generate example for:", word);
    return `This is a generated example sentence using the word "${word}".`;
  }
}

// ==================== Singleton Instance ====================
let aiServiceInstance: AIService | null = null;

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    // TODO: Switch to real implementation based on environment
    // e.g., if (process.env.OPENAI_API_KEY) { aiServiceInstance = new OpenAIService(); }
    aiServiceInstance = new MockAIService();
  }
  return aiServiceInstance;
}
