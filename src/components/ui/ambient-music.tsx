import { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TRACKS = [
  { src: "/audio/Silicon_Sitar.mp3", label: "🎵 Sitar" },
  { src: "/audio/birds.mp3", label: "🐦 Birds" },
  { src: "/audio/morning_birds.mp3", label: "🌅 Morning" },
  { src: "/audio/rain_ambient.mp3", label: "🌧️ Rain" },
  { src: "/audio/creek_water.mp3", label: "💧 Creek" },
  { src: "/audio/wind_fields.mp3", label: "🌾 Wind" },
  { src: "/audio/night_crickets.mp3", label: "🦗 Night" },
];

export const AmbientMusic = () => {
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const labelTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const audio = new Audio(TRACKS[0].src);
    audio.loop = true;
    audio.volume = 0.2;
    audio.preload = "none";
    audio.addEventListener("error", (e) => console.warn("Ambient audio failed to load", e));
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, []);

  const flashLabel = useCallback(() => {
    setShowLabel(true);
    clearTimeout(labelTimer.current);
    labelTimer.current = setTimeout(() => setShowLabel(false), 2000);
  }, []);

  const switchTrack = useCallback((newIndex: number, autoPlay: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = TRACKS[newIndex].src;
    audio.load();
    if (autoPlay) {
      audio.play()
        .then(() => setPlaying(true))
        .catch((err) => console.warn("Audio play blocked:", err));
    }
    setTrackIndex(newIndex);
    flashLabel();
  }, [flashLabel]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.src = TRACKS[trackIndex].src;
      audio.play()
        .then(() => setPlaying(true))
        .catch((err) => console.warn("Audio play blocked:", err));
      flashLabel();
    }
  }, [playing, trackIndex, flashLabel]);

  const nextTrack = useCallback(() => {
    const next = (trackIndex + 1) % TRACKS.length;
    switchTrack(next, playing);
  }, [trackIndex, playing, switchTrack]);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="rounded-full bg-card/90 backdrop-blur-md shadow-lg border border-border hover:bg-primary/10 h-11 w-11 transition-all"
        title={playing ? "Mute ambient sounds" : "Play ambient farm sounds"}
      >
        {playing ? (
          <Volume2 className="h-5 w-5 text-primary animate-pulse" />
        ) : (
          <VolumeX className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={nextTrack}
        className="rounded-full bg-card/90 backdrop-blur-md shadow-lg border border-border hover:bg-primary/10 h-9 w-9 transition-all"
        title="Next track"
      >
        <SkipForward className="h-4 w-4 text-muted-foreground" />
      </Button>

      <span
        className={cn(
          "text-xs font-medium bg-card/90 backdrop-blur-md border border-border rounded-full px-3 py-1.5 shadow-md transition-all duration-300 whitespace-nowrap",
          showLabel ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
        )}
      >
        {TRACKS[trackIndex].label}
      </span>
    </div>
  );
};
