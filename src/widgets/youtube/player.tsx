"use client";

import { YouTubeEmbed } from "@next/third-parties/google";
import { useEffect, useRef } from "react";

import appConfig from "~/shared/app-config";
import { indexedDB } from "~/shared/lib/api/dexie";
import type { VideoData } from "~/shared/types-schema/types";

import { useVideoTracking } from "./use-video-tracking";

const iframeParams = `rel=0&playsinline=1&origin=${appConfig.url}`;

export default function YoutubePlayer(
  props: VideoData & { enableJsApi: boolean }
) {
  const { enableJsApi, ...video } = props;

  const { videoId, title } = video;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const firstLoad = useRef<boolean>(false);

  const { stopTracking, startTracking, isPlaying } = useVideoTracking({
    video,
    playerRef,
  });

  function getActivePlayers() {
    return document.querySelectorAll("iframe");
  }

  async function _onStateChange(event: YT.OnStateChangeEvent) {
    const { target, data: playingState } = event;
    const playerState = window.YT.PlayerState;

    const allPlayers = getActivePlayers();

    const filterPlayers = Array.from(allPlayers).filter(
      (item) => item != target.getIframe()
    );

    switch (playingState) {
      case playerState.CUED:
        stopTracking();
        firstLoad.current = false;
        break;
      case playerState.PAUSED:
        stopTracking();
        break;
      case playerState.ENDED:
        stopTracking();
        break;

      case playerState.PLAYING:
        // Stop other players
        filterPlayers.forEach((item) => {
          playerControl(item, "stopVideo");
        });

        // firstLoad - The video is being played after loaded previously (after paused or stopped),
        // isPlaying - Checks whether is video is actively playing, removal re-triggers the playing state causes a loop
        if (!firstLoad.current && !isPlaying.current) {
          const playedVideo = await indexedDB["history"].get(videoId);
          if (playedVideo) {
            target.seekTo(playedVideo.duration, true);
            isPlaying.current = true;
          }
        }
        isPlaying.current = true;
        startTracking();
        break;
    }
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

  // first load
  async function loadIFrameElement() {
    if (!enableJsApi) {
      return;
    }

    playerRef.current = await (
      containerRef.current?.querySelector("lite-youtube") as any
    )?.getYTPlayer();

    const playing = await indexedDB["history"].get(videoId);

    firstLoad.current = true;

    if (playing?.videoId === videoId) {
      playerRef.current?.seekTo(playing.duration, true);
    }
    // Set up player event listeners
    playerRef.current?.addEventListener("onStateChange", _onStateChange);
  }

  useEffect(() => {
    return () => {
      stopTracking();
      playerRef.current?.removeEventListener("onStateChange", _onStateChange);
    };
  }, []);

  return (
    <div ref={containerRef} onMouseDown={loadIFrameElement}>
      <YouTubeEmbed
        params={enableJsApi ? iframeParams + "&enablejsapi=1" : iframeParams}
        videoid={videoId}
        playlabel={title}
        js-api={enableJsApi}
      />
    </div>
  );
}
