import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
import { SimulatedAudioPlayer } from "@/components/listening/SimulatedAudioPlayer";

interface SafeAudioPlayerProps {
  audioUrl?: string | null;
  fallbackText?: string;
  accentHint?: string; // 'US', 'GB', 'AU', etc.
  autoPlay?: boolean;
  onEnded?: () => void;
  onError?: (error: string) => void;
  className?: string;
  showControls?: boolean;
}

/**
 * SafeAudioPlayer - Strict Audio Priority Logic
 * 
 * PRIORITY 1: If audioUrl exists AND hasn't failed → render HTML5 Audio player
 * PRIORITY 2: If audioUrl fails OR no URL → render SimulatedAudioPlayer (TTS)
 * 
 * NO transcript is ever shown to prevent cheating.
 */
export function SafeAudioPlayer({
  audioUrl,
  fallbackText,
  accentHint,
  autoPlay = false,
  onEnded,
  onError,
  className = "",
  showControls = true,
}: SafeAudioPlayerProps) {
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Load and validate audio URL
  useEffect(() => {
    // Reset state when URL changes
    setLoadError(false);
    setIsLoading(true);
    setIsPlaying(false);
    setProgress(0);

    // No URL provided - go straight to fallback
    if (!audioUrl) {
      console.log("SafeAudioPlayer: No audioUrl provided, using TTS fallback");
      setLoadError(true);
      setIsLoading(false);
      return;
    }

    // Create audio element and attempt to load
    const audio = new Audio();
    audioRef.current = audio;
    audio.preload = "auto";
    audio.volume = isMuted ? 0 : 1;

    audio.onloadedmetadata = () => {
      console.log("SafeAudioPlayer: R2 audio loaded successfully", { duration: audio.duration });
      setDuration(audio.duration);
      setIsLoading(false);
      if (autoPlay) {
        audio.play().catch((err) => {
          console.error("SafeAudioPlayer: Autoplay failed:", err);
        });
      }
    };

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    
    audio.onended = () => {
      setIsPlaying(false);
      setProgress(0);
      onEnded?.();
    };

    audio.onerror = (e) => {
      console.error("SafeAudioPlayer: R2 Audio Failed, switching to TTS", e, audio.error);
      setLoadError(true);
      setIsLoading(false);
      onError?.("Audio failed to load");
    };

    // Set src to trigger load
    audio.src = audioUrl;

    // Also do a HEAD request to catch 404s early
    fetch(audioUrl, { method: "HEAD" })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
      })
      .catch((err) => {
        console.error("SafeAudioPlayer: HEAD check failed for R2 URL:", err);
        if (audioRef.current) {
          audioRef.current.src = ""; // Cancel audio load
        }
        setLoadError(true);
        setIsLoading(false);
      });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [audioUrl, autoPlay, onEnded, onError]);

  // Update muted state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 1;
    }
  }, [isMuted]);

  // Progress tracking
  useEffect(() => {
    if (isPlaying && audioRef.current && !loadError) {
      progressIntervalRef.current = window.setInterval(() => {
        const audio = audioRef.current;
        if (audio && audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, loadError]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    const newTime = (value[0] / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ===== STRICT PRIORITY LOGIC =====

  // PRIORITY 2: Fallback to SimulatedAudioPlayer (TTS)
  // This happens when: no URL, URL failed to load, or explicit error
  if (loadError || !audioUrl) {
    if (!fallbackText) {
      // No fallback text available - show minimal error
      return (
        <div className={`flex items-center gap-2 text-destructive ${className}`}>
          <span className="text-sm">Audio unavailable</span>
        </div>
      );
    }

    // Render SimulatedAudioPlayer with TTS (no autoPlay prop - SimulatedAudioPlayer handles it)
    return (
      <SimulatedAudioPlayer
        text={fallbackText}
        accentHint={accentHint as "US" | "GB" | "AU" | undefined}
        onComplete={onEnded}
        className={className}
      />
    );
  }

  // PRIORITY 1: Render HTML5 Audio player (R2 URL is valid)
  if (!showControls) {
    return null;
  }

  const currentTime = audioRef.current?.currentTime || 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Play/Pause Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlay}
        disabled={isLoading}
        className="h-10 w-10 rounded-full"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>

      {/* Progress Bar */}
      <div className="flex-1 flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-10 text-right">
          {formatTime(currentTime)}
        </span>
        <Slider
          value={[progress]}
          max={100}
          step={0.1}
          onValueChange={handleSeek}
          disabled={isLoading}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground w-10">
          {formatTime(duration)}
        </span>
      </div>

      {/* Volume Control */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMuted(!isMuted)}
        className="h-8 w-8"
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

export default SafeAudioPlayer;
