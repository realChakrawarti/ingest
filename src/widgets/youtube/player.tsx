"use client";

import { useCallback, useEffect, useRef } from "react";

import { YouTubeEmbed } from "@next/third-parties/google";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import appConfig from "~/shared/app-config";
import { useLocalUserSettings } from "~/shared/hooks/use-local-user-settings";
import { indexedDB } from "~/shared/lib/api/dexie";
import { PlayerState } from "~/shared/lib/constants";

import { useVideoTracking } from "./use-video-tracking";

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

// TODO: picture-in-picture - https://codepen.io/jh3y/pen/wBBOdNv
export default function YoutubePlayer(
  props: ZVideoMetadataCompatible & {
    enableJsApi: boolean;
  }
) {
  const { enableJsApi, ...video } = props;

  const { videoId, videoTitle } = video;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const thisPlayerRef = useRef<YT.Player | null>(null);
  const loaded = useRef<boolean>(false);
  const isPlaying = useRef<boolean>(false);

  const { stopTracking, startTracking } = useVideoTracking({
    thisPlayerRef,
    video,
  });

  const { localUserSettings } = useLocalUserSettings(null);

  const _onStateChange = useCallback(
    async (event: YT.OnStateChangeEvent) => {
      const { target, data: state } = event;
      const playerIframe = target.getIframe();

      const allPlayers = getActivePlayers();
      const played = await indexedDB.history.get(videoId);

      const filterPlayers = Array.from(allPlayers).filter(
        (item) => item !== playerIframe
      );

      switch (state) {
        case PlayerState.CUED: {
          stopTracking();
          playerIframe.style.opacity = "0";
          playerIframe.setAttribute("playing", "false");
          isPlaying.current = false;
          break;
        }
        case PlayerState.PAUSED: {
          stopTracking();
          break;
        }
        case PlayerState.ENDED: {
          stopTracking();
          isPlaying.current = false;
          break;
        }
        case PlayerState.PLAYING: {
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
        case PlayerState.BUFFERING: {
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

    const played = await indexedDB.history.get(videoId);

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

  return (
    <div
      id="player-card"
      className="relative overflow-hidden"
      tabIndex={0}
      ref={containerRef}
      onClick={loadIFrameElement}
    >
      <YouTubeEmbed
        style={`background-image: url(${video.videoThumbnail})`}
        params={playerParams}
        videoid={videoId}
        js-api={enableJsApi}
      />
    </div>
  );
}