import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

// Ambient nature sounds URL (royalty-free)
const AMBIENT_URL = "https://cdn.pixabay.com/audio/2022/08/31/audio_419263e566.mp3";

export const AmbientMusic = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(AMBIENT_URL);
    audio.loop = true;
    audio.volume = 0.15;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="fixed bottom-4 left-4 z-50 rounded-full bg-card/80 backdrop-blur shadow-lg border border-border hover:bg-primary/10"
      title={playing ? "Mute ambient sounds" : "Play ambient farm sounds"}
    >
      {playing ? <Volume2 className="h-5 w-5 text-primary" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
    </Button>
  );
};
