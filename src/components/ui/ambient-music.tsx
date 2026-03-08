import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TRACKS = [
  { label: "🌾 Farm Morning", url: "https://cdn.pixabay.com/audio/2022/10/18/audio_29e6089fce.mp3" },
  { label: "🐦 Birds & Nature", url: "https://cdn.pixabay.com/audio/2022/08/31/audio_419263e566.mp3" },
  { label: "🌧️ Gentle Rain", url: "https://cdn.pixabay.com/audio/2022/05/16/audio_3b6e5b18e7.mp3" },
];

export const AmbientMusic = () => {
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(TRACKS[trackIdx].url);
    audio.loop = true;
    audio.volume = 0.12;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [trackIdx]);

  useEffect(() => {
    if (playing && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [trackIdx]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const switchTrack = (idx: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setTrackIdx(idx);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="rounded-full bg-card/90 backdrop-blur shadow-lg border border-border hover:bg-primary/10 h-10 w-10"
        title={playing ? "Mute ambient sounds" : "Play ambient farm sounds"}
      >
        {playing ? <Volume2 className="h-5 w-5 text-primary animate-pulse" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full bg-card/90 backdrop-blur shadow-lg border border-border hover:bg-primary/10 h-8 w-8">
            <Music className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top">
          {TRACKS.map((track, idx) => (
            <DropdownMenuItem
              key={idx}
              onClick={() => switchTrack(idx)}
              className={idx === trackIdx ? "bg-primary/10 font-medium" : ""}
            >
              {track.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
