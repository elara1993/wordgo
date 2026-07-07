export const aiService = {
  async textToSpeech(text: string): Promise<string> {
    return `data:audio/mp3;base64,${Buffer.from(text).toString("base64")}`;
  },

  async speechToText(audioBuffer: Buffer): Promise<string> {
    return audioBuffer.toString("utf-8").trim();
  },

  async scorePronunciation(
    _audioBuffer: Buffer,
    _targetWord: string
  ): Promise<{
    accuracy: number;
    fluency: number;
    completeness: number;
    overall: number;
  }> {
    return {
      accuracy: 0.9,
      fluency: 0.85,
      completeness: 0.95,
      overall: 0.9,
    };
  },

  async generateExample(word: string): Promise<string> {
    return `This is an example sentence using "${word}".`;
  },
};
