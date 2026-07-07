import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getAIService } from "@/services/aiService";

interface AudioPlayButtonProps {
  text: string;
  className?: string;
  size?: number;
}

export function AudioPlayButton({ text, className, size = 24 }: AudioPlayButtonProps) {
  const [playing, setPlaying] = useState(false);
  const aiService = getAIService();

  const handlePlay = async () => {
    if (playing) return;
    setPlaying(true);
    try {
      const audioBlob = await aiService.tts(text);
      // In production, use real audio URL
      // For mock, use browser native speech synthesis
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 0.85;
        utterance.onend = () => setPlaying(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setPlaying(false);
      }
    } catch {
      setPlaying(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handlePlay}
      disabled={playing}
      className={className}
      aria-label="Play audio"
    >
      {playing ? (
        <SpeakerXMarkIcon className={`text-indigo-500`} style={{ width: size, height: size }} />
      ) : (
        <SpeakerWaveIcon className={`text-indigo-500`} style={{ width: size, height: size }} />
      )}
    </Button>
  );
}
