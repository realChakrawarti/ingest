"use client";

import { YouTubeEmbed } from "@next/third-parties/google";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import appConfig from "~/shared/app-config";
import { useLocalUserSettings } from "~/shared/hooks/use-local-user-settings";
import { indexedDB } from "~/shared/lib/api/dexie";
import { cn } from "~/shared/utils/tailwind-merge";
import Log from "~/shared/utils/terminal-logger";

import { useVideoTracking } from "./use-video-tracking";

function getPlayingState(
  playerState: Record<string, number>,
  playingState: number
) {
  for (const key in playerState) {
    if (Object.hasOwn(playerState, key) && playerState[key] === playingState) {
      return key;
    }
  }
  return null;
}

function getActivePlayers() {
  return document.querySelectorAll("iframe");
}

async function playerControl(
  iframe: HTMLIFrameElement,
  action: "playVideo" | "stopVideo" | "pauseVideo" | "destroy"
) {
  const payload = JSON.stringify({
    args: [],
    event: "command",
    func: action,
  });

  iframe.contentWindow?.postMessage(payload, "*");
}

function getPlayerParams(
  enabledJsApi: boolean,
  audioLanguage: string | undefined,
  localVideoLanguageSettings?: string
) {
  let iframeParams = `rel=0&playsinline=1&origin=${appConfig.url}`;

  if (enabledJsApi) {
    iframeParams += "&enablejsapi=1";
  }

  // Global settings video language takes precedence over default videoLanguage
  if (localVideoLanguageSettings) {
    iframeParams += `&hl=${localVideoLanguageSettings}`;
  } else if (audioLanguage) {
    iframeParams += `&hl=${audioLanguage}`;
  }

  return iframeParams;
}

// Focus Mode Modal Component
function FocusModal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      
      document.addEventListener("keydown", handleEscape);
      
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      
      {/* Modal content - SIZE CONTROLLED HERE */}
      <div
        className="relative z-10 w-[80vw] h-[87vh] flex flex-col mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-20"
          aria-label="Close focus mode"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        {/* Player container - REMOVED THIS WRAPPER */}
        {children}
      </div>
    </div>,
    document.body
  );
}

// TODO: picture-in-picture - https://codepen.io/jh3y/pen/wBBOdNv

export default function YoutubePlayer(
  props: ZVideoMetadataCompatible & { enableJsApi: boolean }
) {
  const { enableJsApi, ...video } = props;

  const { videoId, videoTitle } = video;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const thisPlayerRef = useRef<YT.Player | null>(null);
  const loaded = useRef<boolean>(false);
  const isPlaying = useRef<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const { stopTracking, startTracking } = useVideoTracking({
    thisPlayerRef,
    video,
  });

  const { localUserSettings } = useLocalUserSettings(null);

  const _onStateChange = useCallback(
    async (event: YT.OnStateChangeEvent) => {
      const { target, data: playingState } = event;
      const playerIframe = target.getIframe();
      const playerState = window.YT.PlayerState;

      const allPlayers = getActivePlayers();

      const filterPlayers = Array.from(allPlayers).filter(
        (item) => item !== playerIframe
      );

      const played = await indexedDB["history"].get(videoId);

      // Debugging
      Log.debug(
        `${getPlayingState(playerState as any, playingState)}:
        ${videoTitle}`
      );

      switch (playingState) {
        case playerState.CUED: {
          stopTracking();
          playerIframe.style.opacity = "0";
          playerIframe.setAttribute("playing", "false");
          isPlaying.current = false;
          break;
        }
        case playerState.PAUSED: {
          stopTracking();
          break;
        }
        case playerState.ENDED: {
          stopTracking();
          isPlaying.current = false;
          break;
        }
        case playerState.PLAYING: {
          playerIframe.style.opacity = "1";
          thisPlayerRef.current?.setPlaybackRate(
            localUserSettings?.playbackRate ?? 1
          );
          playerIframe.setAttribute("playing", "true");

          // Stop other players
          // TODO: This triggers the onStateChange, UNSTARTED & CUED for stopped players. Maybe somehow check & skip?
          filterPlayers.forEach((item) => {
            playerControl(item, "stopVideo");
          });
          startTracking();
          isPlaying.current = true;
          break;
        }
        case playerState.BUFFERING: {
          if (
            loaded.current &&
            !isPlaying.current &&
            played?.duration &&
            played.duration > 0
          ) {
            thisPlayerRef.current?.seekTo(played.duration, true);
          }
          break;
        }
      }
    },
    [
      videoTitle,
      startTracking,
      stopTracking,
      videoId,
      localUserSettings?.playbackRate,
    ]
  );

  async function loadIFrameElement() {
    if (!enableJsApi) {
      return;
    }

    const played = await indexedDB["history"].get(videoId);

    if (!loaded.current) {
      thisPlayerRef.current = await (
        containerRef.current?.querySelector("lite-youtube") as any
      )?.getYTPlayer();

      thisPlayerRef.current?.addEventListener("onStateChange", _onStateChange);

      // Initial seeking
      if (played?.videoId === videoId) {
        thisPlayerRef.current?.seekTo(played.duration, true);
      }
    } else {
      // Play the video when continued after stopping, rest code in buffering
      thisPlayerRef.current?.playVideo();
    }
    thisPlayerRef.current?.setPlaybackRate(
      localUserSettings?.playbackRate ?? 1.0
    );
    loaded.current = true;
  }

  useEffect(() => {
    return () => {
      stopTracking();
      thisPlayerRef.current?.removeEventListener(
        "onStateChange",
        _onStateChange
      );
    };
  }, [_onStateChange, stopTracking]);

  const playerParams = getPlayerParams(
    enableJsApi,
    video.defaultVideoLanguage,
    localUserSettings?.videoLanguage
  );

  const PlayerContent = (
    <div
      tabIndex={0}
      className={cn(
        "rounded-lg overflow-hidden",
        !isFocusMode && "mx-[2px] md:mx-0",
        !isFocusMode && "group-hover/player:shadow-primary group-hover/player:shadow-[0_0_0_2px]",
        "outline-none relative group/video",
        isFocusMode && "w-full h-full flex items-center justify-center bg-black"
      )}
      ref={containerRef}
      onClick={loadIFrameElement}
    >
      {/* Focus Mode Button */}
      {!isFocusMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFocusMode(true);
          }}
          className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg opacity-0 group-hover/video:opacity-100 transition-opacity duration-200"
          aria-label="Enter focus mode"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>
      )}
      
      <div 
        className={cn(isFocusMode ? "w-full h-full" : "w-full h-full")}
        style={isFocusMode ? {
          position: 'relative',
          width: '100%',
          height: '100%'
        } : undefined}
      >
        <style jsx global>{`
          ${isFocusMode ? `
            lite-youtube {
              width: 100% !important;
              height: 100% !important;
              max-width: 100% !important;
              aspect-ratio: unset !important;
            }
            lite-youtube iframe {
              width: 100% !important;
              height: 100% !important;
            }
          ` : ''}
        `}</style>
        <YouTubeEmbed
          style={isFocusMode 
            ? `width: 100%; height: 100%; max-width: 100%; background-image: url(${video.videoThumbnail})`
            : `background-image: url(${video.videoThumbnail})`
          }
          params={playerParams}
          videoid={videoId}
          js-api={enableJsApi}
        />
      </div>
    </div>
  );

  return (
    <>
      {!isFocusMode ? (
        PlayerContent
      ) : null}
      
      <FocusModal isOpen={isFocusMode} onClose={() => setIsFocusMode(false)}>
        {PlayerContent}
      </FocusModal>
    </>
  );
}