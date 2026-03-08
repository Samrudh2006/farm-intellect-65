import { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AmbientMusic = () => {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/audio/Silicon_Sitar.mp3");
    audio.loop = true;
    audio.volume = 0.2;
    audio.preload = "auto";
    audio.addEventListener("canplaythrough", () => setReady(true));
    audio.addEventListener("error", (e) => console.warn("Ambient audio failed to load", e));
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play()
        .then(() => setPlaying(true))
        .catch((err) => console.warn("Audio play blocked:", err));
    }
  }, [playing]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="fixed bottom-4 left-4 z-50 rounded-full bg-card/90 backdrop-blur-md shadow-lg border border-border hover:bg-primary/10 h-11 w-11 transition-all"
      title={playing ? "Mute ambient sounds" : "Play ambient farm sounds"}
    >
      {playing ? (
        <Volume2 className="h-5 w-5 text-primary animate-pulse" />
      ) : (
        <VolumeX className="h-5 w-5 text-muted-foreground" />
      )}
    </Button>
  );
};
