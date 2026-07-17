import type { RefObject } from "react";
import { useEffect, useState } from "react";

export function usePodcastPlayer(
  audioPlayerRef: RefObject<HTMLAudioElement | null>
) {
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer) return;

    setVolume(audioPlayer.volume ?? 1);

    const onLoaded = () => {
      setIsBuffering(false);
    };
    const onTime = () => setCurrent(audioPlayer.currentTime || 0);
    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);
    const onPlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrent(0);
    };

    audioPlayer.addEventListener("loadedmetadata", onLoaded, {
      signal: abortController.signal,
    });
    audioPlayer.addEventListener("timeupdate", onTime, {
      signal: abortController.signal,
    });
    audioPlayer.addEventListener("waiting", onWaiting, {
      signal: abortController.signal,
    });
    audioPlayer.addEventListener("canplay", onCanPlay, {
      signal: abortController.signal,
    });
    audioPlayer.addEventListener("canplaythrough", onCanPlay, {
      signal: abortController.signal,
    });
    audioPlayer.addEventListener("playing", onPlaying, {
      signal: abortController.signal,
    });
    audioPlayer.addEventListener("pause", onPause, {
      signal: abortController.signal,
    });
    audioPlayer.addEventListener("ended", onEnded, {
      signal: abortController.signal,
    });

    return () => {
      abortController.abort();
    };
  }, [audioPlayerRef]);

  function onSeek(value: number[], duration: number) {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer || !duration) return;
    const next = Math.min(Math.max(value[0], 0), duration);
    audioPlayer.currentTime = next;
    setCurrent(next);
  }

  function getActiveAudioPlayers() {
    return document.querySelectorAll("audio");
  }

  function togglePlay() {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer) {
      return;
    }

    const allAudioPlayers = getActiveAudioPlayers();

    const filterAudioPlayers = Array.from(allAudioPlayers).filter(
      (item) => item !== audioPlayer
    );

    filterAudioPlayers.forEach((item) => {
      item.pause();
    });

    if (isPlaying) {
      audioPlayer.pause();
    } else {
      setIsBuffering(audioPlayer.readyState < 3);
      audioPlayer.play();
    }
  }

  function onVolume(value: number[]) {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer) return;

    const next = Math.min(Math.max(value[0], 0), 1);
    audioPlayer.volume = next;
    setVolume(next);
  }

  return {
    onSeek,
    togglePlay,
    onVolume,
    current,
    volume,
    isPlaying,
    isBuffering,
  };
}