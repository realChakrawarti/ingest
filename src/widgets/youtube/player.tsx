"use client";

import { YouTubeEmbed } from "@next/third-parties/google";
import { useEffect, useRef } from "react";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import appConfig from "~/shared/app-config";
import { indexedDB } from "~/shared/lib/api/dexie";
import { cn } from "~/shared/utils/tailwind-merge";

import { useVideoTracking } from "./use-video-tracking";

const iframeParams = `rel=0&playsinline=1&origin=${appConfig.url}`;

// TODO: picture-in-picture - https://codepen.io/jh3y/pen/wBBOdNv

export default function YoutubePlayer(
  props: ZVideoMetadataCompatible & { enableJsApi: boolean }
) {
  const { enableJsApi, ...video } = props;

  const { videoId, videoTitle } = video;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const firstLoad = useRef<boolean>(false);

  const { stopTracking, startTracking, isPlaying } = useVideoTracking({
    playerRef,
    video,
  });

  function getActivePlayers() {
    return document.querySelectorAll("iframe");
  }

  async function _onStateChange(event: YT.OnStateChangeEvent) {
    const { target, data: playingState } = event;
    const playerIframe = target.getIframe();
    const playerState = window.YT.PlayerState;

    const allPlayers = getActivePlayers();

    const filterPlayers = Array.from(allPlayers).filter(
      (item) => item !== playerIframe
    );

    switch (playingState) {
      case playerState.CUED: {
        stopTracking();
        firstLoad.current = false;
        playerIframe.style.opacity = "0";
        playerIframe.setAttribute("playing", "false");
        break;
      }
      case playerState.PAUSED: {
        stopTracking();
        break;
      }
      case playerState.ENDED: {
        stopTracking();
        break;
      }
      case playerState.PLAYING: {
        playerIframe.style.opacity = "1";
        playerIframe.setAttribute("playing", "true");
        // Stop other players
        filterPlayers.forEach((item) => {
          playerControl(item, "stopVideo");
        });

        // firstLoad - The video is being played after loaded previously (after paused or stopped),
        // isPlaying - Checks whether the video is actively playing,
        // removal re-triggers the playing state causes a loop
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
      case playerState.BUFFERING:
        {
          const seekedTime = target.getCurrentTime();
          if (seekedTime > 0) {
            target.seekTo(seekedTime, true);
            isPlaying.current = true;
          }
        }
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
    <div
      tabIndex={0}
      className={cn(
        "rounded-lg overflow-hidden mx-[2px] md:mx-0",
        "group-hover/player:shadow-primary group-hover/player:shadow-[0_0_0_2px]",
        "outline-none"
      )}
      ref={containerRef}
      onMouseDown={loadIFrameElement}
    >
      <YouTubeEmbed
        params={enableJsApi ? `${iframeParams}&enablejsapi=1` : iframeParams}
        videoid={videoId}
        playlabel={videoTitle}
        js-api={enableJsApi}
      />
    </div>
  );
}
